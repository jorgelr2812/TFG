import express from 'express'
import { body, validationResult } from 'express-validator'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Rutas de sugerencias: enviar y listar sugerencias.
router.post('/',
  authenticate,
  [
    body('mensaje').isLength({ min: 5 }).withMessage('La sugerencia debe tener al menos 5 caracteres')
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { mensaje } = req.body
    try {
      await db.query('INSERT INTO suggestions (user_id, mensaje) VALUES (?, ?)', [req.user.userId, mensaje])
      res.status(201).json({ message: 'Sugerencia enviada correctamente' })
    } catch (err) {
      console.error('Create suggestion error:', err)
      res.status(500).json({ error: 'Error interno al enviar la sugerencia' })
    }
  }
)

router.get('/', authenticate, async (req, res) => {
  try {
    let query = 'SELECT s.id, s.mensaje, s.created_at FROM suggestions s WHERE s.user_id = ? ORDER BY s.created_at DESC'
    let params = [req.user.userId]

    if (req.user.role === 'jefe') {
      query = 'SELECT s.id, s.mensaje, s.created_at, u.email AS user_email FROM suggestions s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC'
      params = []
    }

    const [suggestions] = await db.query(query, params)
    res.json({ suggestions })
  } catch (err) {
    res.status(500).json({ error: 'Error interno al obtener sugerencias' })
  }
})

export default router
