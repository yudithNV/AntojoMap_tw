import express from 'express'
import { getHorarios, guardarHorarios } from '../controllers/horarios.controller.js'
import { verificarToken, soloRestaurante } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/:restaurante_id', getHorarios)
router.post('/:restaurante_id', verificarToken, soloRestaurante, guardarHorarios)

export default router