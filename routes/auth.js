import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import db from '../db.js'

// Rutas de autenticación: registro, login y verificación de token.

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_local_secret'
const JWT_EXPIRES_IN = '7d'

// Endpoints de auth para registro, login y verificación de token.

router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body
  try {
    // Comprobar si el correo ya está registrado.
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existingUsers.length) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese correo.' })
    }

    // Guardar la contraseña de forma segura como hash.
    const password_hash = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, password_hash, 'cliente']
    )

    const user = {
      id: result.insertId,
      email,
      role: 'cliente'
    }

    // Devolver el usuario nuevo y un token JWT para el frontend.
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.status(201).json({ user, token })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Error interno al registrar usuario' })
  }
})

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body
  try {
    // Cargar el usuario y comparar la contraseña proporcionada con el hash almacenado.
    const [rows] = await db.query('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email])
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Error interno al iniciar sesión' })
  }
})

router.get('/status', async (req, res) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.json({ authenticated: false, user: null })
  }

  try {
    // Verificar el token y devolver la información decodificada al frontend.
    const payload = jwt.verify(token, JWT_SECRET)
    res.json({ authenticated: true, user: payload })
  } catch (err) {
    res.json({ authenticated: false, user: null })
  }
})

export default router
