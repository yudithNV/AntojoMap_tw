import { api } from './api.js'

export const usuariosService = {
  getMiPerfil: () => api.get('/usuarios/mi-perfil'),
  editarPerfil: (datos) => api.put('/usuarios/mi-perfil', datos)
}