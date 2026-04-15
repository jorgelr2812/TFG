import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock } from 'lucide-react'

// Pie de página con enlaces rápidos y datos de contacto.
export default function Footer() {
  return (
    <footer className="bg-brand-dark dark:bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-bold mb-4">🏠 Peluquería</h4>
          <p className="text-gray-300 dark:text-gray-200">Ofreciendo los mejores estilos y cuidados capilares para ti. Ven y descubre tu mejor versión.</p>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-gray-300 dark:text-gray-200">
            <li><Link to="/gallery" className="hover:text-brand-accent transition-colors">Galería</Link></li>
            <li><Link to="/store" className="hover:text-brand-accent transition-colors">Tienda</Link></li>
            <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contacto</Link></li>
            <li><a href="/#servicios" className="hover:text-brand-accent transition-colors">Servicios</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4">Contacto</h4>
          <ul className="space-y-3 text-gray-300 dark:text-gray-200">
            <li className="flex items-center gap-3"><MapPin size={18} className="text-brand-accent"/> Dirección de prueba 123</li>
            <li className="flex items-center gap-3"><Phone size={18} className="text-brand-accent"/> +34 900 123 456</li>
            <li className="flex items-center gap-3"><Clock size={18} className="text-brand-accent"/> L-V 09:00 - 20:00</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-400 dark:text-gray-300 text-sm mt-12 border-t border-gray-700 pt-6">
        © 2026 Peluquería. Todos los derechos reservados.
      </div>
    </footer>
  )
}
