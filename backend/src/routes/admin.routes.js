import express from 'express'
import { aprobarSolicitud, rechazarSolicitud, getSolicitudes, getUsuarios, toggleActivo, getRestaurantesAdmin, getRestauranteAdmin } from '../controllers/admin.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(verificarToken, soloAdmin)

router.get('/usuarios', getUsuarios)
router.patch('/usuarios/:id/activo', toggleActivo)
router.get('/restaurantes', getRestaurantesAdmin)
router.get('/restaurantes/:id', getRestauranteAdmin)
router.get('/solicitudes', getSolicitudes)
router.put('/solicitudes/:id/aprobar', aprobarSolicitud)
router.put('/solicitudes/:id/rechazar', rechazarSolicitud)

export default router