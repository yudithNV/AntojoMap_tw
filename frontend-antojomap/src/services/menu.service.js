import { api } from './api.js'

export const restaurantesService = {
  getRestaurantes: (page = 1, limit = 10, categoria = '', ordenar = 'creado_en') => 
    api.get(`/restaurantes?page=${page}&limit=${limit}&categoria=${categoria}&ordenar=${ordenar}`),
  getRestaurante: (id) => api.get(`/restaurantes/${id}`),
  getCategorias: () => api.get('/restaurantes/categorias'),
  editarRestaurante: (id, datos) => api.put(`/restaurantes/${id}`, datos)
}

export const menuService = {
  getMenu: (restaurante_id) => almuerzosService.getAlmuerzos(restaurante_id),
  getPlato: (id) => almuerzosService.getAlmuerzo(id),
  crearPlato: (restaurante_id, datos) => almuerzosService.crearMenu(restaurante_id, {
    tipo: 'plato_suelto',
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    foto_url: datos.foto_url,
    precio: datos.precio
  }),
  editarPlato: (id, datos) => almuerzosService.editarMenu(id, {
    tipo: 'plato_suelto',
    ...datos
  }),
  eliminarPlato: (id) => almuerzosService.eliminarMenu(id)
}

export const almuerzosService = {
  getAlmuerzos: (restaurante_id) => api.get(`/almuerzos/${restaurante_id}`),
  getAlmuerzo: (id) => api.get(`/almuerzos/detalle/${id}`),
  buscarPlatos: (q, tipo = '') => api.get(`/almuerzos/buscar?q=${q}&tipo=${tipo}`), // 👈 esto
  crearMenu: (restaurante_id, datos) => api.post(`/almuerzos/${restaurante_id}`, datos),
  editarMenu: (id, datos) => api.put(`/almuerzos/${id}`, datos),
  eliminarMenu: (id) => api.delete(`/almuerzos/${id}`)
}

// 🔥 CORREGIDO: usa /feedbacks (coincide con el backend) 🔥
export const feedbackService = {
  crearFeedback: (datos) => api.post('/feedbacks', datos),
  getFeedbacksRestaurante: (restaurante_id) => api.get(`/feedbacks/restaurante/${restaurante_id}`),
  getPromedioCalificaciones: (restaurante_id) => api.get(`/feedbacks/restaurante/${restaurante_id}/promedio`),
  getMisFeedbacks: () => api.get('/feedbacks/usuario/mis-reviews'),
  editarFeedback: (id, datos) => api.put(`/feedbacks/${id}`, datos),
  eliminarFeedback: (id) => api.delete(`/feedbacks/${id}`)
}

export const favoritosService = {
  agregarFavorito: (restaurante_id) => api.post('/likes', { restaurante_id }),
  misFavoritos: () => api.get('/likes/usuario/mis-likes'),
  removerFavorito: (like_id) => api.delete(`/likes/${like_id}`)
}

export const reportesService = {
  getEstadisticas: () => api.get('/reportes/estadisticas'),
  getTopRestaurantes: (limit = 10) => api.get(`/reportes/top-restaurantes?limit=${limit}`),
  getActividadUsuarios: (limite = 30) => api.get(`/reportes/actividad-usuarios?limite=${limite}`),
  getDistribucionCategorias: () => api.get('/reportes/distribucion-categorias'),
  getSolicitudesPorEstado: () => api.get('/reportes/solicitudes-estado')
}