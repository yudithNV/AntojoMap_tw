import { supabase } from '../config/supabase.js'

// GET todos los restaurantes con paginado y filtros
export const getRestaurantes = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoria, ordenar = 'creado_en' } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    let query = supabase
      .from('restaurantes')
      .select('*', { count: 'exact' })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error, count } = await query
      .order(ordenar, { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    if (error) throw error

    res.json({
      restaurantes: data,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET un restaurante por id (detalle completo)
export const getRestaurante = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('restaurantes')
      .select('id, nombre, descripcion, foto_url, direccion, telefono, latitud, longitud, categoria, propietario_id, creado_en, horario_apertura, horario_cierre')
      .eq('id', id)
      .single()

    if (!data) return res.status(404).json({ error: 'Restaurante no encontrado' })
    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar perfil del restaurante (solo propietario)
export const editarRestaurante = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, direccion, telefono, latitud, longitud, horario_apertura, horario_cierre } = req.body

    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })
    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este restaurante' })
    }

    const updateData = {}
    if (nombre) updateData.nombre = nombre
    if (descripcion) updateData.descripcion = descripcion
    if (direccion) updateData.direccion = direccion
    if (telefono) updateData.telefono = telefono
    if (latitud) updateData.latitud = latitud
    if (longitud) updateData.longitud = longitud
    if (horario_apertura) updateData.horario_apertura = horario_apertura
    if (horario_cierre) updateData.horario_cierre = horario_cierre

    const { data, error } = await supabase
      .from('restaurantes')
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

// GET categorías de restaurantes
export const getCategorias = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categorias_restaurante')
      .select('*')

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}