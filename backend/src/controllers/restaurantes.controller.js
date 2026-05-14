import { supabase } from '../config/supabase.js'

// GET todos los restaurantes
export const getRestaurantes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('restaurantes')
      .select('*')

    if (error) throw error

    res.json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET un restaurante por id
export const getRestaurante = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single()

    if (!data) return res.status(404).json({ error: 'Restaurante no encontrado' })
    if (error) throw error

    res.json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar perfil del restaurante
export const editarRestaurante = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, direccion, telefono, latitud, longitud } = req.body

    // Verificar que el restaurante pertenece al usuario logueado
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este restaurante' })
    }

    const { data, error } = await supabase
      .from('restaurantes')
      .update({ nombre, descripcion, direccion, telefono, latitud, longitud })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}