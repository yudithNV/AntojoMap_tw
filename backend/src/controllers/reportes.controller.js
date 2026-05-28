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

// GET Dashboard Admin - Todas las métricas en una sola consulta
export const dashboardAdmin = async (req, res) => {
  try {
    // 1. Usuarios totales
    const { count: usuariosTotales } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact' })

    // 2. Usuarios activos
    const { count: usuariosActivos } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact' })
      .eq('activo', true)

    // 3. Restaurantes registrados
    const { count: restaurantesRegistrados } = await supabase
      .from('restaurantes')
      .select('id', { count: 'exact' })

    // 4. Solicitudes pendientes
    const { count: solicitudesPendientes } = await supabase
      .from('solicitudes_restaurante')
      .select('id', { count: 'exact' })
      .eq('estado', 'PENDIENTE')

    // 5. Reviews totales
    const { count: reviewsTotales } = await supabase
      .from('reviews')
      .select('id', { count: 'exact' })

    // 6. Top 5 restaurantes por calificación
    const { data: restaurantesData } = await supabase
      .from('restaurantes')
      .select('id, nombre')

    let top5Restaurantes = []
    if (restaurantesData && restaurantesData.length > 0) {
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('restaurante_id, puntuacion')

      const reviewsMap = {}
      reviewsData?.forEach(r => {
        if (!reviewsMap[r.restaurante_id]) {
          reviewsMap[r.restaurante_id] = []
        }
        reviewsMap[r.restaurante_id].push(r.puntuacion)
      })

      top5Restaurantes = restaurantesData
        .map(r => ({
          id: r.id,
          nombre: r.nombre,
          promedio: reviewsMap[r.id]
            ? (reviewsMap[r.id].reduce((a, b) => a + b, 0) / reviewsMap[r.id].length).toFixed(2)
            : '0.00'
        }))
        .sort((a, b) => parseFloat(b.promedio) - parseFloat(a.promedio))
        .slice(0, 5)
    }

    // 7. Últimas 5 solicitudes
    const { data: solicitudesRecientes } = await supabase
      .from('solicitudes_restaurante')
      .select('id, nombre_restaurante, estado, creado_en')
      .order('creado_en', { ascending: false })
      .limit(5)

    // 8. Distribución por categoría
    const { data: catData } = await supabase
      .from('restaurante_categorias')
      .select('categorias_restaurante(nombre)')

    const distribucionCategorias = {}
    catData?.forEach(r => {
      const cat = r.categorias_restaurante?.nombre || 'Sin categoría'
      distribucionCategorias[cat] = (distribucionCategorias[cat] || 0) + 1
    })

    const distribucion = Object.entries(distribucionCategorias).map(([nombre_categoria, total]) => ({
      nombre_categoria,
      total
    }))

    res.json({
      usuarios_totales: usuariosTotales || 0,
      usuarios_activos: usuariosActivos || 0,
      restaurantes_registrados: restaurantesRegistrados || 0,
      solicitudes_pendientes: solicitudesPendientes || 0,
      reviews_totales: reviewsTotales || 0,
      top_5_restaurantes: top5Restaurantes,
      solicitudes_recientes: solicitudesRecientes || [],
      distribucion_categorias: distribucion
    })

  } catch (error) {
    console.error('Error en dashboardAdmin:', error)
    res.status(200).json({
      usuarios_totales: 0,
      usuarios_activos: 0,
      restaurantes_registrados: 0,
      solicitudes_pendientes: 0,
      reviews_totales: 0,
      top_5_restaurantes: [],
      solicitudes_recientes: [],
      distribucion_categorias: [],
      error: 'No se pudieron cargar todas las métricas'
    })
  }
}

// GET Dashboard Restaurante - Métricas específicas del restaurante
export const dashboardRestaurante = async (req, res) => {
  try {
    const { id } = req.params

    // 1. Calificación promedio
    const { data: reviews } = await supabase
      .from('reviews')
      .select('puntuacion')
      .eq('restaurante_id', id)

    const puntuaciones = reviews?.map(r => r.puntuacion) || []
    const calificacionPromedio = puntuaciones.length > 0
      ? (puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length).toFixed(2)
      : '0.00'

    // 2. Total reseñas
    const totalReseñas = puntuaciones.length

    // 3. Total platos
    const { count: totalPlatos } = await supabase
      .from('menu')  // ← CORRECTO
      .select('id', { count: 'exact' })
      .eq('restaurante_id', id)

    // 4. Total favoritos (si existe tabla)
    let totalFavoritos = 0
    try {
      const { count: favoritos } = await supabase
        .from('favoritos')
        .select('id', { count: 'exact' })
        .eq('restaurante_id', id)
      totalFavoritos = favoritos || 0
    } catch (e) {
      // Tabla no existe, omitir
    }

    // 5. Perfil completo
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('foto_portada, direccion, descripcion')
      .eq('id', id)
      .single()

    const { data: catData } = await supabase
      .from('restaurante_categorias')
      .select('categoria_id')
      .eq('restaurante_id', id)
      .limit(1)

    let horarios = null
    try {
      const { data: horariosData } = await supabase
        .from('horarios')
        .select('id')
        .eq('restaurante_id', id)
        .limit(1)
      horarios = horariosData && horariosData.length > 0 ? true : false
    } catch (e) {
      // Tabla no existe
    }

    const perfilCompleto = {
      tiene_foto: !!(restaurante?.foto_portada),
      tiene_direccion: !!(restaurante?.direccion),
      tiene_horarios: horarios || false,
      tiene_categoria: !!(catData && catData.length > 0),
      tiene_descripcion: !!(restaurante?.descripcion)
    }

    res.json({
      calificacion_promedio: parseFloat(calificacionPromedio),
      total_reseñas: totalReseñas,
      total_platos: totalPlatos || 0,
      total_favoritos: totalFavoritos,
      perfil_completo: perfilCompleto
    })

  } catch (error) {
    console.error('Error en dashboardRestaurante:', error)
    res.status(200).json({
      calificacion_promedio: 0,
      total_reseñas: 0,
      total_platos: 0,
      total_favoritos: 0,
      perfil_completo: {
        tiene_foto: false,
        tiene_direccion: false,
        tiene_horarios: false,
        tiene_categoria: false,
        tiene_descripcion: false
      },
      error: 'No se pudieron cargar las métricas del restaurante'
    })
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