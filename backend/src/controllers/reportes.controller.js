import { supabase } from '../config/supabase.js'

// GET estadísticas generales
export const obtenerEstadisticas = async (req, res) => {
  try {
    // Total de usuarios
    const { data: usuarios } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact' })

    // Total de restaurantes
    const { data: restaurantes } = await supabase
      .from('restaurantes')
      .select('id', { count: 'exact' })

    // Total de platos
    const { data: platos } = await supabase
      .from('platos')
      .select('id', { count: 'exact' })

    // Total de feedbacks
    const { data: feedbacks } = await supabase
      .from('feedbacks')
      .select('id', { count: 'exact' })

    // Solicitudes pendientes
    const { data: solicitudesPendientes } = await supabase
      .from('solicitudes_restaurante')
      .select('id', { count: 'exact' })
      .eq('estado', 'PENDIENTE')

    res.json({
      total_usuarios: usuarios?.length || 0,
      total_restaurantes: restaurantes?.length || 0,
      total_platos: platos?.length || 0,
      total_feedbacks: feedbacks?.length || 0,
      solicitudes_pendientes: solicitudesPendientes?.length || 0
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET top restaurantes por calificación
export const topRestaurantes = async (req, res) => {
  try {
    const limit = req.query.limit || 10

    const { data: restaurantes } = await supabase
      .from('restaurantes')
      .select('id, nombre, descripcion, direccion')

    if (!restaurantes) {
      return res.json([])
    }

    // Obtener calificaciones para cada restaurante
    const { data: feedbacks } = await supabase
      .from('feedbacks')
      .select('restaurante_id, calificacion')

    const feedbacksMap = {}
    feedbacks?.forEach(f => {
      if (!feedbacksMap[f.restaurante_id]) {
        feedbacksMap[f.restaurante_id] = []
      }
      feedbacksMap[f.restaurante_id].push(f.calificacion)
    })

    const restaurantesConCalificacion = restaurantes.map(r => {
      const calificaciones = feedbacksMap[r.id] || []
      const promedio = calificaciones.length > 0
        ? (calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length).toFixed(1)
        : 0
      return {
        ...r,
        promedio_calificacion: parseFloat(promedio),
        total_feedbacks: calificaciones.length
      }
    })

    const topRestaurantes = restaurantesConCalificacion
      .sort((a, b) => b.promedio_calificacion - a.promedio_calificacion)
      .slice(0, parseInt(limit))

    res.json(topRestaurantes)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET actividad de usuarios
export const actividadUsuarios = async (req, res) => {
  try {
    const limite = req.query.limite || 30

    const { data: feedbacks } = await supabase
      .from('feedbacks')
      .select(`
        id,
        creado_en,
        calificacion,
        usuario:usuarios(id, nombre),
        restaurante:restaurantes(id, nombre)
      `)
      .order('creado_en', { ascending: false })
      .limit(parseInt(limite))

    res.json(feedbacks || [])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET distribución de restaurantes por categoría
export const distribucionPorCategoria = async (req, res) => {
  try {
    const { data: restaurantes } = await supabase
      .from('restaurantes')
      .select('id, categoria')

    const distribucion = {}

    restaurantes?.forEach(r => {
      const cat = r.categoria || 'Sin categoría'
      distribucion[cat] = (distribucion[cat] || 0) + 1
    })

    const resultado = Object.entries(distribucion).map(([categoria, cantidad]) => ({
      categoria,
      cantidad
    }))

    res.json(resultado)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET solicitudes por estado
export const solicitudesPorEstado = async (req, res) => {
  try {
    const { data: solicitudes } = await supabase
      .from('solicitudes_restaurante')
      .select('estado')

    const distribucion = {
      PENDIENTE: 0,
      APROBADO: 0,
      RECHAZADO: 0
    }

    solicitudes?.forEach(s => {
      if (s.estado in distribucion) {
        distribucion[s.estado]++
      }
    })

    res.json(distribucion)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
