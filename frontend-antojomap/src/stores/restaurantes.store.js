import { defineStore } from 'pinia'
import { ref } from 'vue'
import { restaurantesService } from '../services/menu.service.js'

export const useRestaurantesStore = defineStore('restaurantes', () => {
  const restaurantes = ref([])
  const categorias = ref([])
  const cargado = ref(false)

  const cargarRestaurantes = async () => {
    if (cargado.value) return // ya cargado, no vuelve a consultar
    try {
      const { restaurantes: data } = await restaurantesService.getRestaurantes(1, 100)
      restaurantes.value = (data || []).map(r => ({
        ...r,
        name: r.nombre,
        category: r.restaurante_categorias?.[0]?.categorias_restaurante?.nombre || 'Sin categoría',
        image: r.foto_portada || '',
        address: r.direccion,
        rating: r.puntuacion_promedio || '—',
      }))
      cargado.value = true
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