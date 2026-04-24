import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, ChevronRight, ArrowUpRight, Package, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react'
import { getProducts, saveProducts, getCart, saveCart, addOrder } from '../lib/shop'
import { getStoreProducts } from '../lib/api'
import PaymentModal from '../components/PaymentModal'

export default function Store() {
  const { user, role, token, updateUserPoints } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

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

      <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-accent/15 px-4 py-2 text-xs font-black text-brand-accent mb-6 uppercase tracking-widest">
            <Package size={14} /> Tienda JLR
          </span>
          <h1 className="text-5xl font-black text-brand-dark dark:text-white tracking-tighter">Productos Premium</h1>
          <p className="mt-4 max-w-2xl text-gray-500 dark:text-slate-400 font-medium">
            Cuida tu estilo en casa con la misma calidad que usamos en el salón.
          </p>
        </div>
        
        <div className="card shadow-lg p-6 w-full md:w-80">
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
            className="btn-primary w-full py-3 text-sm font-black"
          >
            {processing ? '...' : 'Checkout'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_0.5fr] gap-12">
        <section className="grid sm:grid-cols-2 gap-8">
          {products.map(product => (
            <article key={product.id} className="card group p-0 overflow-hidden relative">
              <div className="h-64 overflow-hidden relative">
                <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-brand-dark/80 backdrop-blur-md text-white rounded-full text-xs font-black">
                  {product.price}€
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6">{product.description}</p>
                <button
                  onClick={() => {
                    if (product.stock > 0) {
                      const exist = cart.find(i => i.id === product.id)
                      setCart(exist ? cart.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i) : [...cart, {id: product.id, quantity: 1}])
                      toast.success('¡Añadido!')
                    }
                  }}
                  disabled={product.stock <= 0}
                  className="btn-primary w-full py-3 text-xs bg-brand-dark dark:bg-brand-accent"
                >
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-6">
          <div className="card shadow-2xl">
            <h3 className="text-xl font-black mb-6">Tu Carrito</h3>
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                  <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-xs">{item.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className="w-6 h-6 border rounded-md">-</button>
                       <span className="text-xs font-black">{item.quantity}</span>
                       <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="w-6 h-6 border rounded-md">+</button>
                    </div>
                  </div>
                </div>
              ))}
              {!cartItems.length && <p className="text-center py-4 text-gray-400 italic">Vacío</p>}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-black">
                <span>Total</span>
                <span className="text-brand-accent">{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
