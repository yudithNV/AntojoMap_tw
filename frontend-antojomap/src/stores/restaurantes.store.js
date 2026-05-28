import { defineStore } from 'pinia'
import { ref } from 'vue'
import { restaurantesService, feedbackService } from '../services/menu.service.js'

export const useRestaurantesStore = defineStore('restaurantes', () => {
  const restaurantes = ref([])
  const categorias = ref([])
  const cargado = ref(false)

  const cargarRestaurantes = async () => {
    if (cargado.value) return
    try {
      const { restaurantes: data } = await restaurantesService.getRestaurantes(1, 100)
      restaurantes.value = (data || []).map(r => ({
        ...r,
        name: r.nombre,
        category: r.restaurante_categorias?.[0]?.categorias_restaurante?.nombre || 'Sin categoría',
        image: r.foto_portada || '',
        address: r.direccion,
        rating: '—',
      }))
      cargado.value = true

      // Cargar promedios en paralelo
      restaurantes.value.forEach(async (r, i) => {
        try {
          const { promedio } = await feedbackService.getPromedioCalificaciones(r.id)
          restaurantes.value[i].rating = promedio > 0 ? promedio : '—'
        } catch {}
      })
    } catch (e) {
      console.error('Error cargando restaurantes:', e)
    }
  }

  const cargarCategorias = async () => {
    if (categorias.value.length > 0) return
    try {
      const data = await restaurantesService.getCategorias()
      categorias.value = (data || []).map(c => c.nombre)
    } catch (e) {
      console.error('Error cargando categorías:', e)
    }
  }

  const reset = () => {
    restaurantes.value = []
    categorias.value = []
    cargado.value = false
  }

  return { restaurantes, categorias, cargado, cargarRestaurantes, cargarCategorias, reset }
})