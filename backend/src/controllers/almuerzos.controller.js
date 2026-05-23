import { supabase } from '../config/supabase.js'

// GET todos los menus de un restaurante
export const getMenusRestaurante = async (req, res) => {
  try {
    const { restaurante_id } = req.params

    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .eq('restaurante_id', restaurante_id)
      .eq('disponible', true)
      .order('creado_en', { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET un menu por ID
export const getMenu = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .eq('id', id)
      .single()

    if (!data) return res.status(404).json({ error: 'Menú no encontrado' })
    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST crear menu (plato_suelto o almuerzo_completo)
export const crearMenu = async (req, res) => {
  try {
    const { restaurante_id } = req.params
    const { tipo = 'plato_suelto', nombre, precio, descripcion, foto_url, entrada, principal, postre } = req.body

    // Validation
    if (!nombre || precio === undefined || !foto_url) {
      return res.status(400).json({ error: 'nombre, precio y foto_url son requeridos' })
    }

    // Verify owner
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })
    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para agregar menús a este restaurante' })
    }

    const insertData = {
      restaurante_id,
      tipo,
      nombre,
      precio: parseFloat(precio),
      descripcion: descripcion || null,
      foto_url,
      disponible: true
    }

    // Si es almuerzo_completo, agregar referencias (solo nombres, sin plato_id)
    if (tipo === 'almuerzo_completo') {
      if (entrada?.nombre) insertData.entrada_nombre = entrada.nombre
      if (principal?.nombre) insertData.principal_nombre = principal.nombre
      if (postre?.nombre) insertData.postre_nombre = postre.nombre
    }

    const { data, error } = await supabase
      .from('menu')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar menu
export const editarMenu = async (req, res) => {
  try {
    const { id } = req.params
    const { tipo = 'plato_suelto', nombre, precio, descripcion, foto_url, disponible, entrada, principal, postre } = req.body

    // Verify menu exists
    const { data: menu } = await supabase
      .from('menu')
      .select('restaurante_id')
      .eq('id', id)
      .single()

    if (!menu) return res.status(404).json({ error: 'Menú no encontrado' })

    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', menu.restaurante_id)
      .single()

    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este menú' })
    }

    const updateData = {}
    if (tipo !== undefined) updateData.tipo = tipo
    if (nombre) updateData.nombre = nombre
    if (precio !== undefined) updateData.precio = parseFloat(precio)
    if (descripcion !== undefined) updateData.descripcion = descripcion
    if (foto_url) updateData.foto_url = foto_url
    if (disponible !== undefined) updateData.disponible = disponible

    // Si es almuerzo_completo, actualizar referencias (solo nombres, sin plato_id)
    if (tipo === 'almuerzo_completo') {
      if (entrada?.nombre) updateData.entrada_nombre = entrada.nombre
      if (principal?.nombre) updateData.principal_nombre = principal.nombre
      if (postre?.nombre) updateData.postre_nombre = postre.nombre
    }

    const { data, error } = await supabase
      .from('menu')
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

// DELETE eliminar menu
export const eliminarMenu = async (req, res) => {
  try {
    const { id } = req.params

    const { data: menu } = await supabase
      .from('menu')
      .select('restaurante_id')
      .eq('id', id)
      .single()

    if (!menu) return res.status(404).json({ error: 'Menú no encontrado' })

    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', menu.restaurante_id)
      .single()

    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este menú' })
    }

    const { error } = await supabase
      .from('menu')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ mensaje: 'Menú eliminado exitosamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
