import express from 'express'
import { body, validationResult } from 'express-validator'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Rutas de citas: crear, listar y actualizar estado.
router.post('/',
  authenticate,
  [
    body('servicio').isIn(['Corte', 'Color', 'Tratamiento']).withMessage('Servicio inválido'),
    body('fecha').isISO8601().withMessage('Fecha inválida').custom(value => {
      const inputDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (inputDate < today) throw new Error('No se permiten fechas pasadas')
      return true
    }),
    body('hora').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Hora inválida (formato 9:00-18:00)').custom(value => {
      if (!value) return true; // Dejar que el validador anterior maneje el error si es requerido
      const hour = parseInt(value.split(':')[0])
      if (hour < 9 || hour > 18) throw new Error('Horario fuera de servicio (9:00-18:00)')
      return true
    })
  ],
  async (req, res) => {
    console.log('--- Incoming Appointment Request ---');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('User:', req.user);

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { servicio, fecha, hora } = req.body
    try {
      const [result] = await db.query(
        'INSERT INTO appointments (user_id, servicio, fecha, hora, estado) VALUES (?, ?, ?, ?, ?)',
        [req.user.userId, servicio, fecha, hora, 'pendiente']
      )

      res.status(201).json({ message: 'Cita creada correctamente', appointmentId: result.insertId })
    } catch (err) {
      console.error('Create appointment error:', err)
      res.status(500).json({ error: 'Error interno al crear la cita' })
    }
  }
)

router.get('/', authenticate, async (req, res) => {
  try {
    // Obtener citas del usuario; peluquero/jefe pueden ver todas.
    let query = 'SELECT a.id, a.user_id, a.servicio, a.fecha, a.hora, a.estado, a.precio, u.email AS user_email FROM appointments a JOIN users u ON a.user_id = u.id WHERE a.user_id = ? ORDER BY a.fecha ASC, a.hora ASC'
    let params = [req.user.userId]
    
    if (req.user.role === 'peluquero' || req.user.role === 'jefe') {
      query = 'SELECT a.id, a.user_id, a.servicio, a.fecha, a.hora, a.estado, a.precio, u.email AS user_email FROM appointments a JOIN users u ON a.user_id = u.id ORDER BY a.fecha ASC, a.hora ASC'
      params = []
    }
    
    const [appointments] = await db.query(query, params)
    res.json({ appointments })
  } catch (err) {
    console.error('Fetch appointments error:', err)
    res.status(500).json({ error: 'Error interno al obtener citas' })
  }
})

router.put('/:id/status', authenticate, [
  body('estado').isIn(['pendiente', 'confirmada', 'completada', 'cancelada']).withMessage('Estado inválido')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const appointmentId = req.params.id
  const { estado, precio } = req.body

  try {
    const [rows] = await db.query('SELECT a.* FROM appointments a WHERE a.id = ?', [appointmentId])
    const appointment = rows[0]
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' })

    // Solo peluquero/jefe o el dueño de la cita puede actualizar su estado.
    if (req.user.role !== 'peluquero' && req.user.role !== 'jefe' && appointment.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'No tiene permisos para actualizar esta cita' })
    }

    let query = 'UPDATE appointments SET estado = ? WHERE id = ?'
    let params = [estado, appointmentId]

    if (precio !== undefined) {
      query = 'UPDATE appointments SET estado = ?, precio = ? WHERE id = ?'
      params = [estado, precio, appointmentId]
    }

    await db.query(query, params)
    res.json({ message: 'Estado y datos de la cita actualizados' })
  } catch (err) {
    console.error('Update appointment error:', err)
    res.status(500).json({ error: 'Error interno al actualizar la cita' })
  }
})

export default router
