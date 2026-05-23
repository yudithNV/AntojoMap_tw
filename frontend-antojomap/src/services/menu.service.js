import { api } from './api.js'

export const restaurantesService = {
  // GET todos los restaurantes (con paginado y filtros)
  getRestaurantes: (page = 1, limit = 10, categoria = '', ordenar = 'creado_en') => 
    api.get(`/restaurantes?page=${page}&limit=${limit}&categoria=${categoria}&ordenar=${ordenar}`),
  
  // GET un restaurante por ID (detalle)
  getRestaurante: (id) => api.get(`/restaurantes/${id}`),
  
  // GET categorías
  getCategorias: () => api.get('/restaurantes/categorias'),
  
  // PUT editar restaurante (solo propietario)
  editarRestaurante: (id, datos) => api.put(`/restaurantes/${id}`, datos)
}

// Deprecated: usar almuerzosService directamente (tabla unificada "menu")
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
  // GET todos los menus (platos_sueltos + almuerzos_completos) de un restaurante
  getAlmuerzos: (restaurante_id) => api.get(`/almuerzos/${restaurante_id}`),
  
  // GET un menu por ID
  getAlmuerzo: (id) => api.get(`/almuerzos/detalle/${id}`),
  
  // POST crear menu (plato_suelto o almuerzo_completo)
  crearMenu: (restaurante_id, datos) => api.post(`/almuerzos/${restaurante_id}`, datos),
  
  // PUT editar menu
  editarMenu: (id, datos) => api.put(`/almuerzos/${id}`, datos),
  
  // DELETE eliminar menu
  eliminarMenu: (id) => api.delete(`/almuerzos/${id}`)
}

export const feedbackService = {
  // POST crear review (feedback)
  crearFeedback: (datos) => api.post('/feedbacks', datos),
  
  // GET reviews de un restaurante
  getFeedbacksRestaurante: (restaurante_id) => api.get(`/feedbacks/restaurante/${restaurante_id}`),
  
  // GET promedio de puntuaciones
  getPromedioCalificaciones: (restaurante_id) => api.get(`/feedbacks/restaurante/${restaurante_id}/promedio`),
  
  // GET mis reviews
  getMisFeedbacks: () => api.get('/feedbacks/usuario/mis-reviews'),
  
  // PUT editar review
  editarFeedback: (id, datos) => api.put(`/feedbacks/${id}`, datos),
  
  // DELETE eliminar review
  eliminarFeedback: (id) => api.delete(`/feedbacks/${id}`)
}

export const favoritosService = {
  // POST agregar a favoritos o likes 
  agregarFavorito: (restaurante_id) => api.post('/likes', { restaurante_id }),
  
  // GET mis favoritos
  misFavoritos: () => api.get('/likes/usuario/mis-likes'),
  
  // GET verificar si es favorito
  //esFavorito: (restaurante_id) => api.get(`/likes/${restaurante_id}/es-favorito`),
  
  // DELETE remover de favoritos
  removerFavorito: (like_id) => api.delete(`/likes/${like_id}`)
}

export const reportesService = {
  // GET estadísticas
  getEstadisticas: () => api.get('/reportes/estadisticas'),
  
  // GET top restaurantes
  getTopRestaurantes: (limit = 10) => api.get(`/reportes/top-restaurantes?limit=${limit}`),
  
  // GET actividad de usuarios
  getActividadUsuarios: (limite = 30) => api.get(`/reportes/actividad-usuarios?limite=${limite}`),
  
  // GET distribución por categoría
  getDistribucionCategorias: () => api.get('/reportes/distribucion-categorias'),
  
  // GET solicitudes por estado
  getSolicitudesPorEstado: () => api.get('/reportes/solicitudes-estado')
}
