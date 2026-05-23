import { supabase } from '../config/supabase.js'

export const getHorarios = async (req, res) => {
  try {
    const { restaurante_id } = req.params
    const { data, error } = await supabase
      .from('horarios')
      .select('*')
      .eq('restaurante_id', restaurante_id)
      .order('dia_semana', { ascending: true })
    if (error) throw error
    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const guardarHorarios = async (req, res) => {
  try {
    const { restaurante_id } = req.params
    const { horarios } = req.body // array de { dia_semana, apertura, cierre }

    if (req.usuario.id !== await getPropietarioId(restaurante_id)) {
      return res.status(403).json({ error: 'Sin permiso' })
    }

    // Borrar horarios actuales y reinsertar
    await supabase.from('horarios').delete().eq('restaurante_id', restaurante_id)

    if (horarios && horarios.length > 0) {
      const { error } = await supabase.from('horarios').insert(
        horarios.map(h => ({ restaurante_id, dia_semana: h.dia_semana, apertura: h.apertura, cierre: h.cierre }))
      )
      if (error) throw error
    }

    res.json({ mensaje: 'Horarios guardados' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getPropietarioId = async (restaurante_id) => {
  const { data } = await supabase.from('restaurantes').select('propietario_id').eq('id', restaurante_id).single()
  return data?.propietario_id
}