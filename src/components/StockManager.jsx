import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, Trash2, Edit3, Save, X, Search, AlertTriangle } from 'lucide-react';
import { getProducts, saveProducts } from '../lib/shop';
import toast from 'react-hot-toast';

export default function StockManager() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleSaveAll = (updated) => {
    setProducts(updated);
    saveProducts(updated);
  };

  const adjustStock = (id, amount) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, p.stock + amount);
        return { ...p, stock: nextStock };
      }
      return p;
    });
    handleSaveAll(updated);
    toast.success('Stock actualizado');
  };

  const handleManualStock = (id, value) => {
    const num = parseInt(value);
    if (isNaN(num)) return;
    const updated = products.map(p => p.id === id ? { ...p, stock: Math.max(0, num) } : p);
    handleSaveAll(updated);
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const saveEdit = () => {
    const updated = products.map(p => p.id === editingId ? editForm : p);
    handleSaveAll(updated);
    setEditingId(null);
    toast.success('Producto actualizado');
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      const updated = products.filter(p => p.id !== id);
      handleSaveAll(updated);
      toast.success('Producto eliminado');
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card border-none shadow-xl overflow-hidden p-0">
      <div className="p-8 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <Package className="text-brand-accent" /> Control de Inventario
            </h2>
            <p className="text-gray-500 font-medium">Gestión profesional de stock y catálogo de productos.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11 py-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-[var(--border)]">
                <th className="px-4 py-4">Producto</th>
                <th className="px-4 py-4">Precio</th>
                <th className="px-4 py-4">Stock Actual</th>
                <th className="px-4 py-4">Gestión Rápida</th>
                <th className="px-4 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(product => {
                const isEditing = editingId === product.id;
                const isLow = product.stock <= 5;

                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                        <div>
                          {isEditing ? (
                            <input 
                              className="input-field py-1 text-sm font-bold mb-1" 
                              value={editForm.name} 
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                            />
                          ) : (
                            <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                          )}
                          <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      {isEditing ? (
                        <input 
                          type="number"
                          className="input-field py-1 text-sm font-bold w-24" 
                          value={editForm.price} 
                          onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                        />
                      ) : (
                        <span className="font-black text-brand-accent">{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                      )}
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-3">
                        <input 
                          type="number"
                          className={`w-16 p-2 rounded-lg border font-black text-center text-sm ${isLow ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600' : 'border-[var(--border)] bg-gray-50 dark:bg-slate-800'}`}
                          value={product.stock}
                          onChange={(e) => handleManualStock(product.id, e.target.value)}
                        />
                        {isLow && <AlertTriangle className="text-red-500 w-4 h-4 animate-pulse" title="Stock Bajo" />}
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => adjustStock(product.id, -1)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition shadow-sm"
                        >
                          <Minus size={16} />
                        </button>
                        <button 
                          onClick={() => adjustStock(product.id, 1)}
                          className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500 transition shadow-sm"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={saveEdit} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-md">
                              <Save size={18} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition">
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEditing(product)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                              <Edit3 size={18} />
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
