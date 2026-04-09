import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useForm } from 'react-hook-form'
import { Scissors, Palette, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const { user } = useAuth()
  const [sugerenciaTexto, setSugerenciaTexto] = useState('')
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const handleSugerencia = async (e) => {
    e.preventDefault()
    if (!user) return toast.error("Debes iniciar sesión para enviar una sugerencia.")
    
    const { error } = await supabase.from('sugerencias').insert([{ usuario_id: user.id, mensaje: sugerenciaTexto }])
    if (!error) {
      toast.success("¡Sugerencia enviada correctamente!")
      setSugerenciaTexto('')
    } else {
      toast.error("Error al enviar: " + error.message)
    }
  }

  const onSubmitCita = async (data) => {
    if (!user) return toast.error("Debes iniciar sesión para pedir una cita.")

    const { error } = await supabase.from('citas').insert([{ 
      user_id: user.id, 
      servicio: data.servicio, 
      fecha: data.fecha,
      hora: data.hora,
      estado: 'pendiente'
    }])

    if (!error) {
      toast.success("¡Cita solicitada correctamente!")
      reset()
    } else {
      toast.error("Error al solicitar cita: " + error.message)
    }
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-dark to-gray-800 dark:from-gray-900 dark:to-black text-white py-32 px-4 shadow-inner overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="/ChatGPT Image 16 mar 2026, 16_44_49.png" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">Bienvenido a su estilo</h1>
          <p className="text-xl max-w-2xl text-gray-200 dark:text-gray-100 mb-10">Ofrecemos servicios de peluquería, estética y cuidado capilar para todo tipo de clientes. Trato personalizado y resultados profesionales.</p>
          <button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-lg px-8 py-4">
            Reservar Cita
          </button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Sugerencias Form */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card">
          <h3 className="text-2xl font-bold mb-4 text-brand-dark dark-heading">Tus Sugerencias</h3>
          <p className="text-gray-500 dark-text mb-6">Ayúdanos a mejorar contándonos qué necesitas.</p>
          <form onSubmit={handleSugerencia} className="space-y-4">
            <textarea 
              value={sugerenciaTexto}
              onChange={(e) => setSugerenciaTexto(e.target.value)}
              className="input-field h-32 resize-none dark-input" 
              placeholder="Escribe tu sugerencia aquí..." 
              required
            />
            <button type="submit" className="btn-primary w-full dark-button">Enviar Sugerencia</button>
          </form>
        </section>

        {/* Citas Form */}
        <section id="servicios" className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card relative z-0">
          <h3 className="text-2xl font-bold mb-4 text-brand-dark dark-heading">Reserva tu servicio</h3>
          <form onSubmit={handleSubmit(onSubmitCita)} className="space-y-5">
            <div>
              <label className="block font-medium mb-1 text-gray-700 dark-label">Servicio:</label>
              <select {...register("servicio", { required: "Selecciona un servicio" })} className="input-field dark-input">
                <option value="Corte">Corte</option>
                <option value="Color">Color</option>
                <option value="Tratamiento">Tratamiento</option>
              </select>
              {errors.servicio && <p className="text-red-500 text-sm">{errors.servicio.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark-label">Fecha:</label>
                <input 
                  type="date" 
                  {...register("fecha", { 
                    required: "Selecciona una fecha",
                    min: { value: new Date().toISOString().split('T')[0], message: "No puedes seleccionar fechas pasadas" }
                  })} 
                  className="input-field dark-input" 
                />
                {errors.fecha && <p className="text-red-500 text-sm">{errors.fecha.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark-label">Hora:</label>
                <input 
                  type="time" 
                  {...register("hora", { 
                    required: "Selecciona una hora",
                    min: { value: "09:00", message: "Horario de apertura: 9:00" },
                    max: { value: "18:00", message: "Horario de cierre: 18:00" }
                  })} 
                  className="input-field dark-input" 
                />
                {errors.hora && <p className="text-red-500 text-sm">{errors.hora.message}</p>}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full shadow-lg hover:shadow-brand-accent/50 transform hover:-translate-y-0.5 transition-all dark-button">
              Solicitar Cita
            </button>
          </form>
        </section>
      </div>
      
      {/* Servicios listados */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-brand-dark">Nuestros Servicios Profesionales</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="card hover:shadow-xl transition-shadow border-t-4 border-brand-accent">
              <div className="flex items-center gap-2 mb-2">
                <Scissors className="w-6 h-6 text-brand-accent" />
                <h4 className="text-xl font-bold">Corte de Pelo</h4>
              </div>
              <p className="text-gray-600 mb-4">Cortes adaptados a tu estilo. Incluye lavado y masaje.</p>
              <span className="font-bold text-brand-accent text-lg">Desde 25€</span>
            </article>
            <article className="card hover:shadow-xl transition-shadow border-t-4 border-brand-accent">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-6 h-6 text-brand-accent" />
                <h4 className="text-xl font-bold">Coloración</h4>
              </div>
              <p className="text-gray-600 mb-4">Mechas Balayage, tintes sin amoniaco y corrección de color.</p>
              <span className="font-bold text-brand-accent text-lg">Desde 45€</span>
            </article>
            <article className="card hover:shadow-xl transition-shadow border-t-4 border-brand-accent">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-brand-accent" />
                <h4 className="text-xl font-bold">Tratamientos</h4>
              </div>
              <p className="text-gray-600 mb-4">Hidratación profunda, botox capilar y keratina.</p>
              <span className="font-bold text-brand-accent text-lg">Desde 30€</span>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
