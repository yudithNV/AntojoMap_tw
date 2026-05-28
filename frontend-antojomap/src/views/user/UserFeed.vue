<template>
  <DashboardLayout>
    <div class="page-header">
      <div class="header-top">
        <h1>¿Qué se te antoja hoy?</h1>
        <p class="subtitle">Busca por nombre, categoría o deja que la ruleta decida por ti.</p>
        
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'restaurantes' }"
          @click="activeTab = 'restaurantes'"
        >
          <Store :size="20" />
          Restaurantes
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'platos' }"
          @click="activeTab = 'platos'"
        >
          <UtensilsCrossed :size="20" />
          Platos
        </button>
      </div>
    </div>

    <!-- TAB RESTAURANTES -->
    <div v-if="activeTab === 'restaurantes'" class="tab-content">
      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <Search :size="20" class="search-icon" />
        <input 
          v-model="searchRestaurantes" 
          type="text" 
          placeholder="Buscar por nombre..." 
          class="search-input" 
        />
      </div>

      <!-- Chips de categoría -->
      <div v-if="restaurantesStore.categorias.length > 0" class="category-filter">
        <button 
          class="category-chip" 
          :class="{ active: selectedCategories.length === 0 }" 
          @click="selectedCategories = []"
        >
          Todos
        </button>
        <button 
          v-for="cat in restaurantesStore.categorias" 
          :key="cat" 
          class="category-chip" 
          :class="{ active: selectedCategories.includes(cat) }" 
          @click="toggleCategory(cat)"
        >
          {{ cat }}
        </button>
        <button class="btn-ruleta" @click="irARuleta">🎲 Sorpréndeme</button>
      </div>

      <!-- Grid de restaurantes -->
      <div v-if="filteredRestaurants.length === 0" class="no-results">
        <p>No encontramos restaurantes con esos filtros.</p>
        <button class="btn-clear" @click="clearRestaurantesFilters">Limpiar filtros</button>
      </div>
      <div v-else class="restaurants-grid">
        <RestaurantCard 
          v-for="restaurant in filteredRestaurants" 
          :key="restaurant.id" 
          :restaurant="restaurant" 
          :linkTo="`/user/menu/${restaurant.id}`" 
        />
      </div>
    </div>

    <!-- TAB PLATOS -->
    <div v-if="activeTab === 'platos'" class="tab-content">
      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <Search :size="20" class="search-icon" />
        <input 
          v-model="searchPlatos" 
          type="text" 
          placeholder="Buscar platos..." 
          class="search-input" 
        />
      </div>

      <!-- Chips de tipo -->
      <div class="tipo-filter">
        <button 
          class="tipo-chip" 
          :class="{ active: selectedTipoPlato === '' }" 
          @click="selectedTipoPlato = ''"
        >
          🍽️ Todos
        </button>
        <button 
          class="tipo-chip" 
          :class="{ active: selectedTipoPlato === 'plato_suelto' }" 
          @click="selectedTipoPlato = 'plato_suelto'"
        >
          🥘 Platos
        </button>
        <button 
          class="tipo-chip" 
          :class="{ active: selectedTipoPlato === 'almuerzo_completo' }" 
          @click="selectedTipoPlato = 'almuerzo_completo'"
        >
          🥗 Almuerzos Completos
        </button>
        <button 
          class="tipo-chip btn-sorprendeme" 
          @click="mostrarRuleta = true"
        >
          🎲 Sorpréndeme
        </button>
      </div>

      <!-- Grid de platos -->
      <div v-if="buscandoPlatos" class="loading-state">
        <p>Buscando platos...</p>
      </div>
      <div v-else-if="!searchPlatos && selectedTipoPlato === ''" class="empty-platos">
        <UtensilsCrossed :size="48" stroke-width="1.5" />
        <p>¿Qué se te antoja?</p>
        <span>Busca un plato o filtra por tipo</span>
      </div>
      <div v-else-if="platosResultados.length === 0" class="no-results"></div>
      <div v-else class="platos-grid">
        <div v-for="plato in platosResultados" :key="plato.id" class="plato-card" @click="router.push(`/user/menu/${plato.restaurante_id}`)">
          <div class="plato-img">
            <img v-if="plato.foto_url" :src="plato.foto_url" :alt="plato.nombre" />
            <div v-else class="plato-img-placeholder">🍽️</div>
            <span class="plato-tipo-badge">{{ plato.tipo === 'plato_suelto' ? '🥘 Plato' : '🥗 Almuerzo' }}</span>
          </div>
          <div class="restaurante-strip">
            <img v-if="plato.restaurantes?.foto_portada" :src="plato.restaurantes.foto_portada" class="rest-mini-img" />
            <div v-else class="rest-mini-placeholder">🍴</div>
            <span class="rest-mini-nombre">{{ plato.restaurantes?.nombre }}</span>
          </div>
          <div class="plato-info">
            <h3>{{ plato.nombre }}</h3>
            <p v-if="plato.descripcion" class="plato-desc">{{ plato.descripcion }}</p>
            <div v-if="plato.tipo === 'almuerzo_completo'" class="plato-detalles">
              <span v-if="plato.entrada_nombre">🍴 {{ plato.entrada_nombre }}</span>
              <span v-if="plato.principal_nombre">🍗 {{ plato.principal_nombre }}</span>
              <span v-if="plato.postre_nombre">🍰 {{ plato.postre_nombre }}</span>
            </div>
            <span class="plato-precio">Bs {{ plato.precio }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Componente RuletaPlatos -->
    <RuletaPlatos 
      :isOpen="mostrarRuleta" 
      @close="mostrarRuleta = false"
    />

    <Teleport to="body">
      <div v-if="showRuletaRestaurantes" class="ruleta-overlay" @click.self="showRuletaRestaurantes = false">
        <div class="ruleta-modal">
          <button class="ruleta-close" @click="showRuletaRestaurantes = false">×</button>
          <WheelSpinner />
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router' 
import { Search, UtensilsCrossed, Store } from 'lucide-vue-next'
import DashboardLayout from '../../components/DashboardLayout.vue'
import RestaurantCard from '../../components/RestaurantCard.vue'
import RuletaPlatos from '../../components/RuletaPlatos.vue'
import { useRestaurantesStore } from '../../stores/restaurantes.store.js'
import { useFavoritosStore } from '../../stores/favoritos.store.js'
import { almuerzosService } from '../../services/menu.service.js'

const router = useRouter()
const route = useRoute() 
const restaurantesStore = useRestaurantesStore()
const favoritosStore = useFavoritosStore()
const irARuleta = () => router.push('/user/ruleta')

// Estado de la ruleta
const showRuletaRestaurantes = ref(false)
// Estado de tabs
const activeTab = ref('restaurantes')

// Estado de RESTAURANTES
const searchRestaurantes = ref('')
const selectedCategories = ref([])

// Estado de PLATOS
const searchPlatos = ref('')
const selectedTipoPlato = ref('')
const platosResultados = ref([])
const buscandoPlatos = ref(false)
const mostrarRuleta = ref(false)

// Búsqueda y filtrado de RESTAURANTES
const filteredRestaurants = computed(() => {
  let resultado = restaurantesStore.restaurantes

  // Filtrar por búsqueda de nombre
  if (searchRestaurantes.value) {
    const query = searchRestaurantes.value.toLowerCase()
    resultado = resultado.filter(r => r.nombre?.toLowerCase().includes(query))
  }

  // Filtrar por categorías (OR - si selecciona múltiples)
  if (selectedCategories.value.length > 0) {
    resultado = resultado.filter(r => {
      const catNombre = r.category || ''
      return selectedCategories.value.includes(catNombre)
    })
  }

  return resultado
})

// Funciones de RESTAURANTES
const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
}

const clearRestaurantesFilters = () => {
  searchRestaurantes.value = ''
  selectedCategories.value = []
}

// Búsqueda de PLATOS
const buscarPlatos = async () => {
  if (!searchPlatos.value && selectedTipoPlato.value === '') {
    platosResultados.value = []
    return
  }

  try {
    buscandoPlatos.value = true
    const data = await almuerzosService.buscarPlatos(searchPlatos.value, selectedTipoPlato.value)
    platosResultados.value = data || []
  } catch (e) {
    console.error(e)
  } finally {
    buscandoPlatos.value = false
  }
}

// Watchers para búsqueda de PLATOS
watch([searchPlatos, selectedTipoPlato], () => {
  buscarPlatos()
})

const clearPlatosFilters = () => {
  searchPlatos.value = ''
  selectedTipoPlato.value = ''
  platosResultados.value = []
}

onMounted(() => {
  restaurantesStore.cargarRestaurantes()
  restaurantesStore.cargarCategorias()
  favoritosStore.cargarFavoritos()

  const categoria = route.query.categoria
  if (categoria) {
    selectedCategories.value = [categoria]
  }
})
</script>

<style scoped>
.page-header {
  margin-bottom: 32px;
}

.header-top {
  margin-bottom: 16px;
}

.page-header h1 {
  color: var(--plum, #481827);
  font-size: 2rem;
  margin: 0 0 8px 0;
  font-weight: 800;
}

.subtitle {
  color: var(--dusty-coral, #D893A1);
  font-size: 0.95rem;
  margin: 0 0 16px 0;
}

.btn-ruleta {
  padding: 10px 20px;
  background: linear-gradient(135deg, #8A9A8B 0%, #7D8F81 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(125, 143, 129, 0.3);
}

.btn-ruleta:hover {
  background: linear-gradient(135deg, #7D8F81 0%, #657869 100%);
  transform: translateY(-2px);
}
.ruleta-overlay {
  position: fixed;
  inset: 0;
  background: rgba(19, 2, 10, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.ruleta-modal {
  background: linear-gradient(135deg, #8B2A4E 0%, #6B1B3C 100%);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 600px;  /* 👈 más grande */
  min-height: 600px; /* 👈 altura mínima */
  position: relative;
  max-height: 95vh;
  overflow-y: auto;
}
.ruleta-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}
.ruleta-modal :deep(.wheel-container) {
  margin: 0;
  padding: 0;
}

.ruleta-modal :deep(.wheel) {
  width: 300px;
  height: 300px;
}

.ruleta-modal :deep(.wheel-center) {
  width: 90px;
  height: 90px;
}

.ruleta-modal :deep(.go-button) {
  width: 80px;
  height: 80px;
  font-size: 1.2rem;
}
/* TABS */
.tabs-container {
  margin-bottom: 32px;
}

.tabs-header {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #999;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.tab-btn:hover {
  color: var(--plum, #481827);
}

.tab-btn.active {
  color: var(--plum, #481827);
  border-bottom-color: var(--dusty-coral, #D893A1);
}

.tab-btn svg {
  stroke-width: 2.5;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* SEARCH BAR */
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 12px 16px;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  background: white;
  transition: border 0.2s;
}

.search-bar:focus-within {
  border-color: var(--dusty-coral, #D893A1);
}

.search-icon {
  color: #999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  color: #333;
}

.search-input::placeholder {
  color: #bbb;
}

/* CATEGORY FILTER */
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
  border: 1.5px solid var(--dusty-coral, #D893A1);
  background: transparent;
  color: var(--dusty-coral, #D893A1);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.category-chip:hover {
  background: rgba(216, 147, 161, 0.08);
}

.category-chip.active {
  background: var(--plum, #481827);
  color: white;
  border-color: var(--plum, #481827);
  box-shadow: 0 4px 12px rgba(72, 24, 39, 0.3);
}

/* TIPO FILTER */
.tipo-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tipo-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid var(--plum, #481827);
  background: transparent;
  color: var(--plum, #481827);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tipo-chip:hover {
  background: rgba(72, 24, 39, 0.05);
}

.tipo-chip.active {
  background: var(--plum, #481827);
  color: white;
  box-shadow: 0 4px 12px rgba(72, 24, 39, 0.3);
}

.btn-sorprendeme {
  background: linear-gradient(135deg, var(--dusty-coral, #D893A1) 0%, #e8a8b8 100%);
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(216, 147, 161, 0.25);
}

.btn-sorprendeme:hover {
  background: linear-gradient(135deg, #e8a8b8 0%, var(--dusty-coral, #D893A1) 100%);
  box-shadow: 0 6px 16px rgba(216, 147, 161, 0.35);
  transform: translateY(-2px);
}

/* GRIDS */
.restaurants-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, 1fr);
}

.platos-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

.empty-platos {
  padding: 60px 20px;
  text-align: center;
  color: var(--dusty-coral);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-platos p {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--plum);
  margin: 0;
}
.empty-platos span {
  font-size: 0.95rem;
  color: #999;
}
.restaurante-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #faf8f6;
  border-bottom: 1px solid #f0ede7;
}
.rest-mini-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}
.rest-mini-placeholder {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--plum);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}
.rest-mini-nombre {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--plum);
}

/* PLATO CARD */
.plato-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.plato-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.plato-img {
  position: relative;
  height: 160px;
  background: #f5f0eb;
  overflow: hidden;
}

.plato-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plato-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.plato-tipo-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(72, 24, 39, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.plato-info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plato-info h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--plum, #481827);
  font-weight: 700;
}

.plato-desc {
  margin: 0;
  font-size: 0.83rem;
  color: #888;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plato-detalles {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.8rem;
  color: #666;
}

.plato-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.plato-precio {
  font-size: 1rem;
  font-weight: 800;
  color: #C0392B;
}

.plato-restaurante {
  font-size: 0.8rem;
  color: #999;
  text-align: right;
}

/* NO RESULTS */
.no-results {
  grid-column: 1 / -1;
  padding: 60px 20px;
  text-align: center;
  color: var(--dusty-coral, #D893A1);
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.no-results p {
  font-size: 1.1rem;
  margin: 0;
}

.btn-clear {
  padding: 8px 16px;
  background: linear-gradient(135deg, #8A9A8B 0%, #7D8F81 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: linear-gradient(135deg, #7D8F81 0%, #657869 100%);
  transform: translateY(-2px);
}

.loading-state {
  padding: 40px;
  text-align: center;
  color: var(--dusty-coral, #D893A1);
  font-size: 1rem;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .restaurants-grid,
  .platos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .restaurants-grid,
  .platos-grid {
    grid-template-columns: 1fr;
  }

  .tabs-header {
    gap: 8px;
  }

  .tab-btn {
    padding: 12px 16px;
    font-size: 0.85rem;
  }

  .category-filter {
    gap: 8px;
  }

  .tipo-filter {
    gap: 8px;
  }
}
</style>