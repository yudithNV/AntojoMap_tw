<template>
  <div>
    <BlockedRestaurantModal ref="blockedModal" />
    
    <DashboardLayout>
      <div class="dashboard-header">
        <h1>Resumen del Restaurante</h1>
        <p class="subtitle">Bienvenido a tu panel de control</p>
      </div>

      <!-- Error Banner -->
      <div v-if="error" class="error-banner">
        <AlertCircle :size="20" />
        <p>{{ error }}</p>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="cargando" class="skeleton-container">
        <div class="skeleton-row">
          <div v-for="i in 3" :key="'card-' + i" class="skeleton-card"></div>
        </div>
        <div class="skeleton-row" style="margin-top: 24px;">
          <div class="skeleton-full" style="height: 280px;"></div>
        </div>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Metrics Cards -->
        <div class="dashboard-grid">
          <!-- Calificación Promedio -->
          <div class="stat-card">
            <div class="stat-icon rating">
              <Star :size="32" stroke-width="2" />
            </div>
            <div class="stat-content">
              <h3>Calificación Promedio</h3>
              <div class="stars-display">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(parseFloat(dashboard.calificacion_promedio)) }">★</span>
              </div>
              <p class="stat-number">{{ dashboard.calificacion_promedio }}</p>
            </div>
          </div>

          <!-- Total Reseñas -->
          <div class="stat-card">
            <div class="stat-icon reviews">
              <MessageSquare :size="32" stroke-width="2" />
            </div>
            <div class="stat-content">
              <h3>Total Reseñas</h3>
              <p class="stat-number">{{ dashboard.total_reseñas }}</p>
            </div>
          </div>

          <!-- Total Platos -->
          <div class="stat-card">
            <div class="stat-icon dishes">
              <UtensilsCrossed :size="32" stroke-width="2" />
            </div>
            <div class="stat-content">
              <h3>Platos Publicados</h3>
              <p class="stat-number">{{ dashboard.total_platos }}</p>
            </div>
          </div>
        </div>

        <!-- Profile Completion Card -->
        <div class="profile-card">
          <div class="profile-header">
            <h2>📋 Estado del Perfil</h2>
            <p class="profile-description">Completa tu perfil para aparecer mejor en los resultados</p>
          </div>

          <div class="checklist">
            <div class="checklist-item" :class="{ completed: dashboard.perfil_completo.tiene_foto }">
              <div class="checklist-icon">
                <CheckCircle2 v-if="dashboard.perfil_completo.tiene_foto" :size="20" class="icon-check" />
                <X v-else :size="20" class="icon-x" />
              </div>
              <span>Foto del Establecimiento</span>
            </div>

            <div class="checklist-item" :class="{ completed: dashboard.perfil_completo.tiene_direccion }">
              <div class="checklist-icon">
                <CheckCircle2 v-if="dashboard.perfil_completo.tiene_direccion" :size="20" class="icon-check" />
                <X v-else :size="20" class="icon-x" />
              </div>
              <span>Dirección</span>
            </div>

            <div class="checklist-item" :class="{ completed: dashboard.perfil_completo.tiene_horarios }">
              <div class="checklist-icon">
                <CheckCircle2 v-if="dashboard.perfil_completo.tiene_horarios" :size="20" class="icon-check" />
                <X v-else :size="20" class="icon-x" />
              </div>
              <span>Horarios</span>
            </div>

            <div class="checklist-item" :class="{ completed: dashboard.perfil_completo.tiene_categoria }">
              <div class="checklist-icon">
                <CheckCircle2 v-if="dashboard.perfil_completo.tiene_categoria" :size="20" class="icon-check" />
                <X v-else :size="20" class="icon-x" />
              </div>
              <span>Categoría</span>
            </div>

            <div class="checklist-item" :class="{ completed: dashboard.perfil_completo.tiene_descripcion }">
              <div class="checklist-icon">
                <CheckCircle2 v-if="dashboard.perfil_completo.tiene_descripcion" :size="20" class="icon-check" />
                <X v-else :size="20" class="icon-x" />
              </div>
              <span>Descripción</span>
            </div>
          </div>

          <!-- Incomplete Profile Alert -->
          <div v-if="!perfilCompleto" class="profile-alert">
            <AlertTriangle :size="20" />
            <p>Completa tu perfil para aparecer mejor en los resultados</p>
          </div>
        </div>
      </template>
    </DashboardLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import BlockedRestaurantModal from '../../components/BlockedRestaurantModal.vue'
import { Star, MessageSquare, UtensilsCrossed, AlertCircle, CheckCircle2, X, AlertTriangle } from 'lucide-vue-next'
import { api } from '../../services/api.js'

const blockedModal = ref(null)
const cargando = ref(true)
const error = ref('')

const dashboard = ref({
  calificacion_promedio: '0.00',
  total_reseñas: 0,
  total_platos: 0,
  total_favoritos: 0,
  perfil_completo: {
    tiene_foto: false,
    tiene_direccion: false,
    tiene_horarios: false,
    tiene_categoria: false,
    tiene_descripcion: false
  }
})

const perfilCompleto = computed(() => {
  const perfil = dashboard.value.perfil_completo
  return perfil.tiene_foto && perfil.tiene_direccion && perfil.tiene_horarios && 
         perfil.tiene_categoria && perfil.tiene_descripcion
})

onMounted(async () => {
  try {
    if (blockedModal.value) {
      blockedModal.value.checkStatus()
    }

    cargando.value = true
    error.value = ''

    const restaurantId = localStorage.getItem('restaurante_id')
    if (!restaurantId) {
      error.value = 'No se encontró el ID del restaurante'
      cargando.value = false
      return
    }

    const response = await api.get(`/reportes/dashboard-restaurante/${restaurantId}`)
    dashboard.value = response

  } catch (err) {
    console.error('Error cargando dashboard:', err)
    error.value = 'Error al cargar el dashboard. Por favor, intenta nuevamente.'
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h1 {
  color: var(--plum);
  font-size: 2.2rem;
  margin: 0 0 10px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 1rem;
  margin: 0;
}

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c00;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.error-banner p {
  margin: 0;
}

/* Skeleton Loading */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.skeleton-card {
  height: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

.skeleton-full {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f5f5f5;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
  font-weight: 600;
}

.stat-icon.rating {
  background: linear-gradient(135deg, var(--plum) 0%, #6b3a4f 100%);
}

.stat-icon.reviews {
  background: linear-gradient(135deg, var(--dusty-coral) 0%, #c97a88 100%);
}

.stat-icon.dishes {
  background: linear-gradient(135deg, #888 0%, #666 100%);
}

.stat-content h3 {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  color: var(--plum);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.stars-display {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 8px;
}

.stars-display .star {
  font-size: 1.2rem;
  color: #ddd;
  cursor: default;
}

.stars-display .star.filled {
  color: #ffc107;
}

/* Profile Completion Card */
.profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f5f5f5;
}

.profile-header {
  margin-bottom: 24px;
}

.profile-header h2 {
  color: var(--plum);
  font-size: 1.4rem;
  margin: 0 0 8px 0;
}

.profile-description {
  color: #888;
  font-size: 0.95rem;
  margin: 0;
}

.checklist {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9f9f9;
  border: 1px solid #eee;
  transition: all 0.2s;
}

.checklist-item.completed {
  background: rgba(72, 24, 39, 0.05);
  border-color: rgba(72, 24, 39, 0.2);
}

.checklist-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checklist-item .icon-check {
  color: #4caf50;
  stroke-width: 3;
}

.checklist-item .icon-x {
  color: #f44336;
  stroke-width: 2.5;
}

.checklist-item span {
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Profile Alert */
.profile-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(216, 147, 161, 0.1);
  border: 1px solid var(--dusty-coral);
  border-radius: 8px;
  color: var(--dusty-coral);
}

.profile-alert svg {
  flex-shrink: 0;
}

.profile-alert p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
