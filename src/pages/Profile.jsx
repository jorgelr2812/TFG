import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserAppointments, submitReview, getProfile } from '../lib/api'
import { getOrders } from '../lib/shop'
import { User, Calendar, ShoppingBag, Star, Award, ChevronRight, Clock, MessageSquare, Truck, Scissors, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, token, setAuth } = useAuth()
  const location = useLocation()
  const [appointments, setAppointments] = useState([])
  const [freshUser, setFreshUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('citas')

  useEffect(() => {
    // Sincronizar pestaña con la URL
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab === 'purchases') setActiveTab('pedidos')
    else if (tab === 'tracking') setActiveTab('tracking')
    else setActiveTab('citas')
  }, [location])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, profileRes] = await Promise.all([
          getUserAppointments(token),
          getProfile(token)
        ])
        setAppointments(apptsRes.appointments || [])
        if (profileRes.profile) {
          setFreshUser(profileRes.profile)
          // Opcional: Actualizar el contexto global si los puntos han cambiado
          if (profileRes.profile.puntos !== user?.puntos) {
            setAuth(profileRes.profile, token)
          }
        }
        
        const realOrders = getOrders().filter(o => o.userId === user?.id)
        if (realOrders.length > 0) {
          setOrders(realOrders)
        } else {
          // SIMULACIÓN PARA EL TFG: Pedido de prueba si no hay reales
          setOrders([{
            id: 'ORD-SIM-99',
            total: 25.50,
            status: 'En camino',
            createdAt: new Date().toISOString(),
            items: [
              { name: 'Cera Premium Matte JLR', quantity: 1, price: 15.00 },
              { name: 'Champú Anti-caída', quantity: 1, price: 10.50 }
            ]
          }])
        }
      } catch (err) {
        console.error('Error fetching profile data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchData()
  }, [user, token])

  const handleReview = async (appointmentId) => {
    const rating = window.prompt("Puntúa de 1 a 5 estrellas:", "5")
    const review = window.prompt("Déjanos un comentario:")
    if (rating && review) {
      try {
        await submitReview(appointmentId, review, parseInt(rating), token)
        toast.success("¡Gracias por tu valoración!")
        // Recargar para ver el cambio
        window.location.reload()
      } catch (err) {
        toast.error("Error al enviar la reseña")
      }
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completada': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'confirmada': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    }
  }

  return (
    <div className="container mx-auto px-6 py-20 max-w-6xl">
      {/* Header Perfil */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="relative">
          <div className="w-32 h-32 bg-brand-accent rounded-full flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-brand-accent/40">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
            <Award size={24} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tighter mb-2">{user?.email}</h1>
          <p className="text-gray-500 font-medium mb-6 uppercase tracking-widest text-xs">Miembro de Barbería JLR</p>
          <div className="inline-flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700">
            <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-2xl">
              <Star size={24} className="fill-brand-accent" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Puntos JLR</p>
              <p className="text-2xl font-black text-brand-dark dark:text-white">{(freshUser || user)?.puntos || 0} PTS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setActiveTab('citas')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'citas' ? 'bg-brand-dark text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-gray-500'}`}
        >
          <Calendar size={18} /> Mis Citas
        </button>
        <button 
          onClick={() => setActiveTab('pedidos')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'pedidos' ? 'bg-brand-dark text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-gray-500'}`}
        >
          <ShoppingBag size={18} /> Mis Compras
        </button>
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'tracking' ? 'bg-brand-dark text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-gray-500'}`}
        >
          <Truck size={18} /> Seguimiento
        </button>
      </div>

      {/* Grid de contenido */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* Lado Principal */}
        <section className="space-y-6">
          {activeTab === 'citas' ? (
            appointments.length > 0 ? (
              appointments.map(appt => (
                <div key={appt.id} className="card group hover:scale-[1.01] transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-5">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700">
                          <span className="text-[10px] font-black uppercase text-gray-400">{new Date(appt.fecha).toLocaleDateString('es-ES', { month: 'short' })}</span>
                          <span className="text-2xl font-black">{new Date(appt.fecha).getDate()}</span>
                       </div>
                       <div>
                          <h4 className="text-xl font-black tracking-tight">{appt.servicio}</h4>
                          <div className="flex items-center gap-3 text-xs text-brand-accent font-bold mt-1 uppercase tracking-widest">
                             <Clock size={14} /> {appt.hora}
                          </div>
                       </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(appt.estado)}`}>
                      {appt.estado}
                    </span>
                  </div>
                  
                  {appt.estado === 'completada' && !appt.review && (
                    <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800">
                      <button 
                        onClick={() => handleReview(appt.id)}
                        className="flex items-center gap-2 text-brand-accent font-bold text-sm hover:translate-x-2 transition-transform"
                      >
                        <MessageSquare size={16} /> ¡Danos tu opinión y gana 5 pts extra! <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                  {appt.review && (
                    <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800 italic text-sm text-gray-500">
                       " {appt.review} " ({appt.rating}★)
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card text-center py-20 text-gray-400">Sin citas registradas todavía.</div>
            )
          ) : activeTab === 'pedidos' ? (
            orders.length > 0 ? (
              orders.map(order => (
                <div key={order.id} className="card">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Pedido {order.id.slice(-6)}</span>
                    <span className="text-lg font-black text-brand-accent">{order.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm flex justify-between">
                         <span className="text-gray-600 dark:text-slate-300">{item.name} x {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] mt-6 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="card text-center py-20 text-gray-400">Aún no has comprado nada.</div>
            )
          ) : (
            /* Tab de Seguimiento */
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="card relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-brand-accent/10 text-brand-accent rounded-bl-3xl font-black text-[10px]">EN CAMINO</div>
                    <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                      <Truck className="text-brand-accent" /> Pedido #{order.id.slice(-6)}
                    </h3>
                    
                    <div className="relative pt-8 pb-4">
                       <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-slate-800 -translate-y-1/2 rounded-full"></div>
                       <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-brand-accent -translate-y-1/2 rounded-full"></div>
                       
                       <div className="relative flex justify-between">
                          {[
                            { label: 'Confirmado', icon: CheckCircle, active: true },
                            { label: 'Procesando', icon: Clock, active: true },
                            { label: 'Enviado', icon: Truck, active: true },
                            { label: 'Entregado', icon: ShoppingBag, active: false }
                          ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all ${step.active ? 'bg-brand-accent text-white scale-125' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'}`}>
                                 <step.icon size={16} />
                               </div>
                               <span className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-brand-dark dark:text-white' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-20 text-gray-400 italic">No hay pedidos activos para rastrear.</div>
              )}
            </div>
          )}
        </section>

        {/* Sidebar Informativa */}
        <aside className="space-y-8">
           <div className="card bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 overflow-hidden relative shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] rotate-12 translate-x-8 -translate-y-8 text-brand-dark dark:text-white">
                <Award size={160} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-brand-dark dark:text-white uppercase tracking-tighter">
                  <Award className="text-brand-accent" /> Beneficios JLR
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium italic">
                  Por cada 1€ gastado ganas 1 punto. Canjea tus puntos por descuentos directos en tu próxima visita.
                </p>
                
                <div className="space-y-5">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black uppercase text-brand-accent tracking-[0.2em] mb-1">Tu progreso actual</p>
                        <span className="text-sm font-black text-gray-800 dark:text-slate-200 uppercase">100 Puntos = 5€ Descuento</span>
                      </div>
                      <span className="text-xs font-black text-brand-dark dark:text-white">{(freshUser || user)?.puntos || 0} / 100</span>
                   </div>
                   
                   <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-slate-700">
                      <div 
                        className="bg-brand-accent h-full rounded-full shadow-lg transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(100, (((freshUser || user)?.puntos || 0) / 100) * 100)}%` }}
                      ></div>
                   </div>
                   
                   <div className="flex items-center gap-2 pt-2 bg-brand-accent/5 dark:bg-brand-accent/10 p-3 rounded-xl border border-brand-accent/10">
                      <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                      <p className="text-[10px] text-brand-accent font-black tracking-widest uppercase">Próximo objetivo: VIP JLR</p>
                   </div>
                </div>
              </div>
           </div>

           <div className="card">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Scissors size={20} className="text-brand-accent" /> Nuestros Barberos
              </h3>
              <div className="space-y-6">
                 {[
                   { name: 'Jorge', role: 'Fade Master', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100' },
                   { name: 'Luis', role: 'Color Specialist', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' }
                 ].map(b => (
                   <div key={b.name} className="flex items-center gap-4">
                      <img src={b.img} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-bold text-sm">{b.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{b.role}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  )
}
