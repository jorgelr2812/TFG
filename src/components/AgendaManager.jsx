import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, User, CheckCircle, CalendarDays, Calendar as CalendarIcon, MoreHorizontal, ChevronRight, Scissors } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, getBarberos, updateUserPointsApi } from '../lib/api';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es }
});

export default function AgendaManager() {
  const { token } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); 
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, barbRes] = await Promise.all([
          getAppointments(token),
          getBarberos()
        ])
        setCitas(apptsRes.appointments || [])
        setBarberos(barbRes.barberos || [])
      } catch (err) {
        console.error('Error fetching agenda data:', err)
      } finally {
        setLoading(false)
      }
    };
    fetchData();
  }, [token]);

  const updateEstado = async (id, nuevoEstado, precio = undefined) => {
    try {
      const cita = citas.find(c => c.id === id);
      await updateAppointmentStatus(id, nuevoEstado, token, precio);
      
      // Lógica de puntos al completar
      if (nuevoEstado === 'completada' && cita) {
        const table = { 'Corte': 10, 'Color': 25, 'Tratamiento': 20, 'Barba': 5 };
        const earn = table[cita.servicio] || 10;
        toast.success(`Cita cerrada. +${earn} puntos JLR.`);
      }

      setCitas(citas.map(c => c.id === id ? { ...c, estado: nuevoEstado, precio: precio || c.precio } : c));
      toast.success(`Cita: ${nuevoEstado}`);
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  const handleFinalizar = (id) => {
    const precio = window.prompt('Cobro final (€):', '15.00');
    if (precio !== null) {
      const p = parseFloat(precio);
      if (isNaN(p)) return toast.error('Precio no válido');
      updateEstado(id, 'completada', p);
    }
  }

  const getBarberName = (id) => {
    if (!id) return 'General';
    const b = barberos.find(b => b.id === Number(id));
    return b ? b.name : 'Asignado';
  }

  return (
    <div className="card border-none shadow-xl overflow-hidden p-0">
      <div className="p-6 border-b border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--surface)]">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <CalendarIcon className="text-brand-accent" /> Agenda Profesional
          </h2>
          <p className="text-sm text-gray-500 font-medium">Gestión de barberos y citas JLR.</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
           {['calendar', 'table'].map(m => (
             <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === m ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-dark dark:text-white' : 'text-gray-400'}`}>
               {m === 'calendar' ? 'Calendario' : 'Listado'}
             </button>
           ))}
        </div>
      </div>

      <div className="p-0 bg-[var(--surface)]">
        {loading ? <div className="p-8"><Skeleton height={400} /></div> : 
         viewMode === 'table' ? (
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-gray-50 dark:bg-slate-850/50 text-[10px] uppercase tracking-widest font-black text-gray-400">
                   <th className="px-6 py-4">Cita</th>
                   <th className="px-6 py-4">Cliente</th>
                   <th className="px-6 py-4">Barbero</th>
                   <th className="px-6 py-4">Servicio</th>
                   <th className="px-6 py-4 text-right">Acción</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border)]">
                 {citas.map(cita => (
                   <tr key={cita.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                     <td className="px-6 py-4 font-bold text-sm">
                       {new Date(cita.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                       <span className="block text-[10px] text-brand-accent font-black uppercase mt-1">{cita.hora}</span>
                     </td>
                     <td className="px-6 py-4 text-xs font-bold text-gray-500">
                       {cita.user_email?.split('@')[0]}
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center"><User size={12}/></div>
                           <span className="text-xs font-black">{getBarberName(cita.barberoId)}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${cita.estado === 'completada' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                         {cita.servicio}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                         <button onClick={() => handleFinalizar(cita.id)} className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg">Cobrar</button>
                       )}
                       {cita.estado === 'completada' && <span className="font-black text-emerald-600">{cita.precio}€</span>}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         ) : (
           <div className="p-4" style={{ height: '600px' }}>
              <BigCalendar
                localizer={localizer}
                events={citas.map(c => ({ id: c.id, title: `${c.servicio} (${getBarberName(c.barberoId)})`, start: new Date(`${c.fecha.split('T')[0]}T${c.hora}`), end: new Date(new Date(`${c.fecha.split('T')[0]}T${c.hora}`).getTime() + 45*60000), resource: c }))}
                messages={{ next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
                eventPropGetter={(e) => ({ style: { backgroundColor: e.resource.estado === 'completada' ? '#10b981' : '#3b82f6', borderRadius: '8px', border: 'none', fontSize: '10px' } })}
              />
           </div>
         )}
      </div>
    </div>
  );
}
