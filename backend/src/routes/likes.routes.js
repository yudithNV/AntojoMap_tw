import express from 'express'
import { agregarLike, removerLike, getLikesRestaurante, getLikesPlato, getMisLikes } from '../controllers/likes.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// POST agregar like (requiere token)
router.post('/', verificarToken, agregarLike)

// DELETE remover like (requiere token)
router.delete('/:like_id', verificarToken, removerLike)

// GET likes de un restaurante
router.get('/restaurante/:restaurante_id', getLikesRestaurante)

// GET likes de un plato
router.get('/plato/:plato_id', getLikesPlato)

// GET mis likes (requiere token)
router.get('/usuario/mis-likes', verificarToken, getMisLikes)

export default router
