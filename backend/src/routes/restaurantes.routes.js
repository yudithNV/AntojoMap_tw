import express from 'express'
import { getRestaurantes, getRestaurante, editarRestaurante, getCategorias, actualizarCategoria } from '../controllers/restaurantes.controller.js'
import { verificarToken, soloRestaurante } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/categorias', getCategorias)
router.put('/:id/categoria', verificarToken, soloRestaurante, actualizarCategoria)
router.get('/', getRestaurantes)
router.get('/:id', verificarToken, getRestaurante)
router.put('/:id', verificarToken, soloRestaurante, editarRestaurante)

export default router