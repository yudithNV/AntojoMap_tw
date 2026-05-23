import { api } from './api.js'

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  registro: (nombre, email, password) => api.post('/auth/registro', { nombre, email, password }),
  
  solicitarRestaurante: (datos) => api.post('/auth/solicitud-restaurante', datos),
  
  verificarEstadoSolicitud: (usuario_id) => api.get(`/auth/estado-solicitud/${usuario_id}`),
  
  logout: () => localStorage.removeItem('token')
}