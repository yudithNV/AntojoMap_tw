import { supabase } from '../config/supabase.js'

// Helper: fetch menu items referenced by ids (from menu table itself)
const fetchMenuItemsByIds = async (ids = []) => {
  const unique = Array.from(new Set(ids.filter(Boolean)))
  if (unique.length === 0) return {}
  const { data: items } = await supabase
    .from('menu')
    .select('id, nombre, descripcion, foto_url, precio, tipo')
    .in('id', unique)
  const map = {}
  (items || []).forEach(i => { map[i.id] = i })
  return map
}

// GET todos los menus de un restaurante (tabla 'menu' unificada)
export const getMenusRestaurante = async (req, res) => {
  try {
    const { restaurante_id } = req.params

    const { data, error } = await supabase
      .from('menu')
      .select('id, tipo, nombre, descripcion, foto_url, precio, creado_en, entrada_plato_id, entrada_nombre, principal_plato_id, principal_nombre, postre_plato_id, postre_nombre')
      .eq('restaurante_id', restaurante_id)
      .order('creado_en', { ascending: false })

    if (error) throw error

    const menus = data || []

    // Resolve referenced menu items (plato_id = menu.id con tipo='plato_suelto')
    const itemIds = []
    menus.forEach(m => {
      if (m.entrada_plato_id) itemIds.push(m.entrada_plato_id)
      if (m.principal_plato_id) itemIds.push(m.principal_plato_id)
      if (m.postre_plato_id) itemIds.push(m.postre_plato_id)
    })

    const itemsMap = await fetchMenuItemsByIds(itemIds)

    const result = menus.map(m => ({
      id: m.id,
      tipo: m.tipo,
      nombre: m.nombre,
      descripcion: m.descripcion,
      foto_url: m.foto_url,
      precio: m.precio,
      creado_en: m.creado_en,
      entrada: m.entrada_plato_id ? itemsMap[m.entrada_plato_id] || null : { nombre: m.entrada_nombre || null },
      principal: m.principal_plato_id ? itemsMap[m.principal_plato_id] || null : { nombre: m.principal_nombre || null },
      postre: m.postre_plato_id ? itemsMap[m.postre_plato_id] || null : { nombre: m.postre_nombre || null }
    }))

    res.json(result)
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
      .select('id, tipo, nombre, descripcion, foto_url, precio, creado_en, restaurante_id, entrada_plato_id, entrada_nombre, principal_plato_id, principal_nombre, postre_plato_id, postre_nombre')
      .eq('id', id)
      .single()

    if (!data) return res.status(404).json({ error: 'Menú no encontrado' })
    if (error) throw error

    const itemsMap = await fetchMenuItemsByIds([data.entrada_plato_id, data.principal_plato_id, data.postre_plato_id])

    const menu = {
      id: data.id,
      tipo: data.tipo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      foto_url: data.foto_url,
      precio: data.precio,
      creado_en: data.creado_en,
      entrada: data.entrada_plato_id ? itemsMap[data.entrada_plato_id] || null : { nombre: data.entrada_nombre || null },
      principal: data.principal_plato_id ? itemsMap[data.principal_plato_id] || null : { nombre: data.principal_nombre || null },
      postre: data.postre_plato_id ? itemsMap[data.postre_plato_id] || null : { nombre: data.postre_nombre || null }
    }

    res.json(menu)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Helper: prepare insert/update values for unified table
const prepareMenuFields = (body) => {
  const out = {}
  if (body.tipo) out.tipo = body.tipo
  if (body.nombre !== undefined) out.nombre = body.nombre
  if (body.descripcion !== undefined) out.descripcion = body.descripcion || null
  if (body.foto_url !== undefined) out.foto_url = body.foto_url || null
  if (body.precio !== undefined) out.precio = body.precio !== null ? parseFloat(body.precio) : null

  const entrada = body.entrada
  if (entrada) {
    if (entrada.plato_id) {
      out.entrada_plato_id = entrada.plato_id
      out.entrada_nombre = null
    } else {
      out.entrada_plato_id = null
      out.entrada_nombre = entrada.nombre || null
    }
  }
  const principal = body.principal
  if (principal) {
    if (principal.plato_id) {
      out.principal_plato_id = principal.plato_id
      out.principal_nombre = null
    } else {
      out.principal_plato_id = null
      out.principal_nombre = principal.nombre || null
    }
  }
  const postre = body.postre
  if (postre) {
    if (postre.plato_id) {
      out.postre_plato_id = postre.plato_id
      out.postre_nombre = null
    } else {
      out.postre_plato_id = null
      out.postre_nombre = postre.nombre || null
    }
  }

  return out
}

// POST crear menu (unified table)
export const crearMenu = async (req, res) => {
  try {
    const { restaurante_id } = req.params
    const payload = req.body || {}

    // Basic validation
    if (!payload.tipo) return res.status(400).json({ error: 'tipo es requerido (plato_suelto|almuerzo_completo)' })
    
    if (payload.tipo === 'plato_suelto') {
      if (!payload.nombre || payload.precio === undefined || !payload.foto_url) {
        return res.status(400).json({ error: 'plato_suelto requiere: nombre, precio, foto_url' })
      }
    }
    
    if (payload.tipo === 'almuerzo_completo') {
      if (!payload.entrada || !payload.principal || !payload.postre) {
        return res.status(400).json({ error: 'almuerzo_completo requiere: entrada, principal, postre' })
      }
    }

    // Verify owner
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })
    if (restaurante.propietario_id !== req.usuario.id) return res.status(403).json({ error: 'No tienes permiso para agregar menús a este restaurante' })

    const insertData = prepareMenuFields(payload)
    insertData.restaurante_id = restaurante_id

    const { data: newMenu, error } = await supabase
      .from('menu')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    // Return created menu resolved
    const itemsMap = await fetchMenuItemsByIds([newMenu.entrada_plato_id, newMenu.principal_plato_id, newMenu.postre_plato_id])

    const menu = {
      id: newMenu.id,
      tipo: newMenu.tipo,
      nombre: newMenu.nombre,
      descripcion: newMenu.descripcion,
      foto_url: newMenu.foto_url,
      precio: newMenu.precio,
      creado_en: newMenu.creado_en,
      entrada: newMenu.entrada_plato_id ? itemsMap[newMenu.entrada_plato_id] || null : { nombre: newMenu.entrada_nombre || null },
      principal: newMenu.principal_plato_id ? itemsMap[newMenu.principal_plato_id] || null : { nombre: newMenu.principal_nombre || null },
      postre: newMenu.postre_plato_id ? itemsMap[newMenu.postre_plato_id] || null : { nombre: newMenu.postre_nombre || null }
    }

    res.status(201).json(menu)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar menu
export const editarMenu = async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body || {}

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

    if (restaurante.propietario_id !== req.usuario.id) return res.status(403).json({ error: 'No tienes permiso para editar este menú' })

    const updateData = prepareMenuFields(payload)

    const { error } = await supabase
      .from('menu')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    // Return updated
    const { data: updated } = await supabase
      .from('menu')
      .select('id, tipo, nombre, descripcion, foto_url, precio, creado_en, entrada_plato_id, entrada_nombre, principal_plato_id, principal_nombre, postre_plato_id, postre_nombre')
      .eq('id', id)
      .single()

    const itemsMap = await fetchMenuItemsByIds([updated.entrada_plato_id, updated.principal_plato_id, updated.postre_plato_id])

    const menuOut = {
      id: updated.id,
      tipo: updated.tipo,
      nombre: updated.nombre,
      descripcion: updated.descripcion,
      foto_url: updated.foto_url,
      precio: updated.precio,
      creado_en: updated.creado_en,
      entrada: updated.entrada_plato_id ? itemsMap[updated.entrada_plato_id] || null : { nombre: updated.entrada_nombre || null },
      principal: updated.principal_plato_id ? itemsMap[updated.principal_plato_id] || null : { nombre: updated.principal_nombre || null },
      postre: updated.postre_plato_id ? itemsMap[updated.postre_plato_id] || null : { nombre: updated.postre_nombre || null }
    }

    res.json(menuOut)
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

    if (restaurante.propietario_id !== req.usuario.id) return res.status(403).json({ error: 'No tienes permiso para eliminar este menú' })

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
