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
          <span class="value">{{ promedio }} ⭐</span>
        </div>
        <div class="stat">
          <span class="label">Total Feedbacks</span>
          <span class="value">{{ feedbacks.length }}</span>
        </div>
      </div>

      <div class="feedbacks-list">
        <div v-for="feedback in feedbacks" :key="feedback.id" class="feedback-card">
          <div class="feedback-header">
            <div class="user-info">
              <div class="avatar">{{ feedback.usuario?.nombre?.charAt(0) || 'U' }}</div>
              <div>
                <p class="user-name">{{ feedback.usuario?.nombre || 'Usuario anónimo' }}</p>
                <p class="feedback-date">{{ formatDate(feedback.creado_en) }}</p>
              </div>
            </div>
            <div class="rating-badge">
              <span class="stars">⭐</span>
              <span class="score">{{ feedback.calificacion }}/5</span>
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

const promedio = computed(() => {
  if (feedbacks.value.length === 0) return 0
  const sum = feedbacks.value.reduce((acc, f) => acc + f.calificacion, 0)
  return (sum / feedbacks.value.length).toFixed(1)
})

const formatDate = (fecha) => {
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
}

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
  border-left: 4px solid #FF6B00;
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
  background: linear-gradient(135deg, #FF6B00, #FFB366);
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
  color: #FF6B00;
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

@media (max-width: 768px) {
  .feedback-header {
    flex-direction: column;
  }

  .rating-badge {
    align-self: flex-start;
  }
}
</style>
