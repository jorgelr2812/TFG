import React from 'react'
import { Link } from 'react-router-dom'

export default function Gallery() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center text-brand-dark dark:text-white mb-12">Nuestra Galería</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Usando las imágenes estáticas disponibles en public/ */}
        <div className="rounded-xl overflow-hidden shadow-lg group">
          <img src="/ChatGPT Image 16 mar 2026, 16_44_49.png" alt="Interior Peluquería" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"/>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg group">
          <img src="/ChatGPT Image 12 mar 2026, 18_56_08.png" alt="Estilo Peluquería" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}/>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg group">
          <img src="/ChatGPT Image 16 mar 2026, 17_03_01.png" alt="Corte y Color" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}/>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <Link to="/" className="btn-primary">Volver al Inicio</Link>
      </div>
    </div>
  )
}
