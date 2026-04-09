import React from 'react'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h2 className="text-4xl font-bold text-center text-brand-dark dark:text-white mb-12">Contacto e Información</h2>
      
      <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold mb-6 border-b pb-2 text-brand-dark dark:text-white">Detalles de Contacto</h3>
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-light p-3 rounded-full text-brand-accent"><MapPin size={24}/></div>
            <div>
              <h4 className="font-bold text-lg">Dirección</h4>
              <p className="text-gray-600 dark:text-gray-300">Calle Falsa 123, Ciudad, CP 28080</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-light p-3 rounded-full text-brand-accent"><Phone size={24}/></div>
            <div>
              <h4 className="font-bold text-lg">Teléfono</h4>
              <p className="text-gray-600 dark:text-gray-300">+34 900 123 456</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-light p-3 rounded-full text-brand-accent"><Mail size={24}/></div>
            <div>
              <h4 className="font-bold text-lg">Email</h4>
              <p className="text-gray-600 dark:text-gray-300">info@peluqueriaejemplo.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-light p-3 rounded-full text-brand-accent"><Clock size={24}/></div>
            <div>
              <h4 className="font-bold text-lg">Horario</h4>
              <p className="text-gray-600 dark:text-gray-300">Lunes a Viernes: 09:00 - 20:00<br/>Sábados: 09:00 - 14:00</p>
            </div>
          </div>
        </div>
        
        <div className="h-full min-h-[300px] w-full bg-gray-200 rounded-xl overflow-hidden relative">
          {/* Mapa simulado usando un iframe de Google Maps genérico o una imagen */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12148.65173167576!2d-3.7037902!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI1JzAwLjQiTiAzwrA0MicyNS42Ilc!5e0!3m2!1ses!2ses!4v1612345678901!5m2!1ses!2ses" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy"
            className="absolute inset-0"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
