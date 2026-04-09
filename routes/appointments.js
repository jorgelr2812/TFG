import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// POST /api/appointments - Create a new appointment
router.post('/', [
  body('servicio').isIn(['Corte', 'Color', 'Tratamiento']).withMessage('Servicio inválido'),
  body('fecha').isISO8601().withMessage('Fecha inválida').custom(value => {
    if (new Date(value) < new Date()) throw new Error('No se permiten fechas pasadas');
    return true;
  }),
  body('hora').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora inválida').custom(value => {
    const hour = parseInt(value.split(':')[0]);
    if (hour < 9 || hour > 18) throw new Error('Horario fuera de servicio (9:00-18:00)');
    return true;
  })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Here you would save to database via Supabase
  // For now, just respond with success
  res.json({ message: 'Cita creada correctamente', data: req.body });
});

// GET /api/appointments - Get appointments (would require auth)
router.get('/', (req, res) => {
  // Placeholder for fetching appointments
  res.json({ appointments: [] });
});

export default router;