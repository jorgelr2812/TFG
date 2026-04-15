import React, { createContext, useContext, useState, useEffect } from 'react'

// Contexto para controlar el modo oscuro en la interfaz.
const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      setDarkMode(JSON.parse(saved))
    } else {
      setDarkMode(false) // Modo claro por defecto
      localStorage.setItem('darkMode', 'false')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
      console.log('Dark mode enabled')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Dark mode disabled')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}