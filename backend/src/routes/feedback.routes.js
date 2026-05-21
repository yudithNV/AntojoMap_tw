import express from 'express'
import { crearFeedback, getFeedbacksRestaurante, getPromedioCalificaciones, getMisFeedbacks } from '../controllers/feedback.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// POST crear feedback (protegido)
router.post('/', verificarToken, crearFeedback)

// GET feedbacks de un restaurante
router.get('/restaurante/:restaurante_id', getFeedbacksRestaurante)

// GET promedio de calificaciones
router.get('/restaurante/:restaurante_id/promedio', getPromedioCalificaciones)

// GET mis feedbacks (protegido)
router.get('/usuario/mis-feedbacks', verificarToken, getMisFeedbacks)

export default router
