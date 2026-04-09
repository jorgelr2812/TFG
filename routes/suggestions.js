import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// POST /api/suggestions - Submit a suggestion
router.post('/', [
  body('mensaje').isLength({ min: 5 }).withMessage('La sugerencia debe tener al menos 5 caracteres')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Here you would save to database
  res.json({ message: 'Sugerencia enviada correctamente' });
});

export default router;