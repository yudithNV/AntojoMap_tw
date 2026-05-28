import express from 'express'
import { getMenusRestaurante, getMenu, crearMenu, editarMenu, eliminarMenu, buscarPorPlato } from '../controllers/almuerzos.controller.js'
import { verificarToken, soloRestaurante } from '../middlewares/auth.middleware.js'

const router = express.Router()

// GET almuerzos por búsqueda (nombre de plato)
router.get('/buscar', buscarPorPlato) 

// GET todos los almuerzos de un restaurante
router.get('/:restaurante_id', getMenusRestaurante)

// GET un almuerzo
router.get('/detalle/:id', getMenu)

// POST crear almuerzo completo (solo restaurantes)
router.post('/:restaurante_id', verificarToken, soloRestaurante, crearMenu)

// PUT editar almuerzo (solo restaurantes)
router.put('/:id', verificarToken, soloRestaurante, editarMenu)

// DELETE eliminar almuerzo (solo restaurantes)
router.delete('/:id', verificarToken, soloRestaurante, eliminarMenu)

export default router
