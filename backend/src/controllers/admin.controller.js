import { supabase } from '../config/supabase.js'

export const aprobarSolicitud = async (req, res) => {
  try {
    const { id } = req.params

    // 1. Buscar la solicitud
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitudes_restaurante')
      .select('*')
      .eq('id', id)
      .single()

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    // 2. Crear el restaurante
    const { error: errorRestaurante } = await supabase
      .from('restaurantes')
      .insert({
        propietario_id: solicitud.usuario_id,
        nombre: solicitud.nombre_restaurante,
        direccion: solicitud.direccion
      })

    if (errorRestaurante) throw errorRestaurante

    // 3. Actualizar estado de la solicitud
    const { error: errorUpdate } = await supabase
      .from('solicitudes_restaurante')
      .update({ estado: 'APROBADO' })
      .eq('id', id)

    if (errorUpdate) throw errorUpdate

    res.json({ mensaje: 'Restaurante aprobado exitosamente' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('solicitudes_restaurante')
      .update({ estado: 'RECHAZADO' })
      .eq('id', id)

    if (error) throw error

    res.json({ mensaje: 'Solicitud rechazada' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getSolicitudes = async (req, res) => {
  try {
    // Primero obtenemos todas las solicitudes
    const { data: solicitudes, error: solicitudesError } = await supabase
      .from('solicitudes_restaurante')
      .select('*')
      .order('creado_en', { ascending: false })

    if (solicitudesError) throw solicitudesError

    // Luego obtenemos los IDs únicos de usuarios
    const usuarioIds = [...new Set(solicitudes.map(s => s.usuario_id))]

    // Obtenemos los usuarios
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, email, nombre')
      .in('id', usuarioIds)

    if (usuariosError) throw usuariosError

    // Creamos un mapa de usuarios por ID
    const usuariosMap = {}
    usuarios.forEach(u => {
      usuariosMap[u.id] = u
    })

    // Combinamos los datos
    const solicitudesConUsuario = solicitudes.map(solicitud => ({
      ...solicitud,
      usuario: usuariosMap[solicitud.usuario_id] || null
    }))

    res.json(solicitudesConUsuario)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}