import { api } from './api.js'

export const horariosService = {
  getHorarios: (restaurante_id) => api.get(`/horarios/${restaurante_id}`),
  guardarHorarios: (restaurante_id, horarios) => api.post(`/horarios/${restaurante_id}`, { horarios }),
  actualizarCategoria: (restaurante_id, categoria_id) => api.put(`/restaurantes/${restaurante_id}/categoria`, { categoria_id }),
  actualizarCategorias: (restaurante_id, categorias_ids) => api.put(`/restaurantes/${restaurante_id}/categorias`, { categorias_ids })
}