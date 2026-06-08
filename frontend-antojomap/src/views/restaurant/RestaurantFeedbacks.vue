<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Feedbacks</h1>
      <p class="subtitle">Lee las opiniones de tus clientes</p>
    </div>

    <div v-if="cargando" class="content-placeholder">
      <Star :size="48" stroke-width="1.5" />
      <p>Cargando feedbacks...</p>
    </div>

    <div v-else-if="feedbacks.length === 0" class="content-placeholder">
      <Star :size="48" stroke-width="1.5" />
      <p>Aún no tienes feedbacks. ¡Sigue mejorando!</p>
    </div>

    <div v-else class="feedbacks-container">
      <div class="stats-header">
        <div class="stat">
          <span class="label">Promedio</span>
          <span class="value">
            {{ promedio }} 
            <Star :size="24" color="#FFD700" />
          </span>
        </div>
        <div class="stat">
          <span class="label">Total Feedbacks</span>
          <span class="value">{{ feedbacks.length }}</span>
        </div>
      </div>

      <!-- ===== NUEVA SECCIÓN: BUSCADOR Y FILTROS ===== -->
      <div class="filters-section">
        <div class="search-wrapper">
          <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="search-input" 
            placeholder="Buscar por cliente o comentario..."
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">×</button>
        </div>

        <div class="rating-filter">
  <span class="filter-label">Ordenar:</span>
  <div class="rating-buttons">
    <button class="rating-btn" :class="{ active: sortOrder === 'reciente' }" @click="sortOrder = 'reciente'">Más reciente</button>
    <button class="rating-btn" :class="{ active: sortOrder === 'antiguo' }" @click="sortOrder = 'antiguo'">Más antiguo</button>
    <button class="rating-btn" :class="{ active: sortOrder === 'mayor' }" @click="sortOrder = 'mayor'">Mayor puntuación</button>
    <button class="rating-btn" :class="{ active: sortOrder === 'menor' }" @click="sortOrder = 'menor'">Menor puntuación</button>
  </div>
</div>

        <!-- Indicador de resultados encontrados -->
        <div v-if="filteredFeedbacks.length !== feedbacks.length" class="results-info">
          Mostrando {{ filteredFeedbacks.length }} de {{ feedbacks.length }} comentarios
          <button class="clear-filters-btn" @click="clearFilters">Limpiar filtros</button>
        </div>
      </div>

      <div class="feedbacks-list">
        <div v-for="feedback in filteredFeedbacks" :key="feedback.id" class="feedback-card">
          <div class="feedback-header">
            <div class="user-info">
              <div class="avatar">{{ feedback.usuario?.nombre?.charAt(0) || 'U' }}</div>
              <div>
                <p class="user-name">{{ feedback.usuario?.nombre || 'Usuario anónimo' }}</p>
                <p class="feedback-date">{{ formatDate(feedback.fecha) }}</p>
              </div>
            </div>
            <div class="rating-badge">
              <Star class="star-icon" :size="16" color="#FFD700" stroke-width="2.5" />
              <span class="score">{{ feedback.puntuacion }}/5</span>
            </div>
          </div>
          <p v-if="feedback.comentario" class="feedback-comment">{{ feedback.comentario }}</p>
          <p v-else class="feedback-comment empty">Sin comentarios adicionales</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Star } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { feedbackService } from '../../services/menu.service.js'

const feedbacks = ref([])
const cargando = ref(true)
const restaurante_id = localStorage.getItem('restaurante_id')

const sortOrder = ref('reciente') // 'reciente' | 'antiguo' | 'mayor' | 'menor'

// ===== NUEVOS ESTADOS PARA FILTROS =====
const searchQuery = ref('')
const selectedRating = ref(null) // null = todas, 5,4,3,2,1

// ===== PROPIEDAD COMPUTADA PARA FILTRAR =====
const filteredFeedbacks = computed(() => {
  let result = [...feedbacks.value]
  
  // 1. Filtrar por calificación (si hay una seleccionada)
  if (selectedRating.value !== null) {
    result = result.filter(feedback => feedback.puntuacion === selectedRating.value)
  }
  
  // 2. Filtrar por texto de búsqueda (cliente o comentario)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(feedback => {
      // Buscar en nombre del usuario
      const userName = feedback.usuario?.nombre?.toLowerCase() || ''
      if (userName.includes(query)) return true
      
      // Buscar en el comentario
      const comment = feedback.comentario?.toLowerCase() || ''
      if (comment.includes(query)) return true
      return false
    })
  }

  // 3. Ordenar resultados (Fuera del filtro para mayor eficiencia)
  result.sort((a, b) => {
    if (sortOrder.value === 'reciente') return new Date(b.fecha) - new Date(a.fecha)
    if (sortOrder.value === 'antiguo') return new Date(a.fecha) - new Date(b.fecha)
    if (sortOrder.value === 'mayor') return b.puntuacion - a.puntuacion
    if (sortOrder.value === 'menor') return a.puntuacion - b.puntuacion
    return 0
  })
  
  return result
})

// ===== FUNCIONES DE FILTROS =====
const clearFilters = () => {
  searchQuery.value = ''
  selectedRating.value = null
  sortOrder.value = 'reciente'
}

const promedio = computed(() => {
  if (feedbacks.value.length === 0) return 0
  const sum = feedbacks.value.reduce((acc, f) => acc + f.puntuacion, 0)
  return (sum / feedbacks.value.length).toFixed(1)
})

const formatDate = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    if (restaurante_id) {
      const data = await feedbackService.getFeedbacksRestaurante(restaurante_id)
      feedbacks.value = data || []
    }
  } catch (error) {
    console.error('Error cargando feedbacks:', error)
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 10px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0;
}

.content-placeholder {
  background: white;
  padding: 60px 20px;
  border-radius: 15px;
  text-align: center;
  color: var(--dusty-coral);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.content-placeholder p {
  font-size: 1.1rem;
  margin: 0;
  color: var(--dusty-coral);
}

.feedbacks-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat .label {
  color: #999;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.stat .value {
  color: var(--plum);
  font-size: 2rem;
  font-weight: 700;
  display: inline-flex;    /* Activa flexbox */
  align-items: center;     /* Centra verticalmente el número y el icono */
  gap: 8px;                /* Espacio entre el 5.0 y la estrella */
  font-weight: bold;
}


/* ===== NUEVOS ESTILOS PARA FILTROS ===== */
.filters-section {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 1.5px solid #E8E5DF;
  border-radius: 48px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #FEFEFE;
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  border-color: #481827;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
}

.search-clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.search-clear:hover {
  color: #666;
  background: #F0EDE7;
}

.rating-filter {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rating-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.rating-btn {
  padding: 8px 18px;
  border: 1.5px solid #E8E5DF;
  background: white;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.rating-btn:hover {
  border-color: #481827;
  background: #FFF5F0;
}

.rating-btn.active {
  background: linear-gradient(135deg, #481827 0%, #6B1B3C 100%);
  border-color: #481827;
  color: white;
}

.results-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #F0EDE7;
  font-size: 0.85rem;
  color: #888;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: #481827;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.2s;
}

.clear-filters-btn:hover {
  background: #FFF5F0;
}

/* ===== ESTILOS EXISTENTES DE FEEDBACKS ===== */
.feedbacks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #481827;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #481827, #FFB366);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.user-name {
  margin: 0;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.feedback-date {
  margin: 4px 0 0 0;
  font-size: 0.8rem;
  color: #999;
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: rgba(255, 107, 0, 0.1);
  border-radius: 20px;
  flex-shrink: 0;
}

.rating-badge .stars {
  font-size: 1rem;
}

.rating-badge .score {
  font-weight: 700;
  color: #481827;
  font-size: 0.9rem;
}

.feedback-comment {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 0.95rem;
}

.feedback-comment.empty {
  color: #999;
  font-style: italic;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .feedback-header {
    flex-direction: column;
  }

  .rating-badge {
    align-self: flex-start;
  }
  
  .filters-section {
    padding: 16px;
  }
  
  .rating-filter {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .rating-buttons {
    width: 100%;
    justify-content: flex-start;
  }
  
  .rating-btn {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
  
  .results-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>