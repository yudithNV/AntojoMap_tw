import { supabase } from '../config/supabase.js'

// POST crear feedback
export const crearFeedback = async (req, res) => {
  try {
    const { restaurante_id, calificacion, comentario } = req.body
    const usuario_id = req.usuario.id

    // Validación
    if (!restaurante_id || calificacion === undefined) {
      return res.status(400).json({ error: 'Restaurante_id y calificacion son requeridos' })
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' })
    }

    // Verificar que el restaurante existe
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        usuario_id,
        restaurante_id,
        calificacion: parseInt(calificacion),
        comentario: comentario || null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET feedbacks de un restaurante
export const getFeedbacksRestaurante = async (req, res) => {
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
      .from('feedbacks')
      .select(`
        id,
        calificacion,
        comentario,
        creado_en,
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

// GET promedio de calificaciones de un restaurante
export const getPromedioCalificaciones = async (req, res) => {
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
      .from('feedbacks')
      .select('calificacion')
      .eq('restaurante_id', restaurante_id)

    if (error) throw error

    if (!data || data.length === 0) {
      return res.json({ promedio: 0, total_feedbacks: 0 })
    }

    const promedio = (data.reduce((sum, f) => sum + f.calificacion, 0) / data.length).toFixed(1)

    res.json({
      promedio: parseFloat(promedio),
      total_feedbacks: data.length
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET feedbacks del usuario logueado
export const getMisFeedbacks = async (req, res) => {
  try {
    const usuario_id = req.usuario.id

    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        id,
        calificacion,
        comentario,
        creado_en,
        restaurante:restaurantes(id, nombre)
      `)
      .eq('usuario_id', usuario_id)
      .order('creado_en', { ascending: false })

    if (error) throw error

    res.json(data || [])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
