<template>
  <DashboardLayout>
    <!-- Bloque superior -->
    <div class="page-header">
      <div class="header-top">
        <h1>¿Qué se te antoja hoy?</h1>
        <p class="subtitle">Busca por nombre, categoría o deja que la ruleta decida por ti.</p>
        <button class="btn-ruleta" @click="router.push('/no-se-que-comer')">🎲 No sé qué comer</button>
      </div>

      <div v-if="selectedCategory" class="active-filter">
        <span>Mostrando restaurantes de <strong>{{ selectedCategory }}</strong></span>
        <button class="clear-filter-btn" @click="clearFilter">Limpiar filtro</button>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar restaurante, comida o categoría"
        class="search-input"
      />
    </div>

    <!-- Chips de categorías -->
    <div class="category-filter">
      <button
        class="category-chip"
        :class="{ active: selectedCategory === '' }"
        @click="clearFilter"
      >Todos</button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="category-chip"
        :class="{ active: selectedCategory === cat }"
        @click="selectCategory(cat)"
      >{{ cat }}</button>
    </div>

    <!-- Grid de restaurantes -->
    <div class="restaurants-grid">
      <RestaurantCard
        v-for="restaurant in filteredRestaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        linkTo="/user/menu"
      />
      <div v-if="filteredRestaurants.length === 0" class="no-restaurants">
        <p>No encontramos restaurantes con ese filtro.</p>
        <button class="clear-filter-btn" @click="clearAll">Limpiar búsqueda</button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import RestaurantCard from '../../components/RestaurantCard.vue'
import { restaurantesService } from '../../services/menu.service.js'

const route = useRoute()
const router = useRouter()

const selectedCategory = ref(route.query.categoria || '')
const searchQuery = ref('')
const restaurants = ref([])
const categories = ref([])
const cargando = ref(true)

const filteredRestaurants = computed(() => {
  return restaurants.value.filter(r => {
    const matchCategory = !selectedCategory.value || r.categoria === selectedCategory.value
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || r.nombre.toLowerCase().includes(q) || r.categoria?.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })
})

const cargarRestaurantes = async () => {
  try {
    cargando.value = true
    const { restaurantes: data } = await restaurantesService.getRestaurantes(1, 100, selectedCategory.value)
    restaurants.value = data || []
  } catch (error) {
    console.error('Error cargando restaurantes:', error)
  } finally {
    cargando.value = false
  }
}

const cargarCategorias = async () => {
  try {
    const data = await restaurantesService.getCategorias()
    categories.value = (data || []).map(c => c.nombre)
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

const selectCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
  router.push({ query: selectedCategory.value ? { categoria: selectedCategory.value } : {} })
}

const clearFilter = () => {
  selectedCategory.value = ''
  router.push({ query: {} })
}

const clearAll = () => {
  selectedCategory.value = ''
  searchQuery.value = ''
  router.push({ query: {} })
}

onMounted(() => {
  cargarCategorias()
  cargarRestaurantes()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.header-top {
  margin-bottom: 16px;
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0 0 16px 0;
}

.btn-ruleta {
  padding: 10px 20px;
  background: #FF6B00;
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-ruleta:hover {
  background: #E05F00;
}

.active-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: rgba(255, 107, 0, 0.08);
  border-left: 4px solid #FF6B00;
  border-radius: 8px;
  color: #212121;
  font-weight: 500;
  margin-top: 12px;
}

.active-filter strong {
  color: #FF6B00;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #FF6B00;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.category-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid #FF6B00;
  background: transparent;
  color: #FF6B00;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.category-chip:hover {
  background: rgba(255, 107, 0, 0.08);
}

.category-chip.active {
  background: #FF6B00;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

.restaurants-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, 1fr);
}

.no-restaurants {
  grid-column: 1 / -1;
  padding: 60px 20px;
  text-align: center;
  color: var(--dusty-coral);
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.no-restaurants p {
  font-size: 1.1rem;
  margin: 0;
}

.clear-filter-btn {
  padding: 8px 16px;
  background: #FF6B00;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

.clear-filter-btn:hover {
  background: #E05F00;
}

@media (max-width: 1024px) {
  .restaurants-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
  }

  .active-filter {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>