// lógica de cada ruta

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

// Validación de email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)

// Validación de contraseña
const isValidPassword = (password) => password && password.length >= 8

// REGISTRO DE USUARIO NORMAL
export const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    // 0. Validación de inputs
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' })
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Contraseña debe tener al menos 8 caracteres' })
    }

    // 1. Verificar si el email ya existe
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single()

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // 2. Encriptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // 3. Guardar en la DB
    const { data, error } = await supabase
      .from('usuarios')
      .insert({ nombre, email, password: passwordHash, rol: 'USER', activo: true })
      .select()
      .single()

    if (error) throw error

    // 4. Crear token
    const token = jwt.sign(
      { id: data.id, rol: data.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, usuario: { id: data.id, nombre: data.nombre, email: data.email, rol: data.rol } })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 0. Validación de inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    // 1. Buscar usuario
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    // 2. Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password)

    if (!passwordValida) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    // 3. Crear token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 4. Si es restaurante, buscar ID del restaurante asociado
    let restaurante_id = null
    if (usuario.rol === 'RESTAURANTE') {
      console.log('Buscando restaurante para usuario:', usuario.id)
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('id')
        .eq('propietario_id', usuario.id)
        .single()
      restaurante_id = restaurante?.id || null
      console.log('Restaurante encontrado:', restaurante_id)
    }

    const responseData = { 
      id: usuario.id, 
      nombre: usuario.nombre, 
      email: usuario.email, 
      rol: usuario.rol 
    }
    if (restaurante_id) {
      responseData.restaurante_id = restaurante_id
    }

    console.log('Login response:', responseData)
    res.json({ token, usuario: responseData })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
}

// SOLICITUD DE RESTAURANTE
export const solicitarRestaurante = async (req, res) => {
  try {
    const { nombre_restaurante, direccion, telefono, categoria, email, password, foto_comprobante } = req.body

    // 0. Validación de inputs
    if (!nombre_restaurante || !direccion || !telefono || !categoria || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' })
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Contraseña debe tener al menos 8 caracteres' })
    }

    // 1. Verificar si el email ya existe
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single()

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // 2. Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // 3. Crear usuario con rol RESTAURANTE
    const { data: nuevoUsuario, error: errorUsuario } = await supabase
      .from('usuarios')
      .insert({ nombre: nombre_restaurante, email, password: passwordHash, rol: 'RESTAURANTE', activo: true })
      .select()
      .single()

    if (errorUsuario) throw errorUsuario

    // 4. Crear solicitud vinculada al usuario
    // categoria ahora es categoria_id (FK), así que asumimos que es un UUID válido
    const { error: errorSolicitud } = await supabase
      .from('solicitudes_restaurante')
      .insert({
        usuario_id: nuevoUsuario.id,
        nombre_restaurante,
        direccion,
        telefono,
        categoria_id: categoria, // ahora es FK a categorias_restaurante
        foto_comprobante: foto_comprobante || null,
        estado: 'PENDIENTE'
      })

    if (errorSolicitud) {
      await supabase.from('usuarios').delete().eq('id', nuevoUsuario.id)
      throw errorSolicitud
    }

    res.status(201).json({ mensaje: '¡Solicitud enviada! El administrador revisará tu registro pronto.' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// CREAR ADMIN (requiere clave secreta)
export const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, clave_secreta } = req.body

    // 0. Validaciones
    if (!nombre || !email || !password || !clave_secreta) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    if (clave_secreta !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Clave secreta inválida' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' })
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Contraseña debe tener al menos 8 caracteres' })
    }

    // 1. Verificar si el email ya existe
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single()

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // 2. Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // 3. Crear admin
    const { data, error } = await supabase
      .from('usuarios')
      .insert({ nombre, email, password: passwordHash, rol: 'ADMIN', activo: true })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ mensaje: 'Admin creado exitosamente', usuario: { id: data.id, nombre: data.nombre, email: data.email, rol: data.rol } })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// VERIFICAR ESTADO SOLICITUD RESTAURANTE
export const verificarEstadoSolicitud = async (req, res) => {
  try {
    const { usuario_id } = req.params

    const { data: solicitud, error } = await supabase
      .from('solicitudes_restaurante')
      .select('id, estado, nombre_restaurante')
      .eq('usuario_id', usuario_id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    res.json({
      estado: solicitud.estado,
      nombre_restaurante: solicitud.nombre_restaurante,
      puede_acceder: solicitud.estado === 'APROBADO'
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// RECUPERACIÓN DE CONTRASEÑA - FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email requerido' })

    // Verificar si el usuario existe
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id, email, nombre')
      .eq('email', email)
      .single()

    // Siempre responder lo mismo por seguridad
    if (!usuario) {
      return res.json({ mensaje: 'Si el email existe, recibirás un correo' })
    }

    // Generar token y expiración (1 hora)
    const token = uuidv4()
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    // Guardar token en BD
    await supabase.from('password_resets').insert({ email, token, expires_at })

    // Enviar email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await transporter.sendMail({
      from: `"AntojoMap" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de contraseña - AntojoMap',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
          <h2>Hola ${usuario.nombre}!</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <a href="${resetUrl}" style="
            display: inline-block; padding: 12px 24px;
            background: #481827; color: white;
            border-radius: 8px; text-decoration: none; font-weight: bold;
          ">Restablecer contraseña</a>
          <p style="color: #999; font-size: 0.85rem;">Este enlace expira en 1 hora.</p>
        </div>
      `
    })

    res.json({ mensaje: 'Si el email existe, recibirás un correo' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// RECUPERACIÓN DE CONTRASEÑA - RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token y nueva contraseña requeridos' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    }

    // Verificar token
    const { data: reset } = await supabase
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .eq('usado', false)
      .single()

    if (!reset) return res.status(400).json({ error: 'Token inválido o expirado' })

    if (new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token expirado' })
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar contraseña
    await supabase
      .from('usuarios')
      .update({ password: hashedPassword })
      .eq('email', reset.email)

    // Marcar token como usado
    await supabase
      .from('password_resets')
      .update({ usado: true })
      .eq('token', token)

    res.json({ mensaje: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}