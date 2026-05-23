import { supabase } from '../config/supabase.js'

// POST agregar like a restaurante o plato
export const agregarLike = async (req, res) => {
  try {
    const { restaurante_id, plato_id } = req.body
    const usuario_id = req.usuario.id

    // Validación - al menos uno debe estar presente
    if (!restaurante_id && !plato_id) {
      return res.status(400).json({ error: 'restaurante_id o plato_id es requerido' })
    }

    // Validar que no ambos están presentes (es para uno u otro)
    if (restaurante_id && plato_id) {
      return res.status(400).json({ error: 'Solo especifica restaurante_id o plato_id, no ambos' })
    }

    // Si es restaurante, verificar que existe y está activo
    if (restaurante_id) {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('id')
        .eq('id', restaurante_id)
        .eq('estado', 'activo')
        .single()

      if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })
    }

    // Si es plato, verificar que existe
    if (plato_id) {
      const { data: plato } = await supabase
        .from('platos')
        .select('id')
        .eq('id', plato_id)
        .single()

      if (!plato) return res.status(404).json({ error: 'Plato no encontrado' })
    }

    // Verificar si ya existe el like
    let query = supabase.from('likes').select('id').eq('usuario_id', usuario_id)
    if (restaurante_id) query = query.eq('restaurante_id', restaurante_id)
    if (plato_id) query = query.eq('plato_id', plato_id)

    const { data: existente } = await query.single()

    if (existente) {
      return res.status(400).json({ error: 'Ya has dado like a esto' })
    }

    const insertData = { usuario_id }
    if (restaurante_id) insertData.restaurante_id = restaurante_id
    if (plato_id) insertData.plato_id = plato_id

    const { data, error } = await supabase
      .from('likes')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE remover like
export const removerLike = async (req, res) => {
  try {
    const { like_id } = req.params
    const usuario_id = req.usuario.id

    // Verificar que el like pertenece al usuario
    const { data: like } = await supabase
      .from('likes')
      .select('usuario_id')
      .eq('id', like_id)
      .single()

    if (!like) return res.status(404).json({ error: 'Like no encontrado' })

    if (like.usuario_id !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este like' })
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', like_id)

    if (error) throw error

    res.json({ mensaje: 'Like removido' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET likes de un restaurante
export const getLikesRestaurante = async (req, res) => {
  try {
    const { restaurante_id } = req.params

    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('restaurante_id', restaurante_id)
      .eq('plato_id', null)

    if (error) throw error

    res.json({ total_likes: data?.length || 0 })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET likes de un plato
export const getLikesPlato = async (req, res) => {
  try {
    const { plato_id } = req.params

    const { data: plato } = await supabase
      .from('platos')
      .select('id')
      .eq('id', plato_id)
      .single()

    if (!plato) return res.status(404).json({ error: 'Plato no encontrado' })

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('plato_id', plato_id)

    if (error) throw error

    res.json({ total_likes: data?.length || 0 })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET mis likes
export const getMisLikes = async (req, res) => {
  try {
    const usuario_id = req.usuario.id

    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('usuario_id', usuario_id)
      .order('creado_en', { ascending: false })

    if (error) throw error

    res.json(data || [])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
