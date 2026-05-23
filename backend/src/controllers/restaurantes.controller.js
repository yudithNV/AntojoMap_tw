import { supabase } from '../config/supabase.js'

// GET todos los restaurantes con paginado y filtros
export const getRestaurantes = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoria, ordenar = 'creado_en' } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    let query = supabase
      .from('restaurantes')
      .select('*, restaurante_categorias(categoria_id, categorias_restaurante(id, nombre))', { count: 'exact' })
      .eq('estado', 'activo')

    if (categoria) {
      // Filtrar por nombre de categoría
      const { data: cat } = await supabase
        .from('categorias_restaurante')
        .select('id')
        .eq('nombre', categoria)
        .single()

      if (cat) {
        query = query.eq('restaurante_categorias.categoria_id', cat.id)
      }
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
    const usuarioId = req.usuario?.id

    // 👇 agregá esto temporalmente
    console.log('id param:', id)
    console.log('usuarioId:', usuarioId)

    const { data, error } = await supabase
      .from('restaurantes')
      .select('id, nombre, descripcion, foto_portada, direccion, telefono, latitud, longitud, propietario_id, creado_en, estado, restaurante_categorias(categoria_id, categorias_restaurante(id, nombre))')
      .eq('id', id)
      .single()


    // 👇 agregá esto
    console.log('data:', data)
    console.log('error:', error)
    console.log('error supabase:', error)

    if (!data) return res.status(404).json({ error: 'Restaurante no encontrado' })
    if (error) throw error

    // Permitir acceso si: es propietario O restaurante está activo
    const esPropietario = usuarioId && data.propietario_id === usuarioId
    const estaActivo = data.estado === 'activo'

    if (!esPropietario && !estaActivo) {
      return res.status(404).json({ error: 'Restaurante no encontrado' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar perfil del restaurante (solo propietario)
export const editarRestaurante = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, direccion, telefono, latitud, longitud, estado, foto_portada } = req.body

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
    // ❌ sacá estas dos:
    // if (horario_apertura) updateData.horario_apertura = horario_apertura
    // if (horario_cierre) updateData.horario_cierre = horario_cierre
    if (foto_portada !== undefined) updateData.foto_portada = foto_portada
    if (estado && ['activo', 'inactivo'].includes(estado)) updateData.estado = estado

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
// para actualizar categoría de un restaurante (solo propietario)
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params
    const { categoria_id } = req.body

    if (!categoria_id) return res.status(400).json({ error: 'categoria_id requerido' })

    await supabase.from('restaurante_categorias').delete().eq('restaurante_id', id)
    const { error } = await supabase.from('restaurante_categorias').insert({ restaurante_id: id, categoria_id })
    if (error) throw error

    res.json({ mensaje: 'Categoría actualizada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}