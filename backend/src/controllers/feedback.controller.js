import { supabase } from '../config/supabase.js'

// POST crear review
export const crearReview = async (req, res) => {
  try {
    const { restaurante_id, comentario, puntuacion } = req.body
    const usuario_id = req.usuario.id

    // Validación
    if (!restaurante_id || puntuacion === undefined) {
      return res.status(400).json({ error: 'restaurante_id y puntuacion son requeridos' })
    }

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 5' })
    }

    // Verificar que el restaurante existe
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        usuario_id,
        restaurante_id,
        comentario: comentario || null,
        puntuacion: parseInt(puntuacion)
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET reviews de un restaurante
export const getReviewsRestaurante = async (req, res) => {
  try {
    const { restaurante_id } = req.params

    // Verificar que el restaurante existe
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        puntuacion,
        comentario,
        fecha,
        usuario:usuarios(id, nombre)
      `)
      .eq('restaurante_id', restaurante_id)
      .order('creado_en', { ascending: false })

    if (error) throw error

    res.json(data || [])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET promedio de puntuaciones de un restaurante
export const getPromedioPuntuaciones = async (req, res) => {
  try {
    const { restaurante_id } = req.params

    // Verificar que el restaurante existe
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    const { data, error } = await supabase
      .from('reviews')
      .select('puntuacion')
      .eq('restaurante_id', restaurante_id)

    if (error) throw error

    if (!data || data.length === 0) {
      return res.json({ promedio: 0, total_reviews: 0 })
    }

    const promedio = (data.reduce((sum, r) => sum + r.puntuacion, 0) / data.length).toFixed(1)

    res.json({
      promedio: parseFloat(promedio),
      total_reviews: data.length
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET mis reviews
export const getMisReviews = async (req, res) => {
  try {
    const usuario_id = req.usuario.id

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        puntuacion,
        comentario,
        fecha,
        restaurante:restaurantes(id, nombre)
      `)
      .eq('usuario_id', usuario_id)
      .order('fecha', { ascending: false })

    if (error) throw error

    res.json(data || [])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar review
export const editarReview = async (req, res) => {
  try {
    const { id } = req.params
    const { comentario, puntuacion } = req.body
    const usuario_id = req.usuario.id

    // Verificar que la review pertenece al usuario
    const { data: review } = await supabase
      .from('reviews')
      .select('usuario_id')
      .eq('id', id)
      .single()

    if (!review) return res.status(404).json({ error: 'Review no encontrada' })

    if (review.usuario_id !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta review' })
    }

    if (puntuacion && (puntuacion < 1 || puntuacion > 5)) {
      return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 5' })
    }

    const updateData = {}
    if (comentario !== undefined) updateData.comentario = comentario
    if (puntuacion !== undefined) updateData.puntuacion = parseInt(puntuacion)

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE eliminar review
export const eliminarReview = async (req, res) => {
  try {
    const { id } = req.params
    const usuario_id = req.usuario.id

    // Verificar que la review pertenece al usuario
    const { data: review } = await supabase
      .from('reviews')
      .select('usuario_id')
      .eq('id', id)
      .single()

    if (!review) return res.status(404).json({ error: 'Review no encontrada' })

    if (review.usuario_id !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta review' })
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ mensaje: 'Review eliminada exitosamente' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
