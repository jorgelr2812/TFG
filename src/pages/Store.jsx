import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, ChevronRight, ArrowUpRight, Package, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { getProducts, saveProducts, getCart, saveCart, addOrder } from '../lib/shop'

// Página de tienda con carrito y gestión de pedidos local.
export default function Store() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setProducts(getProducts())
    setCart(getCart())
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
        <div className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3 text-brand-dark dark:text-white">
            <ShoppingCart className="w-5 h-5" /> Carrito
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="flex justify-between"><span>Productos</span><span>{cartQuantity}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={processing || !cartItems.length}
            className="btn-primary w-full text-center"
          >
            {processing ? 'Procesando...' : 'Finalizar compra'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
        <section>
          <div className="grid sm:grid-cols-2 gap-6">
            {products.map(product => (
              <article key={product.id} className="card group overflow-hidden relative">
                <div className="overflow-hidden rounded-3xl h-56 mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-brand-dark dark:text-white">{product.name}</h2>
                    <span className="text-lg font-bold text-brand-accent">{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
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
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-slate-950/95 border border-white/10 p-6 shadow-2xl shadow-slate-950/20 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Resumen de tu carrito</p>
                <p className="text-3xl font-bold">{cartQuantity} producto{cartQuantity !== 1 ? 's' : ''}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-brand-accent" />
            </div>
            <div className="space-y-4">
              {cartItems.length ? cartItems.map(item => (
                <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.quantity} x {item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity - 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 text-white"
                    >-</button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 text-white"
                    >+</button>
                  </div>
                </div>
              )) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-center text-slate-400">
                  Aún no hay productos en el carrito.
                </div>
              )}
            </div>
            <div className="mt-6 rounded-3xl bg-slate-800/90 p-4 text-sm text-slate-300">
              <p className="flex justify-between"><span>Total</span><span>{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3 text-brand-accent mb-4">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <p className="font-semibold">Compra con seguridad</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tu pedido se registra automáticamente y el stock se actualiza al instante.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Si eres peluquero, puedes gestionar el stock desde tu panel.</p>
            <Link to="/peluquero" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
              Ir a gestión de stock <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
