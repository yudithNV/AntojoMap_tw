import express from 'express'

import { getRestaurantes, getRestaurante, editarRestaurante, getCategorias } from '../controllers/restaurantes.controller.js'

import { verificarToken, soloRestaurante } from '../middlewares/auth.middleware.js'


const router = express.Router()

router.get('/', getRestaurantes)
router.get('/categorias', getCategorias)
router.get('/:id', getRestaurante)
router.put('/:id', verificarToken, soloRestaurante, editarRestaurante)
router.get('/categorias', getCategorias)

export default router