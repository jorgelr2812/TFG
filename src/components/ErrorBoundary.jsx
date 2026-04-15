import React from 'react'

// Captura errores en la UI y muestra una pantalla de fallback.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h2>
            <p className="text-gray-600 mb-6">Ha ocurrido un error inesperado. Por favor, recarga la página.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Recargar Página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}