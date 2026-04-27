import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <h4 className="text-2xl font-black tracking-tighter">BARBERÍA <span className="text-brand-accent">JLR</span></h4>
            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
              Elevando el arte de la barbería tradicional con un toque moderno y exclusivo. Tu estilo es nuestra pasión.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-brand-accent hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-brand-accent hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-brand-accent hover:text-white transition-all shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-brand-accent hover:text-white transition-all shadow-sm">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-brand-accent mb-6">Navegación</h5>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/" className="text-gray-500 hover:text-brand-dark dark:text-slate-400 dark:hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/gallery" className="text-gray-500 hover:text-brand-dark dark:text-slate-400 dark:hover:text-white transition-colors">Galería de Estilos</Link></li>
              <li><Link to="/store" className="text-gray-500 hover:text-brand-dark dark:text-slate-400 dark:hover:text-white transition-colors">Productos Premium</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-brand-dark dark:text-slate-400 dark:hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto Directo */}
          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-brand-accent mb-6">Encuéntranos</h5>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-accent shrink-0" />
                <span className="text-gray-500 dark:text-slate-400 leading-tight">Calle de la Victoria 123, Barber City, CP 28001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-accent shrink-0" />
                <span className="text-gray-500 dark:text-slate-400">+34 600 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-brand-accent shrink-0" />
                <span className="text-gray-500 dark:text-slate-400">Lun - Sáb: 09:00 - 20:00</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales Handle */}
          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-brand-accent mb-6">Comunidad JLR</h5>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">Síguenos para estar al día con los últimos estilos y promociones.</p>
            <p className="text-xl font-black">@BarberiaJLR</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © 2026 Barbería JLR. Desarrollado con Pasión.
          </p>
          <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-gray-400">
             <a href="#" className="hover:text-brand-accent transition-colors">Privacidad</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Términos</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
