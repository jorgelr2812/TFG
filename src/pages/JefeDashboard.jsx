import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Users, DollarSign, CalendarCheck } from 'lucide-react';

export default function JefeDashboard() {
  const { user } = useAuth();

  // Datos simulados para la demo
  const stats = [
    { name: 'Dinero Generado (Mes)', value: '€4,250', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Clientes Nuevos', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Citas Realizadas', value: '312', icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Crecimiento', value: '+14%', icon: BarChart3, color: 'text-brand-accent', bg: 'bg-blue-50' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-brand-dark">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Bienvenido, jefe. Aquí tienes el resumen del negocio.</p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card flex items-center p-6">
              <div className={`p-4 rounded-full mr-4 ${stat.bg}`}>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zonas adicionales para el futuro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card h-64 flex items-center justify-center border-dashed border-2 bg-gray-50">
          <p className="text-gray-500 font-medium">Gráfico de Ingresos (Espacio Reservado)</p>
        </div>
        <div className="card h-64 flex items-center justify-center border-dashed border-2 bg-gray-50">
          <p className="text-gray-500 font-medium">Lista de Empleados (Espacio Reservado)</p>
        </div>
      </div>
    </div>
  );
}
