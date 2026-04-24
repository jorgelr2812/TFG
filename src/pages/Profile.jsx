import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserAppointments, submitReview } from '../lib/api'
import { getOrders } from '../lib/shop'
import { User, Calendar, ShoppingBag, Star, Award, ChevronRight, Clock, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, token } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('citas')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes] = await Promise.all([
          getUserAppointments(token)
        ])
        setAppointments(apptsRes.appointments || [])
        setOrders(getOrders().filter(o => o.userId === user?.id))
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
              <p className="text-2xl font-black text-brand-dark dark:text-white">{user?.puntos || 0} PTS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('citas')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === 'citas' ? 'bg-brand-dark text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-gray-500'}`}
        >
          <Calendar size={18} /> Mis Citas
        </button>
        <button 
          onClick={() => setActiveTab('pedidos')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === 'pedidos' ? 'bg-brand-dark text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-gray-500'}`}
        >
          <ShoppingBag size={18} /> Mis Pedidos
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
          ) : (
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
          )}
        </section>

        {/* Sidebar Informativa */}
        <aside className="space-y-8">
           <div className="card bg-brand-dark dark:bg-slate-900 border-none text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Award size={120} />
              </div>
              <h3 className="text-2xl font-black mb-4 relative z-10">Beneficios JLR</h3>
              <p className="text-gray-400 text-sm mb-8 relative z-10 leading-relaxed">
                Por cada 1€ gastado ganas 1 punto. Canjea tus puntos por descuentos directos en tu próxima visita.
              </p>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">100 Puntos</span>
                    <span className="font-bold">5€ Dto.</span>
                 </div>
                 <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-accent h-full" style={{ width: `${Math.min(100, (user?.puntos / 100) * 100)}%` }}></div>
                 </div>
                 <p className="text-[10px] text-brand-accent font-black tracking-widest">PRÓXIMO NIVEL: VIP JLR</p>
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
