import express from 'express'
import { getMenuRestaurante, getPlato, crearPlato, editarPlato, eliminarPlato } from '../controllers/menu.controller.js'
import { verificarToken, soloRestaurante } from '../middlewares/auth.middleware.js'

const router = express.Router()

// GET menú de un restaurante
router.get('/:restaurante_id', getMenuRestaurante)

// GET un plato
router.get('/plato/:id', getPlato)

// POST crear plato (solo restaurantes)
router.post('/:restaurante_id', verificarToken, soloRestaurante, crearPlato)

// PUT editar plato (solo restaurantes)
router.put('/:id', verificarToken, soloRestaurante, editarPlato)

// DELETE eliminar plato (solo restaurantes)
router.delete('/:id', verificarToken, soloRestaurante, eliminarPlato)

export default router
