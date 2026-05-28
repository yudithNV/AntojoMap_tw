import { supabase } from '../config/supabase.js'

// GET mi perfil
export const getMiPerfil = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, foto_perfil, bio, rol, creado_en')
      .eq('id', req.usuario.id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar mi perfil
export const editarPerfil = async (req, res) => {
  try {
    const { nombre, foto_perfil, bio } = req.body

    const { data, error } = await supabase
      .from('usuarios')
      .update({ nombre, foto_perfil, bio })
      .eq('id', req.usuario.id)
      .select('id, nombre, email, foto_perfil, bio, rol')
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// GET todos los usuarios (admin)
export const getAllUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, foto_perfil, bio, creado_en')
      .order('creado_en', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PATCH activar/desactivar usuario (admin)
export const toggleActivo = async (req, res) => {
  try {
    const { id } = req.params

    // Primero obtenemos el estado actual
    const { data: usuario, error: fetchError } = await supabase
      .from('usuarios')
      .select('activo')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Luego lo invertimos
    const { data, error } = await supabase
      .from('usuarios')
      .update({ activo: !usuario.activo })
      .eq('id', id)
      .select('id, nombre, activo')
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}