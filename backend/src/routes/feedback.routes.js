import express from 'express'
import { crearReview, getReviewsRestaurante, getPromedioPuntuaciones, getMisReviews, editarReview, eliminarReview } from '../controllers/feedback.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// POST crear review (protegido)
router.post('/', verificarToken, crearReview)

// GET reviews de un restaurante
router.get('/restaurante/:restaurante_id', getReviewsRestaurante)

// GET promedio de puntuaciones
router.get('/restaurante/:restaurante_id/promedio', getPromedioPuntuaciones)

// GET mis reviews (protegido)
router.get('/usuario/mis-reviews', verificarToken, getMisReviews)

// PUT editar review (protegido)
router.put('/:id', verificarToken, editarReview)

// DELETE eliminar review (protegido)
router.delete('/:id', verificarToken, eliminarReview)

export default router
