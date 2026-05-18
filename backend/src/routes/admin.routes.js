import express from 'express'
import { aprobarSolicitud, rechazarSolicitud, getSolicitudes, getUsuarios } from '../controllers/admin.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(verificarToken, soloAdmin)

router.get('/usuarios', getUsuarios)
router.get('/solicitudes', getSolicitudes)
router.put('/solicitudes/:id/aprobar', aprobarSolicitud)
router.put('/solicitudes/:id/rechazar', rechazarSolicitud)

export default router