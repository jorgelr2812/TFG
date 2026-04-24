import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Scissors, Sparkles, User, Image as ImageIcon } from 'lucide-react'

const galleryData = [
  { id: 1, category: 'salon', title: 'Nuestro Salón', src: '/galeria-1.png', alt: 'Interior Peluquería' },
  { id: 2, category: 'men', title: 'Estilo Clásico', src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop', alt: 'Classic Fade' },
  { id: 3, category: 'women', title: 'Coloración Premium', src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&auto=format&fit=crop', alt: 'Long Hair Color' },
  { id: 4, category: 'men', title: 'Pompadour Moderno', src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop', alt: 'Modern Pompadour' },
  { id: 5, category: 'salon', title: 'Herramientas', src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop', alt: 'Salon Detail' },
  { id: 6, category: 'men', title: 'Cuidado de Barba', src: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?w=800&auto=format&fit=crop', alt: 'Beard Trim' },
  { id: 7, category: 'women', title: 'Recogidos Boda', src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop', alt: 'Wedding Style' },
  { id: 8, category: 'men', title: 'Corte Infantil', src: 'https://images.unsplash.com/photo-1620331700431-7e6616091873?w=800&auto=format&fit=crop', alt: 'Kid\'s Haircut' },
  { id: 9, category: 'women', title: 'Tratamientos', src: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Corte y Color' },
  { id: 10, category: 'salon', title: 'Ambiente', src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Estilo Peluquería' }
]

export default function Gallery() {
  const [filter, setFilter] = useState('all')

  const filteredImages = filter === 'all' 
    ? galleryData 
    : galleryData.filter(img => img.category === filter)

  return (
    <div className="min-h-screen bg-[var(--canvas)] pb-20">
      {/* Header Section */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" /> TRABAJOS PROFESIONALES
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-brand-dark dark:text-white mb-6">Nuestra Exposición</h1>
          <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Explora nuestros mejores cortes, peinados y transformaciones. Calidad artesanal en cada detalle.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="flex flex-wrap justify-center gap-3 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl max-w-2xl mx-auto">
          {[
            { id: 'all', label: 'Todos', icon: ImageIcon },
            { id: 'men', label: 'Hombre', icon: Scissors },
            { id: 'women', label: 'Mujer', icon: Sparkles },
            { id: 'salon', label: 'Nuestro Salón', icon: Camera }
          ].map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  filter === cat.id 
                  ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/40' 
                  : 'text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img) => (
            <div 
              key={img.id} 
              className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-800"
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-accent text-[10px] uppercase font-black text-white mb-3">
                    {img.category === 'men' ? 'Barbería' : img.category === 'women' ? 'Estilismo' : 'Local'}
                  </span>
                  <p className="text-white text-2xl font-bold tracking-tight">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="py-20 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No hay fotos en esta categoría todavía.</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-10 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
