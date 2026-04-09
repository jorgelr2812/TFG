import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Users, DollarSign, CalendarCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Skeleton from 'react-loading-skeleton';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function JefeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch citas count
      const { count: citasCount } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true });

      // Fetch suggestions count
      const { count: suggestionsCount } = await supabase
        .from('sugerencias')
        .select('*', { count: 'exact', head: true });

      // Fetch citas by month for chart
      const { data: citasData } = await supabase
        .from('citas')
        .select('fecha')
        .order('fecha', { ascending: true });

      // Process chart data
      const monthlyData = {};
      citasData?.forEach(cita => {
        const month = new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      setChartData({
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Citas',
          data: Object.values(monthlyData),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      });

      setStats([
        { name: 'Citas Totales', value: citasCount || 0, icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Sugerencias Recibidas', value: suggestionsCount || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Dinero Generado (Mes)', value: '€4,250', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Crecimiento', value: '+14%', icon: BarChart3, color: 'text-brand-accent', bg: 'bg-blue-50' },
      ]);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-brand-dark dark-heading">Panel de Administración</h1>
        <p className="text-gray-600 dark-text mt-2">Bienvenido, jefe. Aquí tienes el resumen del negocio.</p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loading ? (
          Array(4).fill().map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
              <Skeleton height={60} />
            </div>
          ))
        ) : (
          stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white flex items-center p-6 rounded-lg shadow-md border border-gray-200 dark-card">
                <div className={`p-4 rounded-full mr-4 ${stat.bg}`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark-text">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark-heading">{stat.value}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Zonas adicionales para el futuro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark-heading">Citas por Mes</h3>
          {chartData ? (
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }}
            />
          ) : (
            <Skeleton height={200} />
          )}
        </div>
        <div className="bg-gray-50 h-64 flex items-center justify-center border-dashed border-2 border-gray-300 dark-placeholder rounded-lg">
          <p className="text-gray-500 dark-text font-medium">Lista de Empleados (Espacio Reservado)</p>
        </div>
      </div>
    </div>
  );
}
