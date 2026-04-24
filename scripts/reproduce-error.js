import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'una_clave_segura_para_local'
const API_URL = 'http://localhost:3000/api/appointments'

async function reproduce() {
  const token = jwt.sign({ userId: 3, email: 'i@gmail.com', role: 'cliente' }, JWT_SECRET)
  
  const payload = {
    servicio: 'Corte',
    fecha: '2026-04-22',
    hora: '15:00'
  }
  
  console.log('Sending request to:', API_URL)
  console.log('With payload:', payload)
  console.log('Using token:', token)

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    
    const data = await res.json()
    console.log('Response Status:', res.status)
    console.log('Response Data:', data)
  } catch (err) {
    console.error('Fetch error:', err.message)
  }
}

reproduce()
