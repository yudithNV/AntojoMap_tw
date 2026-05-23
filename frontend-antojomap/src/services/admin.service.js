import { api } from './api.js'

export const adminService = {
  // Usuarios
  getUsuarios: () => api.get('/admin/usuarios'),
  
  // Restaurantes
  getRestaurantes: () => api.get('/restaurantes'),
  
  // Solicitudes de restaurante
  getSolicitudes: () => api.get('/admin/solicitudes'),
  
  aprobarSolicitud: (id) => api.put(`/admin/solicitudes/${id}/aprobar`),
  
  rechazarSolicitud: (id) => api.put(`/admin/solicitudes/${id}/rechazar`)
}
