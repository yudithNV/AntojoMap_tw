import { defineStore } from 'pinia'
import { ref } from 'vue'
import { favoritosService } from '../services/menu.service.js'

export const useFavoritosStore = defineStore('favoritos', () => {
  const favoritos = ref([])
  const cargado = ref(false)

  const cargarFavoritos = async () => {
    if (cargado.value) return // ya cargado, no vuelve a consultar
    try {
      const data = await favoritosService.misFavoritos()
      favoritos.value = data || []
      cargado.value = true
    } catch (e) {
      console.error('Error cargando favoritos:', e)
    }
  }

  const esFavorito = (restaurante_id) => {
    return favoritos.value.some(f => f.restaurante_id === restaurante_id)
  }

  const getLikeId = (restaurante_id) => {
    return favoritos.value.find(f => f.restaurante_id === restaurante_id)?.id
  }

  const agregar = async (restaurante_id) => {
    try {
      const data = await favoritosService.agregarFavorito(restaurante_id)
      favoritos.value.push(data)
      return data
    } catch (e) {
      console.error('Error agregando favorito:', e)
    }
  }

  const remover = async (like_id, restaurante_id) => {
    try {
      await favoritosService.removerFavorito(like_id)
      favoritos.value = favoritos.value.filter(f => f.restaurante_id !== restaurante_id)
    } catch (e) {
      console.error('Error removiendo favorito:', e)
    }
  }

  const reset = () => {
    favoritos.value = []
    cargado.value = false
  }

  return { favoritos, cargado, cargarFavoritos, esFavorito, getLikeId, agregar, remover, reset }
})