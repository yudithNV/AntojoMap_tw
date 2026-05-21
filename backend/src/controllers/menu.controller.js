import { supabase } from '../config/supabase.js'

// GET todos los platos de un restaurante
export const getMenuRestaurante = async (req, res) => {
  try {
    const { restaurante_id } = req.params

    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .eq('restaurante_id', restaurante_id)
      .order('creado_en', { ascending: false })

    if (error) throw error

    res.json(data || [])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET un plato por ID
export const getPlato = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .eq('id', id)
      .single()

    if (!data) return res.status(404).json({ error: 'Plato no encontrado' })
    if (error) throw error

    res.json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST crear plato
export const crearPlato = async (req, res) => {
  try {
    const { restaurante_id } = req.params
    const { nombre, precio, descripcion, foto_url, categoria } = req.body

    // Validación
    if (!nombre || !precio || !foto_url) {
      return res.status(400).json({ error: 'Nombre, precio y foto_url son requeridos' })
    }

    // Verificar que el restaurante pertenece al usuario logueado
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', restaurante_id)
      .single()

    if (!restaurante) return res.status(404).json({ error: 'Restaurante no encontrado' })

    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para agregar platos a este restaurante' })
    }

    const { data, error } = await supabase
      .from('platos')
      .insert({
        restaurante_id,
        nombre,
        precio: parseFloat(precio),
        descripcion: descripcion || null,
        foto_url,
        categoria: categoria || null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT editar plato
export const editarPlato = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, precio, descripcion, foto_url, categoria } = req.body

    // Verificar que el plato pertenece a un restaurante del usuario
    const { data: plato } = await supabase
      .from('platos')
      .select('restaurante_id')
      .eq('id', id)
      .single()

    if (!plato) return res.status(404).json({ error: 'Plato no encontrado' })

    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', plato.restaurante_id)
      .single()

    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este plato' })
    }

    const updateData = {}
    if (nombre) updateData.nombre = nombre
    if (precio) updateData.precio = parseFloat(precio)
    if (descripcion) updateData.descripcion = descripcion
    if (foto_url) updateData.foto_url = foto_url
    if (categoria) updateData.categoria = categoria

    const { data, error } = await supabase
      .from('platos')
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

// DELETE eliminar plato
export const eliminarPlato = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que el plato pertenece a un restaurante del usuario
    const { data: plato } = await supabase
      .from('platos')
      .select('restaurante_id')
      .eq('id', id)
      .single()

    if (!plato) return res.status(404).json({ error: 'Plato no encontrado' })

    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('propietario_id')
      .eq('id', plato.restaurante_id)
      .single()

    if (restaurante.propietario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este plato' })
    }

    const { error } = await supabase
      .from('platos')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ mensaje: 'Plato eliminado exitosamente' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
