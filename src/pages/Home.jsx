import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scissors, Palette, Sparkles, CalendarDays, Clock, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { createSuggestion, createAppointment, getAppointments, getBarberos } from '../lib/api'
import toast from 'react-hot-toast'

export default function Home() {
  const { user, token, updateUserPoints } = useAuth()
  const [sugerenciaTexto, setSugerenciaTexto] = useState('')
  const [allAppointments, setAllAppointments] = useState([])
  const [barberos, setBarberos] = useState([])
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      servicio: 'Corte',
      fecha: new Date().toISOString().split('T')[0],
      hora: '',
      barberoId: ''
    }
  })

  const selectedDate = watch('fecha')
  const selectedHora = watch('hora')
  const selectedServicio = watch('servicio')

  useEffect(() => {
    getBarberos().then(res => setBarberos(res.barberos))
    if (user && token) {
      getAppointments(token)
        .then(res => setAllAppointments(res.appointments || []))
        .catch(err => console.error("Error al cargar citas:", err))
    }
  }, [user, token])

  const calculatePoints = (servicio) => {
    const table = { 'Corte': 10, 'Color': 25, 'Tratamiento': 20, 'Barba': 5 }
    return table[servicio] || 0
  }

  const occupiedSlots = useMemo(() => {
    return allAppointments
      .filter(a => a && a.fecha && String(a.fecha).includes('T') && String(a.fecha).split('T')[0] === selectedDate && a.estado !== 'cancelada')
      .map(a => a.hora ? a.hora.substring(0, 5) : '')
  }, [allAppointments, selectedDate])

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ]

  const handleSugerencia = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Debes iniciar sesión para enviar una sugerencia.')
    try {
      await createSuggestion(sugerenciaTexto, token)
      toast.success('¡Gracias por tu mensaje!')
      setSugerenciaTexto('')
    } catch (err) {
      toast.error('No pudimos enviar tu mensaje.')
    }
  }

  const onSubmitCita = async (data) => {
    if (!user) return toast.error('Debes iniciar sesión para pedir cita.')
    try {
      await createAppointment({ servicio: data.servicio, fecha: data.fecha, hora: data.hora }, token)
      toast.success('¡Cita reservada! Te esperamos.')
      reset()
    } catch (err) {
      toast.error('Error al reservar: ' + err.message)
    }
  }

  return (
    <div className="w-full">
      {/* HERO SECTION CON FOTO DEL SALÓN */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/galeria-1.png" 
            alt="Nuestro Salón" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--canvas)]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/20 text-brand-accent text-sm font-bold mb-6 border border-brand-accent/30">
            ESPECIALISTAS EN IMAGEN
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Bienvenido a <br className="hidden md:block" /> nuestra Peluquería
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Tu estilo es nuestra pasión. Ofrecemos los mejores servicios de barbería y estilismo en un ambiente único y profesional.
          </p>
          <button 
            onClick={() => document.getElementById('reserva')?.scrollIntoView({ behavior: 'smooth' })} 
            className="btn-primary text-lg px-10 py-4 shadow-xl shadow-brand-accent/30"
          >
            Reservar Cita
          </button>
        </div>
      </section>

      {/* SECCIÓN DE RESERVA Y MENSAJES */}
      <div id="reserva" className="container mx-auto px-6 pb-24 -mt-20 relative z-20 grid lg:grid-cols-2 gap-10">
        {/* Formulario Citas */}
        <div className="card shadow-2xl border-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Solicita tu Cita</h3>
          </div>
          
          <form onSubmit={handleSubmit(onSubmitCita)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Servicio</label>
                <select {...register("servicio")} className="input-field">
                  <option value="Corte">Corte Profesional (10 pts)</option>
                  <option value="Color">Coloración / Tinte (25 pts)</option>
                  <option value="Tratamiento">Tratamiento Capilar (20 pts)</option>
                  <option value="Barba">Arreglo de Barba (5 pts)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Profesional</label>
                <select {...register("barberoId", { required: true })} className="input-field">
                  <option value="">Cualquier Barbero</option>
                  {barberos.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.specialty})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Fecha</label>
                <input type="date" {...register("fecha")} className="input-field" />
              </div>
              <div className="flex flex-col justify-center">
                 <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Recompensa JLR</p>
                    <p className="text-sm font-bold">Ganarás <span className="text-emerald-500">+{calculatePoints(selectedServicio)} puntos</span></p>
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Selecciona la hora</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map(time => {
                  const isOccupied = occupiedSlots.includes(time)
                  const isSelected = selectedHora === time
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setValue('hora', time)}
                      className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                        isOccupied 
                          ? 'bg-gray-100 dark:bg-slate-800/50 text-gray-300 dark:text-slate-700 border-transparent cursor-not-allowed' 
                          : isSelected
                            ? 'bg-brand-accent text-white border-brand-accent scale-105'
                            : 'bg-transparent border-gray-200 dark:border-slate-800 hover:border-brand-accent'
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
              <input type="hidden" {...register("hora", { required: "Debes elegir una hora" })} />
              {errors.hora && <p className="text-red-500 text-xs mt-2">{errors.hora.message}</p>}
            </div>

            <button type="submit" disabled={!selectedHora} className="btn-primary w-full py-4 text-lg">
              Confirmar para las {selectedHora || '--:--'}
            </button>
          </form>
        </div>

        {/* Sugerencias */}
        <div className="card shadow-2xl border-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Cuéntanos algo</h3>
          </div>
          <p className="text-gray-500 dark:text-slate-400 mb-8">¿Tienes alguna duda o sugerencia? Queremos escucharte para seguir mejorando nuestro salón.</p>
          <form onSubmit={handleSugerencia} className="space-y-6">
            <textarea 
              value={sugerenciaTexto}
              onChange={(e) => setSugerenciaTexto(e.target.value)}
              className="input-field h-44 resize-none" 
              placeholder="Escribe aquí tu duda o sugerencia..." 
              required
            />
            <button type="submit" className="btn-primary w-full py-4">Enviar Sugerencia</button>
          </form>
        </div>
      </div>

      {/* SECCIÓN DE RESEÑAS PREMIUM */}
      <section className="container mx-auto px-6 pt-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Opiniones de Nuestros Clientes</h2>
          <div className="flex justify-center gap-1 text-amber-400 mb-2">
             <Star size={18} className="fill-amber-400" />
             <Star size={18} className="fill-amber-400" />
             <Star size={18} className="fill-amber-400" />
             <Star size={18} className="fill-amber-400" />
             <Star size={18} className="fill-amber-400" />
          </div>
          <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Puntuación media: 4.9/5 basado en +200 citas</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: 'Antonio R.', r: 'El mejor degradado que me han hecho en años. Jorge es un artista.', c: 'VIP' },
            { n: 'María G.', r: 'Llevé a mi hijo y el trato fue espectacular. Muy profesionales y puntuales.', c: 'Habitual' },
            { n: 'Carlos P.', r: 'La barbería tiene un estilo increíble y los productos que venden son top.', c: 'VIP' }
          ].map((rev, i) => (
            <div key={i} className="card group hover:scale-[1.05] transition-all border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                  <Star size={80} />
               </div>
               <div className="flex gap-1 text-amber-400 mb-6">
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
               </div>
               <p className="text-lg italic font-medium text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">"{rev.r}"</p>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-brand-accent/30">{rev.n[0]}</div>
                  <div>
                    <h5 className="font-black text-sm">{rev.n}</h5>
                    <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{rev.c} JLR</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Nuestras Especialidades</h2>
          <div className="w-20 h-1 bg-brand-accent mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 group">
            <div className="w-16 h-16 bg-brand-accent/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Scissors className="w-8 h-8 text-brand-accent" />
            </div>
            <h4 className="text-xl font-bold mb-3">Barbería</h4>
            <p className="text-gray-500 dark:text-slate-400">Cortes clásicos y modernos con los mejores degradados de la zona.</p>
          </div>
          <div className="p-8 group">
            <div className="w-16 h-16 bg-brand-accent/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Palette className="w-8 h-8 text-brand-accent" />
            </div>
            <h4 className="text-xl font-bold mb-3">Coloración</h4>
            <p className="text-gray-500 dark:text-slate-400">Trabajos técnicos de color para resaltar tu personalidad.</p>
          </div>
          <div className="p-8 group">
            <div className="w-16 h-16 bg-brand-accent/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8 text-brand-accent" />
            </div>
            <h4 className="text-xl font-bold mb-3">Tratamientos</h4>
            <p className="text-gray-500 dark:text-slate-400">Cuidado capilar profundo para mantener tu pelo sano y brillante.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
