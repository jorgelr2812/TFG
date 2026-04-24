import React, { useState } from 'react'
import { CreditCard, Lock, X, ShieldCheck, Loader2 } from 'lucide-react'

export default function PaymentModal({ amount, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false)

  const handlePay = () => {
    setLoading(true)
    // Simulate API delay for payment processing
    setTimeout(() => {
      setLoading(false)
      onConfirm()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="absolute top-0 right-0 p-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-2xl">
              <CreditCard size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">Pasarela Segura</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Barbería JLR JLR Secure Pay</p>
            </div>
          </div>

          <div className="bg-brand-dark rounded-3xl p-6 text-white mb-8 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <p className="text-xs text-gray-400 uppercase tracking-widest font-black mb-1">Total a Cargar</p>
             <p className="text-4xl font-black tracking-tighter">{amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Número de Tarjeta</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="input-field pl-12 py-3 tracking-[0.2em]" maxLength="19" defaultValue="4242 4242 4242 4242" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Expiración</label>
                <input type="text" placeholder="MM/AA" className="input-field py-3 text-center" defaultValue="12/26" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">CVC</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="password" placeholder="***" className="input-field pl-12 py-3 text-center" defaultValue="123" />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePay}
            disabled={loading}
            className="btn-primary w-full mt-10 py-5 text-lg shadow-xl shadow-brand-accent/30 flex items-center justify-center gap-3"
          >
            {loading ? (
              <><Loader2 className="animate-spin" /> Procesando...</>
            ) : (
              <><ShieldCheck /> Pagar Ahora</>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
             <Lock size={12} /> Pagos encriptados con AES-256
          </div>
        </div>
      </div>
    </div>
  )
}
