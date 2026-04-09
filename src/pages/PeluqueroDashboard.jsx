import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Clock, CheckCircle, CalendarDays } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Skeleton from 'react-loading-skeleton';
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

export default function PeluqueroDashboard() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // 'table' or 'calendar'

  useEffect(() => {
    const fetchCitas = async () => {
      const { data, error } = await supabase
        .from('citas')
        .select('*')
        .neq('estado', 'cancelada')
        .order('fecha', { ascending: true });

      if (error) {
        console.error('Error fetching citas:', error);
      } else {
        setCitas(data || []);
      }
      setLoading(false);
    };

    fetchCitas();
  }, []);

  const updateEstado = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (!error) {
      setCitas(citas.map(cita => cita.id === id ? { ...cita, estado: nuevoEstado } : cita));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark dark-heading">Mi Agenda</h1>
          <p className="text-gray-600 dark-text mt-2">Aquí están tus citas programadas.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <button 
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded-lg ${view === 'table' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-900 dark-view-button'}`}
          >
            Tabla
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-lg ${view === 'calendar' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-900 dark-view-button'}`}
          >
            Calendario
          </button>
        </div>
      </div>

      <div className="bg-white overflow-hidden rounded-lg shadow-md border border-gray-200 dark-table">
        {loading ? (
          <div className="p-4">
            <Skeleton height={40} count={5} />
          </div>
        ) : view === 'table' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 dark-table-header border-b">
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Hora</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Servicio</th>
                <th className="p-4 font-semibold text-center">Estado</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id} className="border-b last:border-b-0 hover:bg-gray-50 dark-table-row transition-colors">
                  <td className="p-4">{new Date(cita.fecha).toLocaleDateString('es-ES')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium text-brand-dark dark-heading">
                      <Clock size={16} className="text-gray-400" />
                      {cita.hora}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                      <User size={16} className="text-gray-400" />
                      Cliente {cita.user_id}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{cita.servicio}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${cita.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center">
                    {cita.estado === 'pendiente' ? (
                      <button 
                        onClick={() => updateEstado(cita.id, 'completada')}
                        className="flex items-center gap-2 text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle size={16} /> Completar
                      </button>
                    ) : (
                      <span className="text-green-600 font-medium">Completada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ height: '600px' }}>
            <BigCalendar
              localizer={localizer}
              events={citas.map(cita => ({
                id: cita.id,
                title: `${cita.servicio} - Cliente ${cita.user_id}`,
                start: new Date(`${cita.fecha}T${cita.hora}`),
                end: new Date(new Date(`${cita.fecha}T${cita.hora}`).getTime() + 60 * 60 * 1000), // 1 hour
                resource: cita
              }))}
              startAccessor="start"
              endAccessor="end"
              culture="es"
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento"
              }}
              onSelectEvent={(event) => {
                if (event.resource.estado === 'pendiente') {
                  updateEstado(event.id, 'completada');
                }
              }}
            />
          </div>
        )
        }
        
        {!loading && citas.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No tienes citas asignadas para hoy. Tómate un café ☕
          </div>
        )}
      </div>
    </div>
  );
}
