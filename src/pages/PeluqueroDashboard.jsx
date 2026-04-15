import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Clock, CheckCircle, CalendarDays, Package, ArrowUpRight } from 'lucide-react';
import { getProducts, saveProducts, updateStock } from '../lib/shop';
import { getAppointments, updateAppointmentStatus } from '../lib/api';

// Panel para peluqueros con agenda de citas y control de stock.

// Panel para peluqueros con agenda de citas y control de stock.
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

export default function PeluqueroDashboard() {
  const { token } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // 'table' or 'calendar'
  const [products, setProducts] = useState([]);
  const [stockLoading, setStockLoading] = useState(true);

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
    const storedProducts = getProducts();
    setProducts(storedProducts);
    setStockLoading(false);
  }, [token]);

  const updateEstado = async (id, nuevoEstado) => {
    try {
      await updateAppointmentStatus(id, nuevoEstado, token)
      setCitas(citas.map(cita => cita.id === id ? { ...cita, estado: nuevoEstado } : cita))
    } catch (err) {
      console.error('Update appointment error:', err)
      toast.error('No se pudo actualizar el estado de la cita')
    }
  };

  const restockProduct = (productId, amount = 5) => {
    const updatedProducts = updateStock(productId, amount);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    const product = updatedProducts.find(item => item.id === productId);
    toast.success(`Reposición: ${product.name} +${amount} unidades`);
  };

  const lowStockProducts = products.filter(product => product.stock <= 5);

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

      <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-8">
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
          )}

          {!loading && citas.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No tienes citas asignadas para hoy. Tómate un café ☕
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-brand-dark dark:text-white">Gestión de inventario</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Reposición rápida para mantener el stock al día.</p>
              </div>
              <Package className="w-6 h-6 text-brand-accent" />
            </div>
            {stockLoading ? (
              <Skeleton height={140} />
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Stock actual: <span className="font-semibold text-slate-700 dark:text-slate-200">{product.stock}</span></p>
                      </div>
                      <button
                        onClick={() => restockProduct(product.id, 5)}
                        className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        <ArrowUpRight className="w-4 h-4" /> +5
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Alerta</h3>
            {lowStockProducts.length ? (
              <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-300">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-4">
                      <span>{product.name}</span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">{product.stock} unidades</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-slate-400">Todo el inventario está en niveles saludables.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
