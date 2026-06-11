// # definición de rutas

import express from 'express'
import { registro, login, solicitarRestaurante, crearAdmin, verificarEstadoSolicitud } from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { forgotPassword, resetPassword } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/registro', registro)
router.post('/login', login)
router.post('/solicitud-restaurante', solicitarRestaurante)
router.post('/crear-admin', crearAdmin)
router.get('/estado-solicitud/:usuario_id', verificarEstadoSolicitud)
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: 'Ruta protegida', usuario: req.usuario })
})
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router