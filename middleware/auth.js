import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_local_secret'

// Middleware para validar el JWT enviado desde el frontend.

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Token de autorización faltante' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o caducado' })
  }
}
