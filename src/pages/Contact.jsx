import React from 'react'
import { MapPin, Phone, Clock, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Contact() {
  const contactItems = [
    { icon: MapPin, title: 'Dirección', text: 'Calle de la Barbería 123, Barber City' },
    { icon: Phone, title: 'Teléfono', text: '+34 600 000 000' },
    { icon: Mail, title: 'Email', text: 'contacto@barberiajlr.com' },
    { icon: Clock, title: 'Horario', text: 'Lun - Sáb: 09:00 - 20:00' }
  ]

  return (
    <div className="container mx-auto px-6 py-24 max-w-6xl">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black tracking-tighter mb-4">Estamos aquí para ti</h2>
        <div className="w-20 h-1.5 bg-brand-accent mx-auto rounded-full"></div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Info Column */}
        <div className="space-y-6">
          <div className="card h-full p-8">
            <h3 className="text-2xl font-black mb-8 border-b border-gray-100 dark:border-slate-800 pb-4">Detalles de Contacto</h3>
            
            <div className="space-y-8">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                    <item.icon size={24}/>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">{item.title}</h4>
                    <p className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Map Column */}
        <div className="card p-4 overflow-hidden min-h-[400px] group shadow-2xl relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12148.65173167576!2d-3.7037902!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI1JzAwLjQiTiAzwrA0MicyNS42Ilc!5e0!3m2!1ses!2ses!4v1612345678901!5m2!1ses!2ses" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy"
            className="rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </div>
      </div>

      {/* Social Media Support Row */}
      <div className="mt-16 text-center">
         <h3 className="text-xl font-black uppercase tracking-widest text-brand-accent mb-8">Síguenos en Redes</h3>
         <div className="flex justify-center gap-6">
           {[
             { Icon: Instagram, label: 'Instagram', handle: '@BarberiaJLR_oficial' },
             { Icon: Facebook, label: 'Facebook', handle: 'Barbería JLR' },
             { Icon: Twitter, label: 'Twitter', handle: '@JLRBarber' }
           ].map((social, i) => (
             <a key={i} href="#" className="flex flex-col items-center gap-3 group">
               <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl group-hover:bg-brand-accent group-hover:text-white transition-all transform group-hover:scale-110">
                 <social.Icon size={28} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-accent transition-colors">{social.label}</span>
             </a>
           ))}
         </div>
      </div>
    </div>
  )
}
