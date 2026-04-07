import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Clock, CheckCircle } from 'lucide-react';

export default function PeluqueroDashboard() {
  const { user } = useAuth();

  // Mock de citas del día
  const citasHoy = [
    { id: 1, cliente: 'Carlos López', servicio: 'Corte Clásico', hora: '10:00 AM', estado: 'Pendiente' },
    { id: 2, cliente: 'Alejandro Martínez', servicio: 'Corte + Barba', hora: '11:30 AM', estado: 'Pendiente' },
    { id: 3, cliente: 'David García', servicio: 'Solo Barba', hora: '04:00 PM', estado: 'Pendiente' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Mi Agenda</h1>
          <p className="text-gray-600 mt-2">Bienvenido, aquí están tus citas para el día de hoy.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-brand-accent font-medium bg-blue-50 px-4 py-2 rounded-lg">
          <Calendar size={20} />
          <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="p-4 font-semibold">Hora</th>
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Servicio</th>
              <th className="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citasHoy.map((cita) => (
              <tr key={cita.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2 font-medium text-brand-dark">
                    <Clock size={16} className="text-gray-400" />
                    {cita.hora}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <User size={16} className="text-gray-400" />
                    {cita.cliente}
                  </div>
                </td>
                <td className="p-4 text-gray-600">{cita.servicio}</td>
                <td className="p-4 flex justify-center">
                  <button className="flex items-center gap-2 text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors">
                    <CheckCircle size={16} /> Completar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {citasHoy.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No tienes citas asignadas para hoy. Tómate un café ☕
          </div>
        )}
      </div>
    </div>
  );
}
