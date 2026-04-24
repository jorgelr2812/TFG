import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ArrowUpRight } from 'lucide-react';
import { getProducts, saveProducts, updateStock } from '../lib/shop';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';
import AgendaManager from '../components/AgendaManager';

// Panel para peluqueros con agenda de citas y control de stock.
export default function PeluqueroDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stockLoading, setStockLoading] = useState(true);

  useEffect(() => {
    const storedProducts = getProducts();
    setProducts(storedProducts);
    setStockLoading(false);
    setLoading(false);
  }, [token]);

  const restockProduct = (productId, amount = 5) => {
    const updatedProducts = updateStock(productId, amount);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    const product = updatedProducts.find(item => item.id === productId);
    toast.success(`Reposición: ${product.name} +${amount} unidades`);
  };

  const lowStockProducts = products.filter(product => product.stock <= 5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-brand-dark dark:text-white">Panel del Peluquero</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">Gestiona tus citas y el material del salón.</p>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-12">
        <section>
          <AgendaManager />
        </section>

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
