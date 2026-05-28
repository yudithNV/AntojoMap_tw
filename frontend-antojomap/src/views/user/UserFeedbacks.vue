<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Mis Feedbacks</h1>
      <p class="subtitle">Gestiona las reseñas y calificaciones que has dejado en tus restaurantes favoritos</p>
    </div>

    <!-- Estado vacío -->
    <div v-if="!cargando && feedbacks.length === 0" class="empty-state">
      <div class="empty-icon">
        <Star :size="48" stroke-width="1.5" />
      </div>
      <p class="empty-title">Aún no has escrito ningún feedback</p>
      <p class="empty-text">Explora restaurantes y comparte tu experiencia</p>
      <router-link to="/user/feed" class="empty-btn">Explorar restaurantes</router-link>
    </div>

    <!-- Grid de feedbacks -->
    <div v-else-if="!cargando && feedbacks.length > 0" class="feedbacks-grid">
      <div v-for="feedback in feedbacks" :key="feedback.id" class="feedback-card">
        <div class="card-image">
          <img 
            v-if="feedback.restaurante?.foto_portada" 
            :src="feedback.restaurante.foto_portada" 
            :alt="feedback.restaurante?.nombre || 'Restaurante'"
          />
          <div v-else class="image-placeholder">
            <Store :size="32" stroke-width="1.5" />
          </div>
        </div>

        <div class="card-content">
          <div class="card-header">
            <h3 class="restaurant-name">{{ feedback.restaurante?.nombre || 'Restaurante' }}</h3>
            <div class="stars">
              <span 
                v-for="n in 5" 
                :key="n" 
                class="star"
                :class="{ active: n <= feedback.puntuacion }"
              >★</span>
            </div>
          </div>

          <p class="comment">{{ feedback.comentario || 'Sin comentario adicional' }}</p>

          <div class="card-footer">
            <span class="date">{{ formatDate(feedback.fecha) }}</span>
            <div class="actions">
              <button class="action-btn edit" @click="handleEditFeedback(feedback.id)">
                <Edit3 :size="16" />
                Editar
              </button>
              <button class="action-btn delete" @click="handleDeleteFeedback(feedback.id)">
                <Trash2 :size="16" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando tus reseñas...</p>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Star, Store, Edit3, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth.store.js'
import { api } from '../../services/api.js'

// ========== ESTADO ==========
const feedbacks = ref([])
const cargando = ref(true)
const error = ref(null)

// ========== AUTH STORE ==========
const authStore = useAuthStore()
const userId = authStore.userId

// ========== FUNCIONES ==========
const formatDate = (fecha) => {
  if (!fecha) return ''
  try {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return ''
  }
}

const cargarFeedbacks = async () => {
  if (!userId) {
    console.warn('Usuario no autenticado')
    cargando.value = false
    return
  }

  try {
    cargando.value = true
    error.value = null
    
    // Usar el endpoint existente en el backend
    const response = await api.get('/feedbacks/usuario/mis-reviews')
    feedbacks.value = response || []
    
  } catch (err) {
    console.error('Error cargando feedbacks:', err)
    error.value = err.message || 'Error al cargar tus reseñas'
  } finally {
    cargando.value = false
  }
}

const handleEditFeedback = (id) => {
  console.log('Editar feedback:', id)
  alert('Funcionalidad de edición en desarrollo')
}

const handleDeleteFeedback = (id) => {
  console.log('Eliminar feedback:', id)
  alert('Funcionalidad de eliminación en desarrollo')
}

// ========== LIFECYCLE ==========
onMounted(() => {
  cargarFeedbacks()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--plum, #481827);
  font-size: 2rem;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--dusty-coral, #C64445);
  font-size: 0.95rem;
  margin: 0;
}

.empty-state {
  background: white;
  border-radius: 24px;
  padding: 60px 32px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(72, 24, 39, 0.08);
  border-radius: 50%;
  color: var(--plum, #481827);
  margin-bottom: 20px;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--plum, #481827);
  margin-bottom: 8px;
}

.empty-text {
  color: #888;
  margin-bottom: 24px;
}

.empty-btn {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(135deg, #7a2b45, #5c1f32);
  color: white;
  text-decoration: none;
  border-radius: 40px;
  font-weight: 600;
  transition: all 0.2s;
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(122, 43, 69, 0.3);
}

.feedbacks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.feedback-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.feedback-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-image {
  height: 140px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f0eb, #ebe2cf);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--plum, #481827);
  opacity: 0.5;
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.restaurant-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--plum, #481827);
  margin: 0;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1rem;
  color: #ddd;
}

.star.active {
  color: #FF6B00;
}

.comment {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-style: italic;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0ede7;
}

.date {
  font-size: 0.75rem;
  color: #999;
}

.actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: transparent;
}

.action-btn.edit {
  color: #FF6B00;
}

.action-btn.edit:hover {
  background: rgba(255, 107, 0, 0.1);
}

.action-btn.delete {
  color: #dc2626;
}

.action-btn.delete:hover {
  background: rgba(220, 38, 38, 0.1);
}

.loading-state {
  background: white;
  border-radius: 24px;
  padding: 60px 32px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(72, 24, 39, 0.1);
  border-top-color: var(--plum, #481827);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #888;
}

@media (max-width: 768px) {
  .feedbacks-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>