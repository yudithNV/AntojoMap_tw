<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Tus favoritos</h1>
      <p class="subtitle">Guarda restaurantes para encontrarlos rápido después.</p>
    </div>

    <!-- Estado vacío -->
    <div v-if="favorites.length === 0" class="empty-state">
      <Heart :size="56" stroke-width="1.5" />
      <h3>Todavía no tienes favoritos.</h3>
      <p>Explora restaurantes y toca el corazón para guardarlos.</p>
      <button class="btn-explorar" @click="router.push('/user/feed')">Explorar restaurantes</button>
    </div>

    <!-- Grid de favoritos -->
    <div v-else class="restaurants-grid">
      <RestaurantCard
        v-for="restaurant in favorites"
        :key="restaurant.id"
        :restaurant="restaurant""
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import RestaurantCard from '../../components/RestaurantCard.vue'
import { Heart } from 'lucide-vue-next'
import { useFavoritosStore } from '../../stores/favoritos.store.js'
import { restaurantesService, feedbackService } from '../../services/menu.service.js'
import { ref } from 'vue'

const router = useRouter()
const favoritosStore = useFavoritosStore()
const restaurantes = ref([])

onMounted(async () => {
  await favoritosStore.cargarFavoritos()
  
  const ids = favoritosStore.favoritos.map(f => f.restaurante_id).filter(Boolean)
  if (ids.length === 0) return

  const data = await Promise.all(ids.map(id => restaurantesService.getRestaurante(id)))
  restaurantes.value = data.map(r => ({
    ...r,
    name: r.nombre,
    category: r.restaurante_categorias?.[0]?.categorias_restaurante?.nombre || '',
    image: r.foto_portada || '',
    address: r.direccion,
    rating: '—'
  }))

  // Cargar promedios
  restaurantes.value.forEach(async (r, i) => {
    try {
      const { promedio } = await feedbackService.getPromedioCalificaciones(r.id)
      restaurantes.value[i].rating = promedio > 0 ? promedio : '—'
    } catch {}
  })
})

const favorites = computed(() => restaurantes.value)
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0;
}

.empty-state {
  background: white;
  padding: 60px 20px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--dusty-coral);
}

.empty-state svg {
  color: var(--blood-orange);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.2rem;
  color: var(--plum);
  margin: 0;
}

.empty-state p {
  font-size: 0.95rem;
  margin: 0;
  color: var(--dusty-coral);
}

.btn-explorar {
  margin-top: 8px;
  padding: 12px 24px;
  background: var(--blood-orange);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-explorar:hover {
  background: var(--dusty-coral);
}

.restaurants-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1024px) {
  .restaurants-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-header h1 { font-size: 1.5rem; }
  .restaurants-grid { grid-template-columns: 1fr; }
}
</style>