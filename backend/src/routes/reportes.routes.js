import express from 'express'
import { obtenerEstadisticas, topRestaurantes, actividadUsuarios, distribucionPorCategoria, solicitudesPorEstado, dashboardAdmin, dashboardRestaurante } from '../controllers/reportes.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

// GET estadísticas generales (solo admin)
router.get('/estadisticas', verificarToken, soloAdmin, obtenerEstadisticas)

// GET top restaurantes
router.get('/top-restaurantes', topRestaurantes)

// GET actividad de usuarios (solo admin)
router.get('/actividad-usuarios', verificarToken, soloAdmin, actividadUsuarios)

// GET distribución por categoría (solo admin)
router.get('/distribucion-categorias', verificarToken, soloAdmin, distribucionPorCategoria)

// GET solicitudes por estado (solo admin)
router.get('/solicitudes-estado', verificarToken, soloAdmin, solicitudesPorEstado)

// GET Dashboard Admin - Todas las métricas en una consulta (solo admin)
router.get('/dashboard-admin', verificarToken, soloAdmin, dashboardAdmin)

// GET Dashboard Restaurante - Métricas específicas del restaurante
router.get('/dashboard-restaurante/:id', dashboardRestaurante)

export default router
