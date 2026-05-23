<template>
  <div class="restaurant-card" @click="goToMenu">
    <div class="card-image-container">
      <img
        v-if="!imgError"
        :src="restaurant.image"
        :alt="restaurant.name"
        class="card-image"
        @error="imgError = true"
      />
      <div v-else class="card-image-placeholder">
        <UtensilsCrossed :size="48" stroke-width="1.5" />
      </div>

      <div v-if="restaurant.badge" class="card-badge">{{ restaurant.badge }}</div>

      <button class="btn-heart" @click.stop="toggleFavorite" :class="{ active: isFavorite }">
        <Heart :size="18" :fill="isFavorite ? 'currentColor' : 'none'" />
      </button>
    </div>

    <div class="card-content">
      <h3 class="restaurant-name">{{ restaurant.name }}</h3>
      <p class="restaurant-category">{{ restaurant.category }}</p>
      <p v-if="restaurant.address" class="restaurant-address">
        <MapPin :size="13" /> {{ restaurant.address }}
      </p>

      <div class="card-footer">
        <span class="restaurant-rating">⭐ {{ restaurant.rating }}</span>
        <button class="btn-menu" @click.stop="goToMenu">Ver restaurante</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Heart, MapPin } from 'lucide-vue-next'
import { favoritosService } from '../services/menu.service.js'

const props = defineProps({
  restaurant: { type: Object, required: true },
  linkTo: { type: String, default: '/login' }
})

const router = useRouter()
const imgError = ref(false)
const isFavorite = ref(false)
const likeId = ref(null)

onMounted(async () => {
  try {
    const likes = await favoritosService.misFavoritos()
    const found = (likes || []).find(l => l.restaurante_id === props.restaurant.id)
    if (found) {
      isFavorite.value = true
      likeId.value = found.id
    }
  } catch (e) {}
})

const goToMenu = () => router.push(props.linkTo)

const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await favoritosService.removerFavorito(likeId.value)
      isFavorite.value = false
      likeId.value = null
    } else {
      const data = await favoritosService.agregarFavorito(props.restaurant.id)
      isFavorite.value = true
      likeId.value = data.id
    }
  } catch (e) {
    console.error('Error toggling favorito:', e)
  }
}
</script>

<style scoped>
.restaurant-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.10);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.restaurant-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.16);
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--blush) 0%, var(--dusty-coral) 100%);
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.restaurant-card:hover .card-image {
  transform: scale(1.05);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.7;
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--blood-orange);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.btn-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s, transform 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.btn-heart:hover { transform: scale(1.15); color: #e05f00; }
.btn-heart.active { color: #e05f00; }

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.restaurant-name {
  font-size: 1.05rem;
  color: var(--plum);
  margin: 0 0 4px 0;
  font-weight: 700;
}

.restaurant-category {
  font-size: 0.83rem;
  color: var(--dusty-coral);
  margin: 0 0 6px 0;
  font-weight: 500;
}

.restaurant-address {
  font-size: 0.8rem;
  color: #888;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.restaurant-rating {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--plum);
}

.btn-menu {
  background: var(--blood-orange);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  min-height: 40px;
  white-space: nowrap;
}

.btn-menu:hover {
  background: var(--dusty-coral);
  transform: scale(1.04);
}

@media (max-width: 640px) {
  .card-image-container { height: 170px; }
  .btn-menu { padding: 10px 12px; font-size: 0.88rem; }
}
</style>