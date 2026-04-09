import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleProtectedRoute } from './components/RoleProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'
import Skeleton from 'react-loading-skeleton'
import { Toaster } from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Gallery = React.lazy(() => import('./pages/Gallery'))
const Contact = React.lazy(() => import('./pages/Contact'))
const JefeDashboard = React.lazy(() => import('./pages/JefeDashboard'))
const PeluqueroDashboard = React.lazy(() => import('./pages/PeluqueroDashboard'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-full max-w-md">
      <Skeleton height={40} className="mb-4" />
      <Skeleton height={20} count={3} />
    </div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Rutas de Roles */}
                  <Route 
                    path="/jefe" 
                  element={
                    <RoleProtectedRoute allowedRoles={['jefe']}>
                      <JefeDashboard />
                    </RoleProtectedRoute>
                  } 
                />
                <Route 
                  path="/peluquero" 
                  element={
                    <RoleProtectedRoute allowedRoles={['peluquero', 'jefe']}>
                      <PeluqueroDashboard />
                    </RoleProtectedRoute>
                  } 
                />
                {/* Ruta por defecto para capturar errores 404/NotFound */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="top-right" />
    </ErrorBoundary>
  </ThemeProvider>
  )
}

export default App
