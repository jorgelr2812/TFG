import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Package, ShoppingBag, Loader2, Filter, Star, Coins, Search, AlertTriangle, Ticket } from 'lucide-react'
import { getProducts, saveProducts, getCart, saveCart, addOrder } from '../lib/shop'
import { getStoreProducts, updateUserPointsApi, updateProductStockApi } from '../lib/api'
import PaymentModal from '../components/PaymentModal'

// Página de tienda con categorías y gestión de pedidos.
export default function Store() {
  const { user, role, token, updateUserPoints } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0) // Porcentaje de descuento
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { products: dbProducts } = await getStoreProducts()
        if (dbProducts && Array.isArray(dbProducts)) {
          // Inyectar datos mock de valoraciones y badges si no vienen de DB
          const enhancedProducts = dbProducts.map(p => ({
            ...p,
            rating: p.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
            reviewCount: p.reviewCount || Math.floor(Math.random() * 50) + 5,
            badge: p.badge || (Math.random() > 0.8 ? 'Top Ventas' : Math.random() > 0.8 ? 'Nuevo' : null)
          }))
          setProducts(enhancedProducts)
          saveProducts(enhancedProducts)
        } else {
          // Fallback a locales si la API falla o viene vacía
          const localProducts = getProducts()
          setProducts(localProducts)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setProducts(getProducts()) // Fallback a DEFAULT_PRODUCTS
      } finally {
        setLoading(false)
      }
      setCart(getCart())
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  const categories = ['Todos', 'Cuidado', 'Estilo', 'Afeitado', 'Packs', 'Canje']

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, searchTerm])

  const cartItems = useMemo(() => {
    return cart.map(item => {
      const product = products.find(product => product.id === item.id)
      return product ? { ...item, name: product.name, price: product.price, image: product.image } : item
    })
  }, [cart, products])

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const rawTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (rawTotal * discount) / 100
  const totalPrice = rawTotal - discountAmount

  const nextReward = useMemo(() => {
    if (!user) return null
    const redeemableItems = products
      .filter(p => p.category === 'Canje' && p.point_price > user.puntos)
      .sort((a, b) => a.point_price - b.point_price)
    return redeemableItems.length > 0 ? redeemableItems[0] : null
  }, [products, user])

  const handleCheckout = () => {
    if (!cartItems.length) return toast.error('Tu carrito está vacío.')
    // Filter out items that are rewards (they should be redeemed individually or handled differently)
    // For now, let's say rewards can't be in the regular checkout cart
    const regularItems = cartItems.filter(item => !products.find(p => p.id === item.id)?.point_price)
    if (!regularItems.length && cartItems.length > 0) {
      return toast.error('Los artículos de canje se procesan individualmente.')
    }

    if (!user) {
      toast.error('Inicia sesión para comprar.')
      navigate('/login')
      return
    }
    setShowPayment(true)
  }

  const handleRedeem = async (product) => {
    if (!user) {
      toast.error('Inicia sesión para canjear puntos.')
      navigate('/login')
      return
    }
    if ((user.puntos || 0) < product.point_price) {
      return toast.error('No tienes suficientes puntos.')
    }

    setProcessing(true)
    try {
      const newPoints = user.puntos - product.point_price
      await updateUserPointsApi(newPoints, token)
      updateUserPoints(newPoints)

      const order = {
        id: `redeem-${Date.now()}`,
        userId: user.id,
        items: [{ id: product.id, name: product.name, price: 0, quantity: 1, points: product.point_price }],
        total: 0,
        createdAt: new Date().toISOString(),
        type: 'redemption'
      }
      addOrder(order)

      toast.success(`¡Canjeado con éxito! ${product.name}`)
    } catch (err) {
      toast.error('Error al procesar el canje.')
    } finally {
      setProcessing(false)
    }
  }

  const handleProcessPurchase = async () => {
    setShowPayment(false)
    setProcessing(true)
    try {
      const updatedProducts = products.map(product => {
        const item = cartItems.find(i => i.id === product.id)
        if (!item) return product
        return { ...product, stock: product.stock - item.quantity }
      })

      const order = {
        id: `order-${Date.now()}`,
        userId: user.id,
        items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total: totalPrice,
        createdAt: new Date().toISOString()
      }

      addOrder(order)
      setLastOrder(order) // Guardar para el recibo
      setProducts(updatedProducts)
      saveProducts(updatedProducts)
      setCart([])

      // Update backend stock
      await updateProductStockApi(cartItems.map(item => ({ id: item.id, quantity: item.quantity })))

      const earned = Math.floor(totalPrice)
      const newPoints = (user.puntos || 0) + earned
      await updateUserPointsApi(newPoints, token)
      updateUserPoints(newPoints)
      toast.success(`¡Compra completada! +${earned} puntos ganados.`)

      // Mostrar recibo tras un breve delay
      setTimeout(() => setShowReceipt(true), 500)
    } catch (err) {
      toast.error('Error al procesar.')
    } finally {
      setProcessing(false)
    }
  }

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim()
    if (appliedCoupon) return toast.error('Ya has aplicado un cupón.')

    const validCoupons = {
      'BARBER20': 20,
      'JLR10': 10,
      'TFG': 50,
      'BIENVENIDA': 15
    }

    if (validCoupons[code]) {
      setDiscount(validCoupons[code])
      setAppliedCoupon(code)
      setCouponCode('')
      toast.success(`¡Cupón aplicado! Descuento del ${validCoupons[code]}%`)
    } else {
      toast.error('Cupón no válido.')
    }
  }

  const handleQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== productId))
      return
    }
    setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item))
  }

  const SkeletonCard = () => (
    <div className="card p-0 overflow-hidden relative border-none shadow-xl animate-pulse">
      <div className="h-72 bg-gray-200 dark:bg-slate-800" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-5/6" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  )

  const ReceiptModal = ({ order, onClose }) => {
    if (!order) return null
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 font-mono text-xs text-slate-800 dark:text-slate-200 relative">
            {/* Retro Ticket Design */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle,transparent_0,transparent_4px,#fff_4px,#fff)] bg-[length:12px_12px] -mt-1 dark:hidden" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle,transparent_0,transparent_4px,#fff_4px,#fff)] bg-[length:12px_12px] -mb-1 dark:hidden" />

            <div className="text-center mb-6 space-y-1">
              <h4 className="text-xl font-black uppercase tracking-tighter italic">Barbería JLR</h4>
              <p>Calle Falsa 123, Madrid</p>
              <p>CIF: B-12345678</p>
              <div className="border-b border-dashed border-slate-300 dark:border-slate-700 my-4" />
              <p className="font-bold">ORDEN: {order.id}</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className="space-y-4 mb-6">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="font-bold uppercase">{item.name}</p>
                    <p className="opacity-60">{item.quantity} x {Number(item.price).toFixed(2)}€</p>
                  </div>
                  <span className="font-black">{(item.quantity * Number(item.price)).toFixed(2)}€</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-4 space-y-2">
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>DESCUENTO ({appliedCoupon})</span>
                  <span>-{discount}%</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black pt-2">
                <span>TOTAL</span>
                <span>{order.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>

            <div className="mt-8 text-center space-y-4">
              <p className="italic">¡Gracias por confiar en JLR!</p>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                <p className="font-black text-brand-accent">+{Math.floor(order.total)} PUNTOS GANADOS</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 bg-brand-dark dark:bg-white dark:text-brand-dark text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
              >
                Cerrar Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-16">
      {showReceipt && <ReceiptModal order={lastOrder} onClose={() => setShowReceipt(false)} />}

      {showPayment && (
        <PaymentModal
          amount={totalPrice}
          onConfirm={handleProcessPurchase}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* Hero Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-accent/15 px-4 py-2 text-[10px] font-black text-brand-accent mb-6 uppercase tracking-[0.2em]">
            <Star size={14} className="fill-brand-accent" /> Exclusive Shop JLR
          </span>
          <h1 className="text-6xl font-black text-brand-dark dark:text-slate-100 tracking-tighter mb-4">La Tienda del Barbero</h1>
          <p className="text-xl text-gray-500 dark:text-slate-300 font-medium max-w-xl leading-snug">
            Herramientas y cuidados de nivel profesional para mantener tu estilo intacto.
          </p>
        </div>

        <div className="card shadow-2xl p-5 w-full lg:w-80 border-none relative overflow-hidden group hover:shadow-brand-accent/10 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-accent">
            <ShoppingCart size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400">Carrito</span>
              <span className="bg-brand-accent text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg shadow-brand-accent/20">{cartQuantity} Items</span>
            </div>
            <div className="text-3xl font-black mb-4 tracking-tighter text-brand-dark dark:text-white">
              {totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <button
              onClick={handleCheckout}
              disabled={processing || !cartItems.length}
              className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-accent/20"
            >
              {processing ? <Loader2 className="animate-spin inline mr-2" size={16} /> : 'Finalizar Compra'}
            </button>
            {user && (
              <div className="mt-3 flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2">
                  <Coins size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest">Mis puntos</span>
                </div>
                <span className="font-black text-base text-amber-600 dark:text-amber-400">{user.puntos || 0}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Category Tabs Bar */}
      <div className="sticky top-24 z-20 bg-[var(--canvas)]/80 backdrop-blur-md py-4 mb-12 border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-xs font-bold focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all outline-none"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar w-full md:flex-1">
            <div className="flex items-center px-4 border-r border-[var(--border)] text-gray-400">
              <Filter size={18} />
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 min-w-max ${activeCategory === cat
                    ? 'bg-brand-dark text-white dark:bg-white dark:text-brand-dark shadow-xl scale-105'
                    : 'bg-white dark:bg-slate-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
        {/* Product Grid */}
        <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filteredProducts.map(product => (
              <article key={product.id} className="card group p-0 overflow-hidden relative border-none shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="h-64 overflow-hidden relative bg-gray-100 dark:bg-slate-800">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={product.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop' }}
                  />

                  {/* Badges Section */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg animate-bounce-slow ${product.badge === 'Top Ventas' ? 'bg-amber-500 text-white' : 'bg-brand-accent text-white'
                        }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 h-10 w-10 bg-brand-accent text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg">
                    {product.point_price ? <div className="flex flex-col items-center leading-none"><Coins size={12} /><span>{product.point_price}</span></div> : `${Math.floor(product.price)}€`}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-amber-500">
                        <Star size={12} className="fill-current" />
                        <span className="text-[10px] font-black ml-1">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">({product.reviewCount} opiniones)</span>
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-tight group-hover:text-brand-accent transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 italic">{product.description}</p>

                    {/* Stock Urgency Indicator */}
                    {product.category !== 'Canje' && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${product.stock <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                            {product.stock <= 5 ? '¡Stock Crítico!' : 'Unidades Disponibles'}
                          </span>
                          <span className="text-[10px] font-bold">{product.stock}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${product.stock <= 5 ? 'bg-red-500' : 'bg-brand-accent'}`}
                            style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (product.point_price) {
                        handleRedeem(product)
                      } else if (product.stock > 0) {
                        const exist = cart.find(i => i.id === product.id)
                        setCart(exist ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...cart, { id: product.id, quantity: 1 }])
                        toast.success(`Añadido: ${product.name}`)
                      }
                    }}
                    disabled={processing || (product.category !== 'Canje' && product.stock <= 0)}
                    className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${product.category === 'Canje'
                        ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg'
                        : product.stock > 0
                          ? 'bg-brand-dark dark:bg-slate-800 text-white hover:bg-brand-accent dark:hover:bg-brand-accent shadow-lg'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {processing ? <Loader2 className="animate-spin inline mr-2" size={16} /> :
                      product.category === 'Canje' ? 'Canjear Puntos' :
                        product.stock > 0 ? 'Añadir al Carrito' : 'Sin Existencias'}
                  </button>
                </div>
              </article>
            ))
          )}
          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full py-32 text-center card bg-gray-50/50 dark:bg-slate-900/50 border-dashed border-2 border-gray-200 dark:border-slate-800">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No hay productos en esta categoría.</p>
            </div>
          )}
        </section>

        <aside className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-4 pb-4">
          <div className="card shadow-2xl border-none p-5">
            <h3 className="text-base font-black mb-4 flex items-center gap-3">
              <ShoppingBag size={18} className="text-brand-accent" /> Mi Pedido
            </h3>
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar mb-5">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=100&auto=format&fit=crop'}
                      className="w-full h-full object-cover"
                      alt=""
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=100&auto=format&fit=crop' }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-black text-[10px] uppercase tracking-tight leading-tight mb-1">{item.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-brand-accent">{item.price}€</span>
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-1 px-2 rounded-lg">
                        <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors">-</button>
                        <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {!cartItems.length && (
                <div className="py-10 text-center">
                  <p className="text-gray-400 text-xs italic">El carrito está vacío</p>
                </div>
              )}
            </div>

            <div className="pt-5 border-t border-[var(--border)]">
              {/* Cupón de Descuento */}
              {!discount ? (
                <div className="mb-6 flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Cupón (ej. BARBER20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-transparent focus:border-brand-accent rounded-xl text-[10px] font-bold outline-none transition-all uppercase"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 bg-brand-dark dark:bg-slate-700 text-white text-[10px] font-black rounded-xl hover:bg-brand-accent transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              ) : (
                <div className="mb-6 flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Ticket size={16} />
                    <span className="text-[10px] font-black uppercase">Cupón {appliedCoupon} Activo</span>
                  </div>
                  <span className="text-xs font-black text-green-600">-{discount}%</span>
                </div>
              )}

              <div className="flex justify-between items-end mb-5">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Estimado</p>
                  <div className="flex flex-col">
                    {discount > 0 && (
                      <span className="text-sm line-through text-gray-400 font-bold decoration-red-500/50">
                        {rawTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </span>
                    )}
                    <p className="text-3xl font-black text-brand-dark dark:text-white tracking-tighter">
                      {totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={processing || !cartItems.length}
                className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest"
              >
                Tramitar Pedido
              </button>
            </div>
          </div>

          <div className="card bg-brand-accent/5 border-none p-6 text-center">
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] mb-2">Envío Gratuito</p>
            <p className="text-xs text-gray-500 font-medium">En pedidos superiores a 40€</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
