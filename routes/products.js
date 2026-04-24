import express from 'express'
import db from '../db.js'

const router = express.Router()

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY category, name')
    res.json({ products })
  } catch (err) {
    console.error('Fetch products error:', err)
    res.status(500).json({ error: 'Error interno al obtener productos' })
  }
})

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json({ product: rows[0] })
  } catch (err) {
    console.error('Fetch product error:', err)
    res.status(500).json({ error: 'Error interno al obtener el producto' })
  }
})

export default router
