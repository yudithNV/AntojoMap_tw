import { api } from './api.js'

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  registro: (nombre, email, password) => api.post('/auth/registro', { nombre, email, password }),
  
  solicitarRestaurante: (datos) => api.post('/auth/solicitud-restaurante', datos),
  
  logout: () => localStorage.removeItem('token')
}