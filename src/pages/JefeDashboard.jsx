import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Users, DollarSign, CalendarCheck, ShoppingCart } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getProducts, getOrders, computeShopStats } from '../lib/shop';
import { getAppointments, getSuggestions } from '../lib/api';

// Panel de jefe con estadísticas de citas y tienda.

// Panel de jefe con estadísticas de citas y tienda.

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function JefeDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [shopStats, setShopStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const appointmentsResponse = await getAppointments(token)
        const suggestionsResponse = await getSuggestions(token)
        const citasData = appointmentsResponse.appointments || []
        const suggestionsCount = suggestionsResponse.suggestions?.length || 0

        const monthlyData = {}
        citasData.forEach(cita => {
          const month = new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
          monthlyData[month] = (monthlyData[month] || 0) + 1
        })

        const products = getProducts()
        const orders = getOrders()
        const shopStats = computeShopStats(orders, products)

        setChartData({
          labels: Object.keys(monthlyData),
          datasets: [{
            label: 'Citas',
            data: Object.values(monthlyData),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        })

        setSalesData({
          labels: Object.keys(shopStats.monthlyRevenue),
          datasets: [{
            label: 'Ingresos tienda',
            data: Object.values(shopStats.monthlyRevenue),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          }]
        })

        setShopStats(shopStats)
        setStats([
          { name: 'Citas Totales', value: citasData.length, icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
          { name: 'Sugerencias Recibidas', value: suggestionsCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { name: 'Pedidos de Tienda', value: shopStats.totalOrders, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { name: 'Ingresos Tienda', value: shopStats.totalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        ])
      } catch (err) {
        console.error('Fetch dashboard stats error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

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

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark-heading">Citas por Mes</h3>
              <p className="text-sm text-gray-500 dark-text">Evolución mensual de las reservas en tu salón.</p>
            </div>
            <span className="text-sm font-semibold text-brand-accent">Datos actualizados</span>
          </div>
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

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark-heading">Ventas de la tienda</h3>
                <p className="text-sm text-gray-500 dark-text">Resumen de ingresos y productos más vendidos.</p>
              </div>
              <ShoppingCart className="w-6 h-6 text-brand-accent" />
            </div>
            {salesData ? (
              <Bar 
                data={salesData} 
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

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark-heading">Productos con bajo stock</h3>
            {shopStats?.lowStock?.length ? (
              <div className="space-y-3">
                {shopStats.lowStock.map((product) => (
                  <div key={product.id} className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Quedan solo {product.stock} unidades</p>
                      </div>
                      <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">Reponer</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark-text">No hay productos urgentes para reponer.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark-heading">Más vendidos</h3>
            {shopStats?.bestSellers?.length ? (
              <div className="space-y-3">
                {shopStats.bestSellers.map((product, idx) => (
                  <div key={product.name} className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{idx + 1}. {product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Vendidos: {product.quantity} unidades</p>
                      </div>
                      <span className="text-sm font-semibold text-brand-accent">{product.revenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark-text">No hay datos de ventas todavía.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
