import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Conexión principal a MySQL usando un pool de conexiones.

// Crear un pool de conexiones compartido a MySQL. Esto mantiene la app
// rápida y evita abrir una nueva conexión por cada petición.
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'peluqueria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true
})

export default pool
