import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usuariosService } from '../services/usuarios.service.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const id = ref(localStorage.getItem('user_id') || '')
  const nombre = ref(localStorage.getItem('user_name') || '')
  const email = ref(localStorage.getItem('user_email') || '')
  const rol = ref(localStorage.getItem('user_role') || '')
  const foto = ref(localStorage.getItem('user_photo') || '')
  const bio = ref('')

  const setUsuario = (datos) => {
    token.value = datos.token || token.value
    id.value = datos.id || ''
    nombre.value = datos.nombre || ''
    email.value = datos.email || ''
    rol.value = datos.rol || ''
    foto.value = datos.foto_perfil || ''
    bio.value = datos.bio || ''

    localStorage.setItem('token', token.value)
    localStorage.setItem('user_id', id.value)
    localStorage.setItem('user_name', nombre.value)
    localStorage.setItem('user_email', email.value)
    localStorage.setItem('user_role', rol.value)
    localStorage.setItem('user_photo', foto.value)
  }

  const actualizarPerfil = (datos) => {
    nombre.value = datos.nombre || nombre.value
    foto.value = datos.foto_perfil || foto.value
    bio.value = datos.bio || bio.value
    localStorage.setItem('user_name', nombre.value)
    localStorage.setItem('user_photo', foto.value)
  }

  const logout = () => {
    token.value = ''
    id.value = ''
    nombre.value = ''
    email.value = ''
    rol.value = ''
    foto.value = ''
    bio.value = ''
    ;['token', 'user_id', 'user_email', 'user_name', 'user_role', 'restaurante_id', 'user_photo']
      .forEach(k => localStorage.removeItem(k))
  }

  const cargarPerfil = async () => {
    try {
      const data = await usuariosService.getMiPerfil()
      nombre.value = data.nombre
      email.value = data.email
      foto.value = data.foto_perfil || ''
      bio.value = data.bio || ''
      localStorage.setItem('user_name', data.nombre)
      localStorage.setItem('user_photo', data.foto_perfil || '')
    } catch (e) {
      console.error('Error cargando perfil:', e)
    }
  }

  return { token, id, nombre, email, rol, foto, bio, setUsuario, actualizarPerfil, logout, cargarPerfil }
})