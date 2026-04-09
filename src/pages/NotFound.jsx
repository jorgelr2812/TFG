import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-dark dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Página no encontrada</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">La página que buscas no existe o ha sido movida.</p>
        <Link to="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}