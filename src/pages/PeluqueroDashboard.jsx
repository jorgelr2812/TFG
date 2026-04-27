import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Scissors, User, Clock } from 'lucide-react';
import AgendaManager from '../components/AgendaManager';

// Panel simplificado para peluqueros enfocado 100% en la gestión de citas.
export default function PeluqueroDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--canvas)] pb-20">
      {/* Header Premium */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-brand-accent font-black text-sm uppercase tracking-widest mb-3">
            <Scissors size={16} /> Panel del Profesional
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-brand-dark dark:text-white">Mi Agenda Diaria</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-lg italic">Organiza tus turnos y ofrece el mejor servicio JLR.</p>
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.5fr] gap-8">
          {/* Columna Principal: Agenda */}
          <section className="space-y-6">
            <AgendaManager />
          </section>

          {/* Columna Lateral: Resumen Rápido */}
          <aside className="space-y-6">
            <div className="card shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-accent group-hover:scale-110 transition-transform">
                 <Clock size={120} />
               </div>
               <h3 className="text-xl font-black mb-6 relative z-10 text-brand-dark dark:text-white">Estado de Hoy</h3>
               <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Jornada</span>
                    <span className="font-black text-emerald-500">ACTIVA</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Próximo Turno</span>
                    <span className="font-black text-brand-accent">10:30 AM</span>
                  </div>
               </div>
            </div>

            <div className="card">
               <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Consejo Pro</h4>
               <p className="text-sm text-gray-500 italic leading-relaxed">
                 "Un buen degradado empieza por una consulta detallada con el cliente. Tómate tu tiempo."
               </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
