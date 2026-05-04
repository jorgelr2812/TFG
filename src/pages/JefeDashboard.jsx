import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Users, DollarSign, CalendarCheck, ShoppingCart, TrendingUp, Sparkles, AlertCircle, Scissors } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getProducts, getOrders, computeShopStats } from '../lib/shop';
import { getAppointments, getSuggestions } from '../lib/api';
import AgendaManager from '../components/AgendaManager';
import StockManager from '../components/StockManager';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function JefeDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [shopStats, setShopStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointmentsResponse, suggestionsResponse] = await Promise.all([
          getAppointments(token),
          getSuggestions(token)
        ]);
        const citasData = appointmentsResponse.appointments || [];
        const suggestionsList = suggestionsResponse.suggestions || [];
        setSuggestions(suggestionsList);

        const monthlyData = {};
        const serviceDistribution = {};
        let citaRevenue = 0;
        let confirmedCount = 0;

        citasData.forEach(cita => {
          if (cita.estado === 'completada' || cita.estado === 'confirmada') confirmedCount++;
          if (cita.estado === 'completada') {
            citaRevenue += parseFloat(cita.precio || 0);
          }
          
          // Reparto por servicio
          serviceDistribution[cita.servicio] = (serviceDistribution[cita.servicio] || 0) + 1;
          
          const month = new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        const products = getProducts();
        const orders = getOrders();
        const shopStats = computeShopStats(orders, products);
        const totalRevenue = shopStats.totalRevenue + citaRevenue;

        setChartData({
          labels: Object.keys(monthlyData),
          datasets: [{
            label: 'Citas Reservadas',
            data: Object.values(monthlyData),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 8,
          }]
        });

        setSalesData({
          labels: Object.keys(shopStats.monthlyRevenue),
          datasets: [{
            label: 'Ventas (€)',
            data: Object.values(shopStats.monthlyRevenue),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderRadius: 8,
          }]
        });

        setServiceData({
          labels: Object.keys(serviceDistribution),
          datasets: [{
            data: Object.values(serviceDistribution),
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
            ],
            borderWidth: 0
          }]
        });

        setShopStats(shopStats);
        setStats([
          { name: 'Citas Hoy', value: confirmedCount, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { name: 'Sugerencias', value: suggestionsList.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
          { name: 'Ticket Medio', value: (citaRevenue / (citasData.filter(c => c.estado === 'completada').length || 1)).toFixed(2) + '€', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { name: 'Caja Total', value: totalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), icon: TrendingUp, color: 'text-brand-accent', bg: 'bg-blue-50 dark:bg-blue-900/10' },
        ]);
      } catch (err) {
        console.error('Fetch dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--canvas)] pb-20">
      {/* Header Premium */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] pt-32 pb-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-accent font-black text-sm uppercase tracking-widest mb-3">
              <BarChart3 size={16} /> ADMINISTRACIÓN JLR
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Panel de Gestión</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-lg">Control total de ventas, personal y agenda de la barbería.</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-bold shadow-lg">
               {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
             </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-8">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            Array(4).fill().map((_, i) => <div key={i} className="card h-32 animate-pulse" />)
          ) : (
            stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="card group hover:scale-[1.02] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{stat.name}</p>
                  <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Agenda Manager */}
        <section className="mb-12">
           <AgendaManager />
        </section>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Citas Gráfico */}
          <div className="card lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CalendarCheck className="text-brand-accent" /> Histórico de Citas
            </h3>
            {chartData ? <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} /> : <Skeleton height={300} />}
          </div>

          {/* Tienda Gráfico */}
          <div className="card lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <ShoppingCart className="text-emerald-500" /> Rendimiento Tienda
            </h3>
            {salesData ? <Bar data={salesData} options={{ responsive: true, plugins: { legend: { display: false } } }} /> : <Skeleton height={300} />}
          </div>

          {/* Servicios Populares (NUEVO) */}
          <div className="card lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Scissors className="text-purple-500" /> Popularidad Servicios
            </h3>
            <div className="flex justify-center items-center h-[250px]">
              {serviceData ? <Pie data={serviceData} options={{ responsive: true, maintainAspectRatio: false }} /> : <Skeleton circle height={200} width={200} />}
            </div>
          </div>
        </div>

        {/* Gestión de Inventario Profesional */}
        <div className="mb-12">
           <StockManager />
        </div>

        {/* Buzón de Sugerencias */}
        <div className="card">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
             <Users className="text-brand-accent" /> Feedback de Clientes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {suggestions.map(s => (
              <div key={s.id} className="p-6 rounded-3xl bg-[var(--canvas)] border border-[var(--border)]">
                <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">{s.user_email}</p>
                <p className="text-lg italic">"{s.mensaje}"</p>
                <p className="text-[10px] mt-4 text-gray-400">{new Date(s.created_at).toLocaleDateString()}</p>
              </div>
            ))}
            {suggestions.length === 0 && <p className="text-gray-400 text-center py-10 w-full col-span-full">No hay sugerencias por ahora.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
