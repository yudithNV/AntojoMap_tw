import { api } from './api.js'

export const adminService = {
  // Usuarios
  getUsuarios: () => api.get('/admin/usuarios'),
  toggleActivo: (id) => api.patch(`/admin/usuarios/${id}/activo`), 
  
  // Restaurantes
  getRestaurantes: () => api.get('/admin/restaurantes'),
  getRestauranteDetalle: (id) => api.get(`/admin/restaurantes/${id}`),
  
  // Solicitudes de restaurante
  getSolicitudes: () => api.get('/admin/solicitudes'),
  
  aprobarSolicitud: (id) => api.put(`/admin/solicitudes/${id}/aprobar`),
  
  rechazarSolicitud: (id) => api.put(`/admin/solicitudes/${id}/rechazar`)
}


