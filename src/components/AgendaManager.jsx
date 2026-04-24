import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, User, CheckCircle, CalendarDays, Calendar as CalendarIcon, MoreHorizontal, ChevronRight } from 'lucide-react';
import { getAppointments, updateAppointmentStatus } from '../lib/api';
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
  const [viewMode, setViewMode] = useState('calendar'); // 'table' o 'calendar'
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await getAppointments(token)
        setCitas(response.appointments || [])
      } catch (err) {
        console.error('Error fetching citas:', err)
      } finally {
        setLoading(false)
      }
    };
    fetchCitas();
  }, [token]);

  const updateEstado = async (id, nuevoEstado, precio = undefined) => {
    try {
      await updateAppointmentStatus(id, nuevoEstado, token, precio)
      setCitas(citas.map(cita => cita.id === id ? { ...cita, estado: nuevoEstado, precio: precio || cita.precio } : cita))
      toast.success(`Cita actualizada a ${nuevoEstado}`)
    } catch (err) {
      toast.error('No se pudo actualizar el estado')
    }
  };

  const handleFinalizar = (id) => {
    const precio = window.prompt('Cobro final (€):', '15.00')
    if (precio !== null) {
      const p = parseFloat(precio)
      if (isNaN(p)) return toast.error('Precio no válido')
      updateEstado(id, 'completada', p)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completada': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'confirmada': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  }

  return (
    <div className="card border-none shadow-xl overflow-hidden p-0">
      {/* Header de Agenda */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <CalendarIcon className="text-brand-accent" /> Control de Agenda
          </h2>
          <p className="text-sm text-gray-500 font-medium">Gestiona turnos y cobros en tiempo real.</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500'}`}
          >
            Calendario
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500'}`}
          >
            Listado
          </button>
        </div>
      </div>

      <div className="p-0">
        {loading ? (
          <div className="p-8"><Skeleton height={400} /></div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-850/50 text-[10px] uppercase tracking-widest font-black text-gray-400">
                  <th className="px-6 py-4">Información Cita</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Manejo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {new Date(cita.fecha?.includes('T') ? cita.fecha.split('T')[0] : cita.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-brand-accent font-bold mt-0.5 uppercase tracking-tighter">
                        <Clock size={12} /> {cita.hora}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase">
                          {cita.user_email?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium">{cita.user_email || 'Sin registro'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-600 dark:text-slate-300">{cita.servicio}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {cita.estado === 'pendiente' && (
                          <button onClick={() => updateEstado(cita.id, 'confirmada')} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg group-hover:scale-110 transition">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                          <button onClick={() => handleFinalizar(cita.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg hover:shadow-lg hover:scale-105 transition">
                            Cobrar
                          </button>
                        )}
                        {cita.estado === 'completada' && (
                          <span className="font-black text-emerald-600 text-sm">
                            {parseFloat(cita.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4" style={{ height: '700px' }}>
            <BigCalendar
              localizer={localizer}
              events={citas.map(cita => {
                const datePart = cita.fecha && typeof cita.fecha === 'string' ? cita.fecha.split('T')[0] : new Date().toISOString().split('T')[0];
                const timePart = cita.hora || '00:00';
                const start = new Date(`${datePart}T${timePart}`);
                return {
                  id: cita.id,
                  title: `${cita.servicio} - ${cita.user_email?.split('@')[0] || 'Cliente'}`,
                  start,
                  end: new Date(start.getTime() + 45 * 60 * 1000), // 45 min duration
                  resource: cita
                };
              })}
              onSelectEvent={(e) => {
                if (window.confirm(`Gestionar cita: ${e.title}\nEstado actual: ${e.resource.estado}`)) {
                   if (e.resource.estado === 'pendiente') updateEstado(e.id, 'confirmada');
                   else if (e.resource.estado === 'confirmada') handleFinalizar(e.id);
                }
              }}
              culture="es"
              eventPropGetter={(e) => ({
                style: {
                  backgroundColor: e.resource.estado === 'completada' ? '#10b981' : e.resource.estado === 'confirmada' ? '#3b82f6' : '#f59e0b',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '4px 8px'
                }
              })}
              messages={{
                next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes", week: "Semana", day: "Día", agenda: "Agenda"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
