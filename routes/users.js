import express from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Rutas de usuario: obtener el perfil actual.
router.get('/profile', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, role, puntos, created_at FROM users WHERE id = ?', [req.user.userId])
    const profile = rows[0]
    if (!profile) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ profile })
  } catch (err) {
    console.error('Fetch profile error:', err)
    res.status(500).json({ error: 'Error interno al obtener perfil' })
  }
})

// Actualizar puntos del usuario
router.put('/points', authenticate, async (req, res) => {
  try {
    const { puntos } = req.body
    await db.query('UPDATE users SET puntos = ? WHERE id = ?', [puntos, req.user.userId])
    res.json({ message: 'Puntos actualizados correctamente', puntos })
  } catch (err) {
    console.error('Update points error:', err)
    res.status(500).json({ error: 'Error interno al actualizar puntos' })
  }
})

export default router
