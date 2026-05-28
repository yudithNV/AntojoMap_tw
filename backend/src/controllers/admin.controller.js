import { supabase } from '../config/supabase.js'

export const aprobarSolicitud = async (req, res) => {
  try {
    const { id } = req.params
    const admin_id = req.usuario.id

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
    const { data: nuevoRestaurante, error: errorRestaurante } = await supabase
      .from('restaurantes')
      .insert({
        propietario_id: solicitud.usuario_id,
        nombre: solicitud.nombre_restaurante,
        direccion: solicitud.direccion,
        telefono: solicitud.telefono,
        estado: 'activo'
      })
      .select()
      .single()

    if (errorRestaurante) throw errorRestaurante

    // 2.5 Asignar categoría si la solicitud tiene categoria_id
    if (solicitud.categoria_id) {
      const { error: errorCat } = await supabase
        .from('restaurante_categorias')
        .insert({
          restaurante_id: nuevoRestaurante.id,
          categoria_id: solicitud.categoria_id
        })
      if (errorCat) throw errorCat
    }
    // 3. Actualizar estado de la solicitud con fecha_revision y revisado_por
    const { error: errorUpdate } = await supabase
      .from('solicitudes_restaurante')
      .update({ 
        estado: 'APROBADO',
        fecha_revision: new Date().toISOString(),
        revisado_por: admin_id
      })
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
    const admin_id = req.usuario.id

    const { error } = await supabase
      .from('solicitudes_restaurante')
      .update({ 
        estado: 'RECHAZADO',
        fecha_revision: new Date().toISOString(),
        revisado_por: admin_id
      })
      .eq('id', id)

    if (error) throw error

    res.json({ mensaje: 'Solicitud rechazada' })

  } catch (error) {
    res.status(500).json({ error: error.message })  
  }
}
export const getSolicitudes = async (req, res) => {
  try {
    const { data: solicitudes, error: solicitudesError } = await supabase
      .from('solicitudes_restaurante')
      .select('*')
      .order('creado_en', { ascending: false })

    if (solicitudesError) throw solicitudesError

    const usuarioIds = [...new Set(solicitudes.map(s => s.usuario_id))]
    const categoriaIds = [...new Set(solicitudes.map(s => s.categoria_id).filter(Boolean))]

    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, email, nombre')
      .in('id', usuarioIds)

    if (usuariosError) throw usuariosError

    const { data: categorias, error: categoriasError } = await supabase
      .from('categorias_restaurante')
      .select('id, nombre')
      .in('id', categoriaIds)

    if (categoriasError) throw categoriasError

    const usuariosMap = {}
    usuarios.forEach(u => { usuariosMap[u.id] = u })

    const categoriasMap = {}
    categorias.forEach(c => { categoriasMap[c.id] = c })

    const solicitudesConUsuario = solicitudes.map(solicitud => ({
      ...solicitud,
      usuario: usuariosMap[solicitud.usuario_id] || null,
      categoria: categoriasMap[solicitud.categoria_id]?.nombre || '—'
    }))

    res.json(solicitudesConUsuario)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('creado_en', { ascending: false })

    if (error) throw error

    res.json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const toggleActivo = async (req, res) => {
  try {
    const { id } = req.params

    // Obtener el valor actual de activo
    const { data: usuario, error: errorObtener } = await supabase
      .from('usuarios')
      .select('activo')
      .eq('id', id)
      .single()

    if (errorObtener || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Actualizar al booleano opuesto
    const nuevoEstado = !usuario.activo

    const { data: usuarioActualizado, error: errorActualizar } = await supabase
      .from('usuarios')
      .update({ activo: nuevoEstado })
      .eq('id', id)
      .select()
      .single()

    if (errorActualizar) throw errorActualizar

    res.json({ 
      mensaje: `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
      usuario: usuarioActualizado
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRestaurantesAdmin = async (req, res) => {
  try {
    const { data: restaurantes, error: restaurantesError } = await supabase
      .from('restaurantes')
      .select('*')
      .order('creado_en', { ascending: false })

    if (restaurantesError) throw restaurantesError

    const propietarioIds = [...new Set(restaurantes.map(r => r.propietario_id).filter(Boolean))]

    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, email, nombre')
      .in('id', propietarioIds)

    if (usuariosError) throw usuariosError

    const usuariosMap = {}
    usuarios.forEach(u => { usuariosMap[u.id] = u })

    const restaurantesConPropietario = restaurantes.map(restaurante => ({
      ...restaurante,
      propietario: usuariosMap[restaurante.propietario_id] || null
    }))

    res.json(restaurantesConPropietario)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRestauranteAdmin = async (req, res) => {
  try {
    const { id } = req.params

    // 1. Obtener datos del restaurante
    const { data: restaurante, error: errorRestaurante } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single()

    if (!restaurante || errorRestaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' })
    }

    // 2. Obtener datos del propietario
    const { data: propietario, error: errorPropietario } = await supabase
      .from('usuarios')
      .select('id, email, nombre')
      .eq('id', restaurante.propietario_id)
      .single()

    if (errorPropietario) throw errorPropietario

    // 3. Obtener categorías
    const { data: restauranteCategorias, error: errorCategorias } = await supabase
      .from('restaurante_categorias')
      .select('categoria_id, categorias_restaurante(id, nombre)')
      .eq('restaurante_id', id)

    if (errorCategorias) throw errorCategorias

    const categorias = restauranteCategorias?.map(rc => rc.categorias_restaurante) || []

    // 4. Obtener horarios
    const { data: horarios, error: errorHorarios } = await supabase
      .from('horarios')
      .select('*')
      .eq('restaurante_id', id)

    if (errorHorarios) throw errorHorarios

    res.json({
      restaurante: {
        ...restaurante,
        propietario,
        categorias,
        horarios
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}