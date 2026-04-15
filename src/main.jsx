import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

// Punto de entrada de React. Se añade AuthProvider para mantener sesión.
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
