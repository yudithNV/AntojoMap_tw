import { supabase } from '../config/supabase.js'

// GET estadísticas generales
export const obtenerEstadisticas = async (req, res) => {
  try {
    // Total de usuarios activos
    const { data: usuarios } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact' })
      .eq('activo', true)

    // Total de restaurantes activos
    const { data: restaurantes } = await supabase
      .from('restaurantes')
      .select('id', { count: 'exact' })
      .eq('estado', 'activo')

    // Total de platos
    const { data: platos } = await supabase
      .from('platos')
      .select('id', { count: 'exact' })

    // Total de reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('id', { count: 'exact' })

    // Total de likes
    const { data: likes } = await supabase
      .from('likes')
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
      total_reviews: reviews?.length || 0,
      total_likes: likes?.length || 0,
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
      .eq('estado', 'activo')

    if (!restaurantes) {
      return res.json([])
    }

    // Obtener puntuaciones para cada restaurante
    const { data: reviews } = await supabase
      .from('reviews')
      .select('restaurante_id, puntuacion')

    const reviewsMap = {}
    reviews?.forEach(r => {
      if (!reviewsMap[r.restaurante_id]) {
        reviewsMap[r.restaurante_id] = []
      }
      reviewsMap[r.restaurante_id].push(r.puntuacion)
    })

    const restaurantesConCalificacion = restaurantes.map(r => {
      const puntuaciones = reviewsMap[r.id] || []
      const promedio = puntuaciones.length > 0
        ? (puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length).toFixed(1)
        : 0
      return {
        ...r,
        promedio_puntuacion: parseFloat(promedio),
        total_reviews: puntuaciones.length
      }
    })

    const topRestaurantes = restaurantesConCalificacion
      .sort((a, b) => b.promedio_puntuacion - a.promedio_puntuacion)
      .slice(0, parseInt(limit))

    res.json(topRestaurantes)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET actividad de usuarios (CORREGIDO)
export const actividadUsuarios = async (req, res) => {
  try {
    const limite = req.query.limite || 30

    // ✅ CORREGIDO: 'creado_en' → 'fecha'
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        id,
        fecha,
        puntuacion,
        usuario:usuarios(id, nombre),
        restaurante:restaurantes(id, nombre)
      `)
      .order('fecha', { ascending: false })
      .limit(parseInt(limite))

    res.json(reviews || [])

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
      .eq('estado', 'activo')

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