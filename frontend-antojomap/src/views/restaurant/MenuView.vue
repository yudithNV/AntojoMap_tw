<template>
  <div class="menu-container">
    <button @click="goBack" class="back-btn">← Volver</button>

    <header class="menu-header">
      <div class="header-text">
        <h1>{{ restauranteNombre }}</h1>
        <p v-if="restauranteDescripcion" class="description">{{ restauranteDescripcion }}</p>
      </div>
    </header>

    <div v-if="cargando" class="loading">Cargando menú...</div>
    <div v-else-if="menu.length === 0" class="empty">No hay platos disponibles</div>
    <div v-else>
      <div class="menu-grid">
        <div v-for="item in menu" :key="item.id" class="menu-item-card">
          <img v-if="item.foto_url" :src="item.foto_url" :alt="item.nombre" class="item-image" />
          <div class="item-info">
            <h3>{{ item.nombre }}</h3>
            <p v-if="item.descripcion" class="description">{{ item.descripcion }}</p>
            <div class="item-type">
              <span class="badge" :class="item.tipo">{{ item.tipo === 'plato_suelto' ? '🍽️ Plato' : '🥗 Almuerzo Completo' }}</span>
            </div>
            <p class="price">Bs {{ item.precio }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { restaurantesService } from '@/services/menu.service.js'

const router = useRouter()
const route = useRoute()

const restauranteId = route.params.id
const menu = ref([])
const cargando = ref(true)
const restauranteNombre = ref('')
const restauranteDescripcion = ref('')

const cargarMenu = async () => {
  try {
    cargando.value = true
    const { menu: data } = await restaurantesService.getRestaurante(restauranteId)
    menu.value = data || []
  } catch (error) {
    console.error('Error cargando menú:', error)
  } finally {
    cargando.value = false
  }
}

const cargarRestaurante = async () => {
  try {
    const data = await restaurantesService.getRestaurante(restauranteId)
    restauranteNombre.value = data.nombre
    restauranteDescripcion.value = data.descripcion
  } catch (error) {
    console.error('Error cargando restaurante:', error)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  cargarRestaurante()
  cargarMenu()
})
</script>

<style scoped>
.menu-container {
  min-height: 100vh;
  background: #f9f9f9;
  padding: 20px;
}

.back-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  background: #481827;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.back-btn:hover {
  background: #6b2540;
}

.menu-header {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-text h1 {
  margin: 0;
  font-size: 2rem;
  color: #212121;
}

.description {
  margin: 10px 0 0;
  color: #666;
  font-size: 1rem;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.menu-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.menu-item-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.menu-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.item-info {
  padding: 16px;
}

.item-info h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  color: #212121;
}

.item-info .description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-type {
  margin: 8px 0;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
}

.badge.plato_suelto {
  background: #ffe8cc;
  color: #d97706;
}

.badge.almuerzo_completo {
  background: #d1fae5;
  color: #059669;
}

.price {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6b00;
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }
}
</style>
<style scoped>
.menu-container {
  padding: 40px;
  background-color: #fdfcfb;
  min-height: 100vh;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-text h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin: 0;
}

.header-text span {
  color: #888;
  font-size: 0.9rem;
}

.add-plate-btn {
  background-color: #f2a359; /* El naranja de tu imagen */
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.plates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.plate-card {
  background: white;
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.plate-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 15px;
}

.plate-info h3 {
  margin: 15px 0 5px;
  font-size: 1.1rem;
  color: #333;
}

.price {
  color: #f2a359;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.plate-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  flex: 1;
  background-color: #f1f4f9;
  border: none;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #555;
  cursor: pointer;
}

.delete-btn {
  background-color: #fff1f1;
  border: none;
  padding: 8px;
  border-radius: 8px;
  color: #ff5c5c;
  cursor: pointer;
}
</style>