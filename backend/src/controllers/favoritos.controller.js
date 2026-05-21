import { supabase } from '../config/supabase.js'

// POST agregar restaurante a favoritos
export const agregarFavorito = async (req, res) => {
  try {
    const { restaurante_id } = req.body
    const usuario_id = req.usuario.id

    // Validación
    if (!restaurante_id) {
      return res.status(400).json({ error: 'restaurante_id es requerido' })
    }

    // Verificar que el restaurante existe
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    // Verificar si ya está en favoritos
    const { data: existente } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', usuario_id)
      .eq('restaurante_id', restaurante_id)
      .single()

    if (existente) {
      return res.status(400).json({ error: 'Este restaurante ya está en favoritos' })
    }

    const { data, error } = await supabase
      .from('favoritos')
      .insert({
        usuario_id,
        restaurante_id
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE remover de favoritos
export const removerFavorito = async (req, res) => {
  try {
    const { restaurante_id } = req.params
    const usuario_id = req.usuario.id

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', usuario_id)
      .eq('restaurante_id', restaurante_id)

    if (error) throw error

    res.json({ mensaje: 'Restaurante removido de favoritos' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET mis favoritos
export const misFavoritos = async (req, res) => {
  try {
    const usuario_id = req.usuario.id

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        id,
        restaurante:restaurantes(
          id,
          nombre,
          descripcion,
          direccion,
          latitud,
          longitud
        )
      `)
      .eq('usuario_id', usuario_id)
      .order('creado_en', { ascending: false })

    if (error) throw error

    res.json(data || [])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET verificar si un restaurante está en favoritos
export const esFavorito = async (req, res) => {
  try {
    const { restaurante_id } = req.params
    const usuario_id = req.usuario.id

    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', usuario_id)
      .eq('restaurante_id', restaurante_id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    res.json({ es_favorito: !!data })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
