import express from 'express'
import db from '../db.js'

const router = express.Router()

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT id, name, description, price, stock, category, image, point_price FROM products ORDER BY category, name')
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

// Actualizar stock de múltiples productos
router.put('/stock', async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Items requeridos' });

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of items) {
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?', [item.quantity, item.id, item.quantity]);
    }
    await connection.commit();
    res.json({ message: 'Stock actualizado correctamente' });
  } catch (err) {
    await connection.rollback();
    console.error('Update stock error:', err);
    res.status(500).json({ error: 'Error al actualizar el stock' });
  } finally {
    connection.release();
  }
})

export default router
