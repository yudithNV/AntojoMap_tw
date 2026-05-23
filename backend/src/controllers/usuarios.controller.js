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