import express from 'express'
import { agregarFavorito, removerFavorito, misFavoritos, esFavorito } from '../controllers/favoritos.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// POST agregar a favoritos (protegido)
router.post('/', verificarToken, agregarFavorito)

// GET mis favoritos (protegido)
router.get('/mis-favoritos', verificarToken, misFavoritos)

// GET verificar si es favorito
router.get('/:restaurante_id/es-favorito', verificarToken, esFavorito)

// DELETE remover de favoritos (protegido)
router.delete('/:restaurante_id', verificarToken, removerFavorito)

export default router
