<template>
  <div class="home-container">
    <Navbar />
    
    <section class="hero">
      <h1>Bienvenido a AntojoMap</h1>
      <p>Descubre los mejores restaurantes cerca de ti</p>
    </section>

    <!-- CARRUSEL PREMIUM DE RECOMENDADOS -->
    <RecommendedSection />

    <section class="restaurants-section">
      <div class="section-header">
        <h2>Todos los Restaurantes</h2>
        <div class="controls">
          <input v-model="searchQuery" type="text" placeholder="Buscar restaurante..." class="search-input" />
          <select v-model="selectedCategoria" class="category-select">
            <option value="">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.nombre">
              {{ cat.nombre }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="cargando" class="loading">Cargando...</div>
      <div v-else-if="filteredRestaurantes.length === 0" class="empty">No hay restaurantes disponibles</div>
      <div v-else class="restaurants-grid">
        <div v-for="rest in filteredRestaurantes" :key="rest.id" class="restaurant-card" @click="irARestaurante(rest.id)">
          <img v-if="rest.foto_url" :src="rest.foto_url" :alt="rest.nombre" class="restaurant-image" />
          <div class="restaurant-info">
            <h3>{{ rest.nombre }}</h3>
            <p class="description">{{ rest.descripcion }}</p>
            <p class="address" v-if="rest.direccion">📍 {{ rest.direccion }}</p>
          </div>
        </div>
      </div>

      <div v-if="pages > 1" class="pagination">
        <button v-if="page > 1" @click="page--" class="pagination-btn">← Anterior</button>
        <span class="page-info">Página {{ page }} de {{ pages }}</span>
        <button v-if="page < pages" @click="page++" class="pagination-btn">Siguiente →</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import RecommendedSection from '../components/RecommendedSection.vue'
import { restaurantesService } from '../services/menu.service.js'

const router = useRouter()
const restaurantes = ref([])
const categorias = ref([])
const cargando = ref(true)
const searchQuery = ref('')
const selectedCategoria = ref('')
const page = ref(1)
const pages = ref(1)
const limit = 10

const filteredRestaurantes = computed(() => {
  return restaurantes.value.filter(r => {
    const matchesSearch = r.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

const cargarRestaurantes = async () => {
  try {
    cargando.value = true
    const { restaurantes: data, pages: totalPages } = await restaurantesService.getRestaurantes(
      page.value,
      limit,
      selectedCategoria.value
    )
    restaurantes.value = data || []
    pages.value = totalPages
  } catch (error) {
    console.error('Error cargando restaurantes:', error)
  } finally {
    cargando.value = false
  }
}

const cargarCategorias = async () => {
  try {
    const data = await restaurantesService.getCategorias()
    categorias.value = data || []
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

const irARestaurante = (id) => {
  router.push({ name: 'restaurant-detail', params: { id } })
}

watch([page, selectedCategoria], () => {
  cargarRestaurantes()
})

onMounted(() => {
  cargarCategorias()
  cargarRestaurantes()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f9f9f9;
}

.hero {
  background: linear-gradient(135deg, #481827 0%, #ff6b00 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin: 0 0 10px;
}

.hero p {
  font-size: 1.2rem;
  margin: 0;
}

.restaurants-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.controls {
  display: flex;
  gap: 12px;
}

.search-input, .category-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus, .category-select:focus {
  outline: none;
  border-color: #ff6b00;
  box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.restaurant-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.restaurant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.restaurant-info {
  padding: 16px;
}

.restaurant-info h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  color: #333;
}

.description {
  margin: 0 0 8px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.address {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}

.pagination-btn {
  padding: 8px 16px;
  background: #ff6b00;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.pagination-btn:hover {
  background: #e55a00;
}

.page-info {
  font-weight: 500;
  color: #555;
}

@media (max-width: 768px) {
  .hero {
    padding: 50px 20px;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .controls {
    flex-direction: column;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
  }
}
</style>