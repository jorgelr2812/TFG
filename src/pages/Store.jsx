import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Package, ShoppingBag, Loader2, Filter, Star } from 'lucide-react'
import { getProducts, saveProducts, getCart, saveCart, addOrder } from '../lib/shop'
import { getStoreProducts } from '../lib/api'
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { products: dbProducts } = await getStoreProducts()
        setProducts(dbProducts)
        saveProducts(dbProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
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

  const categories = ['Todos', 'Cuidado', 'Estilo', 'Afeitado', 'Packs']

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products
    return products.filter(p => p.category === activeCategory)
  }, [products, activeCategory])

  const cartItems = useMemo(() => {
    return cart.map(item => {
      const product = products.find(product => product.id === item.id)
      return product ? { ...item, name: product.name, price: product.price, image: product.image } : item
    })
  }, [cart, products])

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    if (!cartItems.length) return toast.error('Tu carrito está vacío.')
    if (!user) {
      toast.error('Inicia sesión para comprar.')
      navigate('/login')
      return
    }
    setShowPayment(true)
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
      setProducts(updatedProducts)
      saveProducts(updatedProducts)
      setCart([])
      
      const earned = Math.floor(totalPrice)
      updateUserPoints((user.puntos || 0) + earned)
      toast.success(`¡Compra completada! +${earned} puntos ganados.`)
    } catch (err) {
      toast.error('Error al procesar.')
    } finally {
      setProcessing(false)
    }
  }

  const handleQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== productId))
      return
    }
    setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item))
  }

  return (
    <div className="container mx-auto px-4 py-24">
      {showPayment && (
        <PaymentModal 
          amount={totalPrice} 
          onConfirm={handleProcessPurchase} 
          onClose={() => setShowPayment(false)} 
        />
      )}

      {/* Hero Header */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-accent/15 px-4 py-2 text-[10px] font-black text-brand-accent mb-6 uppercase tracking-[0.2em]">
            <Star size={14} className="fill-brand-accent" /> Exclusive Shop JLR
          </span>
          <h1 className="text-6xl font-black text-brand-dark dark:text-white tracking-tighter mb-4">La Tienda del Barbero</h1>
          <p className="text-xl text-gray-500 dark:text-slate-400 font-medium max-w-xl">
            Herramientas y cuidados de nivel profesional para mantener tu estilo intacto.
          </p>
        </div>
        
        <div className="card shadow-2xl p-8 w-full lg:w-96 bg-brand-dark dark:bg-slate-900 border-none text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <ShoppingCart size={120} />
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Carrito Actual</span>
                <span className="bg-brand-accent text-white px-3 py-1 rounded-full text-[10px] font-black">{cartQuantity} Items</span>
              </div>
              <div className="text-3xl font-black mb-8">{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</div>
              <button
                onClick={handleCheckout}
                disabled={processing || !cartItems.length}
                className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-accent/20"
              >
                {processing ? <Loader2 className="animate-spin inline mr-2" size={16} /> : 'Finalizar Pedido'}
              </button>
           </div>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="sticky top-24 z-40 bg-[var(--canvas)]/80 backdrop-blur-md py-4 mb-12 border-b border-[var(--border)] overflow-x-auto no-scrollbar">
         <div className="flex gap-4 min-w-max">
            <div className="flex items-center px-4 border-r border-[var(--border)] text-gray-400">
               <Filter size={18} />
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat 
                  ? 'bg-brand-dark text-white dark:bg-white dark:text-brand-dark shadow-xl scale-105' 
                  : 'bg-white dark:bg-slate-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
        {/* Product Grid */}
        <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <article key={product.id} className="card group p-0 overflow-hidden relative border-none shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="h-72 overflow-hidden relative">
                <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {product.category}
                   </span>
                </div>
                <div className="absolute top-4 right-4 h-10 w-10 bg-brand-accent text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg">
                   {Math.floor(product.price)}€
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black mb-2 uppercase tracking-tight group-hover:text-brand-accent transition-colors">{product.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 italic">{product.description}</p>
                </div>
                <button
                  onClick={() => {
                    if (product.stock > 0) {
                      const exist = cart.find(i => i.id === product.id)
                      setCart(exist ? cart.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i) : [...cart, {id: product.id, quantity: 1}])
                      toast.success(`Añadido: ${product.name}`)
                    }
                  }}
                  disabled={product.stock <= 0}
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    product.stock > 0 
                    ? 'bg-brand-dark dark:bg-slate-800 text-white hover:bg-brand-accent dark:hover:bg-brand-accent shadow-lg' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Existencias'}
                </button>
              </div>
            </article>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-32 text-center card bg-gray-50/50 dark:bg-slate-900/50 border-dashed border-2 border-gray-200 dark:border-slate-800">
               <Package size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No hay productos en esta categoría.</p>
            </div>
          )}
        </section>

        {/* Floating Sidebar Cart */}
        <aside className="sticky top-24 space-y-6">
          <div className="card shadow-2xl border-none p-8">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
               <ShoppingBag size={20} className="text-brand-accent" /> Mi Pedido
            </h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
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
            
            <div className="pt-8 border-t border-[var(--border)]">
              <div className="flex justify-between items-end mb-8">
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Estimado</p>
                   <p className="text-3xl font-black text-brand-dark dark:text-white tracking-tighter">{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
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
