import { api } from './api.js'

export const adminService = {
  // Solicitudes de restaurante
  getSolicitudes: () => api.get('/admin/solicitudes'),
  
  aprobarSolicitud: (id) => api.put(`/admin/solicitudes/${id}/aprobar`),
  
  rechazarSolicitud: (id) => api.put(`/admin/solicitudes/${id}/rechazar`)
}
