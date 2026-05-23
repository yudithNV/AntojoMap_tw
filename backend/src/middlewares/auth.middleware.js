//# verificación de tokens, etc
import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No hay token, acceso denegado' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()

  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso solo para administradores' })
  }
  next()
}

export const soloRestaurante = (req, res, next) => {
  if (req.usuario.rol !== 'RESTAURANTE') {
    return res.status(403).json({ error: 'Acceso solo para restaurantes' })
  }
  next()
}