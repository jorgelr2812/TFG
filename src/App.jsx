import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleProtectedRoute } from './components/RoleProtectedRoute'
import JefeDashboard from './pages/JefeDashboard'
import PeluqueroDashboard from './pages/PeluqueroDashboard'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20">
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
