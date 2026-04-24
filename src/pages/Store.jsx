import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, ChevronRight, ArrowUpRight, Package, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react'
import { getProducts, saveProducts, getCart, saveCart, addOrder } from '../lib/shop'
import { getStoreProducts } from '../lib/api'

// Página de tienda con carrito y gestión de pedidos local.
export default function Store() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { products: dbProducts } = await getStoreProducts()
        setProducts(dbProducts)
        // Opcional: Actualizar localStorage con la versión de la DB
        saveProducts(dbProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        toast.error('No se pudieron cargar los productos de la base de datos.')
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

  const cartItems = useMemo(() => {
    return cart.map(item => {
      const product = products.find(product => product.id === item.id)
      return product ? { ...item, name: product.name, price: product.price, image: product.image } : item
    })
  }, [cart, products])

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const persistProducts = (nextProducts) => {
    setProducts(nextProducts)
    saveProducts(nextProducts)
  }

  const updateCart = (nextCart) => {
    setCart(nextCart)
    saveCart(nextCart)
  }

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error('Este producto está agotado. Pide reposición.')
      return
    }

    const existing = cart.find(item => item.id === product.id)
    const nextCart = existing
      ? cart.map(item => item.id === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) } : item)
      : [...cart, { id: product.id, quantity: 1 }]

    updateCart(nextCart)
    toast.success(`${product.name} añadido al carrito`)
  }

  const handleQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      updateCart(cart.filter(item => item.id !== productId))
      return
    }

    const product = products.find(item => item.id === productId)
    if (!product) return

    updateCart(cart.map(item => item.id === productId ? { ...item, quantity: Math.min(product.stock, quantity) } : item))
  }

  const handleCheckout = async () => {
    if (!cartItems.length) {
      return toast.error('Tu carrito está vacío.')
    }

    if (!user) {
      toast.error('Debes iniciar sesión para completar la compra.')
      navigate('/login')
      return
    }

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
        email: user.email || null,
        items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total: totalPrice,
        createdAt: new Date().toISOString()
      }

      addOrder(order)
      persistProducts(updatedProducts)
      updateCart([])
      toast.success('¡Compra confirmada! Revisa tus pedidos en el panel.')
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error('Error al procesar la compra.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-accent/15 px-4 py-2 text-sm font-semibold text-brand-accent mb-4">
            <Package className="w-4 h-4" /> Nueva Tienda
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-white leading-tight">Tienda de productos profesionales</h1>
          <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
            Compra los mejores productos de peluquería directamente desde el negocio. Elige, añade al carrito y confirma tu pedido en segundos.
          </p>
        </div>
        <div className="card shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent">
               <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="font-bold">Resumen rápido</span>
          </div>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between font-medium text-gray-500"><span>Artículos</span><span>{cartQuantity}</span></div>
            <div className="flex justify-between font-black text-lg"><span>Total</span><span className="text-brand-accent">{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={processing || !cartItems.length}
            className="btn-primary w-full py-3 text-sm"
          >
            {processing ? '...' : 'Checkout'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-500">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-brand-accent" />
              <p>Cargando productos de la base de datos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No hay productos disponibles</h2>
              <p className="text-gray-500">Vuelve más tarde para ver nuestras novedades.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {products.map(product => (
                <article key={product.id} className="card group overflow-hidden relative">
                  <div className="overflow-hidden rounded-3xl h-56 mb-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-xl font-semibold text-brand-dark dark:text-white uppercase line-clamp-1">{product.name}</h2>
                      <span className="text-lg font-bold text-brand-accent whitespace-nowrap">{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 5 ? 'bg-emerald-100 text-emerald-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        <ArrowUpRight className="w-4 h-4" /> Añadir
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="card shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-accent/10 rounded-xl text-brand-accent">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Tu Carrito</p>
                  <p className="text-2xl font-black tracking-tighter">{cartQuantity} Artículos</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {cartItems.length ? cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 group transition-all">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-brand-accent font-black tracking-tight">{item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => handleQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-brand-accent hover:text-white transition-all"
                      >-</button>
                      <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-brand-accent hover:text-white transition-all"
                      >+</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-gray-400 italic text-sm">
                  Carrito vacío
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total a pagar</span>
                  <span className="text-3xl font-black text-brand-accent tracking-tighter">{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
               </div>
               <button
                onClick={handleCheckout}
                disabled={processing || !cartItems.length}
                className="btn-primary w-full mt-6 py-4 text-lg bg-brand-dark dark:bg-brand-accent"
              >
                {processing ? 'Confirmando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>

          {(role === 'peluquero' || role === 'jefe') && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start gap-3 text-brand-accent mb-4">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-semibold text-brand-dark dark:text-white">Panel de Gestión</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Como profesional, puedes administrar el inventario directamente.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Accede a las herramientas de control de stock y pedidos.</p>
              <Link to={role === 'jefe' ? '/jefe' : '/peluquero'} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                Ir a gestión de stock <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
