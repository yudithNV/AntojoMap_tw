<template>
  <DashboardLayout>
    <div class="dashboard-header">
      <h1>Dashboard de Administrador</h1>
      <p class="subtitle">Bienvenido al panel de control de AntojoMap</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-banner">
      <AlertCircle :size="20" />
      <p>{{ error }}</p>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="cargando" class="skeleton-container">
      <div class="skeleton-row">
        <div v-for="i in 4" :key="'metric-' + i" class="skeleton-card"></div>
      </div>
      <div class="skeleton-row" style="margin-top: 24px;">
        <div class="skeleton-full" style="height: 200px;"></div>
      </div>
      <div class="skeleton-row" style="margin-top: 24px;">
        <div v-for="i in 3" :key="'section-' + i" class="skeleton-full" style="height: 300px; flex: 1;"></div>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Fila Superior: 4 Cards de Métricas -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon users">
            <Users :size="24" stroke-width="2" />
          </div>
          <div class="metric-info">
            <p class="metric-label">Usuarios Totales</p>
            <p class="metric-value">{{ dashboard.usuarios_totales }}</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon active">
            <CheckCircle :size="24" stroke-width="2" />
          </div>
          <div class="metric-info">
            <p class="metric-label">Usuarios Activos</p>
            <p class="metric-value">{{ dashboard.usuarios_activos }}</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon restaurants">
            <Store :size="24" stroke-width="2" />
          </div>
          <div class="metric-info">
            <p class="metric-label">Restaurantes</p>
            <p class="metric-value">{{ dashboard.restaurantes_registrados }}</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon reviews">
            <Star :size="24" stroke-width="2" />
          </div>
          <div class="metric-info">
            <p class="metric-label">Reviews Totales</p>
            <p class="metric-value">{{ dashboard.reviews_totales }}</p>
          </div>
        </div>
      </div>

      <!-- Solicitudes Pendientes Card -->
      <div class="pending-card" :class="{ 'has-pending': dashboard.solicitudes_pendientes > 0 }">
        <div class="pending-content">
          <div class="pending-icon">
            <AlertCircle :size="32" stroke-width="2" />
          </div>
          <div class="pending-info">
            <p class="pending-label">Solicitudes Pendientes</p>
            <p class="pending-number">{{ dashboard.solicitudes_pendientes }}</p>
          </div>
          <button class="btn-pending" @click="$router.push('/admin/solicitudes')">
            Ver solicitudes
          </button>
        </div>
      </div>

      <!-- Fila Inferior: 3 Columnas -->
      <div class="lower-grid">
        <!-- Top 5 Restaurantes -->
        <div class="section-card top-restaurants">
          <h2>🏆 Top 5 Restaurantes</h2>
          <div class="ranking-list">
            <div v-for="(restaurante, index) in dashboard.top_5_restaurantes" :key="restaurante.id" class="ranking-item">
              <div class="ranking-position">{{ index + 1 }}</div>
              <div class="ranking-info">
                <p class="ranking-name">{{ restaurante.nombre }}</p>
                <div class="stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(restaurante.promedio) }">★</span>
                  <span class="rating-value">{{ restaurante.promedio }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Solicitudes Recientes -->
        <div class="section-card recent-requests">
          <h2>📋 Solicitudes Recientes</h2>
          <div class="requests-list">
            <div v-for="solicitud in dashboard.solicitudes_recientes" :key="solicitud.id" class="request-item">
              <div class="request-header">
                <p class="request-name">{{ solicitud.nombre_restaurante }}</p>
                <span class="status-badge" :class="solicitud.estado.toLowerCase()">
                  {{ solicitud.estado }}
                </span>
              </div>
              <p class="request-email">{{ solicitud.email }}</p>
              
            </div>
            <div v-if="dashboard.solicitudes_recientes.length === 0" class="empty-state">
              <p>No hay solicitudes recientes</p>
            </div>
          </div>
        </div>

        <!-- Distribución por Categorías -->
        <div class="section-card categories">
          <h2>📊 Categorías</h2>
          <div class="categories-list">
            <div v-for="categoria in dashboard.distribucion_categorias" :key="categoria.nombre_categoria" class="category-item">
              <div class="category-header">
                <p class="category-name">{{ categoria.nombre_categoria }}</p>
                <span class="category-count">{{ categoria.total }}</span>
              </div>
              <div class="category-bar">
                <div 
                  class="category-fill" 
                  :style="{ width: getBarWidth(categoria.total) + '%' }"
                ></div>
              </div>
            </div>
            <div v-if="dashboard.distribucion_categorias.length === 0" class="empty-state">
              <p>Sin datos de categorías</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Users, Store, Star, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { api } from '../../services/api.js'

const router = useRouter()

const dashboard = ref({
  usuarios_totales: 0,
  usuarios_activos: 0,
  restaurantes_registrados: 0,
  reviews_totales: 0,
  solicitudes_pendientes: 0,
  top_5_restaurantes: [],
  solicitudes_recientes: [],
  distribucion_categorias: []
})

const cargando = ref(true)
const error = ref('')

const getBarWidth = (total) => {
  if (dashboard.value.distribucion_categorias.length === 0) return 0
  const max = Math.max(...dashboard.value.distribucion_categorias.map(c => c.total))
  return max > 0 ? (total / max) * 100 : 0
}

onMounted(async () => {
  try {
    cargando.value = true
    error.value = ''
    
    const response = await api.get('/reportes/dashboard-admin')
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
/* Header */
.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h1 {
  color: var(--plum, #481827);
  font-size: 2rem;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.subtitle {
  color: #888;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
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
  height: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-full {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon.users {
  background: rgba(72, 24, 39, 0.1);
  color: var(--plum, #481827);
}

.metric-icon.active {
  background: rgba(72, 24, 39, 0.1);
  color: var(--plum, #481827);
}

.metric-icon.restaurants {
  background: rgba(216, 147, 161, 0.1);
  color: var(--dusty-coral, #D893A1);
}

.metric-icon.reviews {
  background: rgba(72, 24, 39, 0.1);
  color: var(--plum, #481827);
}

.metric-label {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
}

.metric-value {
  margin: 6px 0 0 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--plum, #481827);
}

/* Pending Card */
.pending-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 2px solid #f0f0f0;
  margin-bottom: 24px;
  transition: all 0.3s;
}

.pending-card.has-pending {
  border-color: var(--dusty-coral, #D893A1);
  background: rgba(216, 147, 161, 0.05);
}

.pending-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pending-icon {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(216, 147, 161, 0.1);
  color: var(--dusty-coral, #D893A1);
  flex-shrink: 0;
}

.pending-info {
  flex: 1;
}

.pending-label {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.pending-number {
  margin: 6px 0 0 0;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--dusty-coral, #D893A1);
}

.btn-pending {
  padding: 10px 20px;
  background: var(--dusty-coral, #D893A1);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-pending:hover {
  background: #c17a8b;
  transform: translateY(-2px);
}

/* Lower Grid */
.lower-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.section-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.section-card h2 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: var(--plum, #481827);
  font-weight: 700;
}

/* Ranking List */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.2s;
}

.ranking-item:hover {
  background: #f0f0f0;
}

.ranking-position {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--plum, #481827);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  font-size: 0.9rem;
  color: #ddd;
}

.star.filled {
  color: var(--dusty-coral, #D893A1);
}

.rating-value {
  margin-left: 6px;
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

/* Requests List */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-item {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid var(--dusty-coral, #D893A1);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.request-name {
  margin: 0;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.status-badge.pendiente {
  background: rgba(216, 147, 161, 0.2);
  color: var(--dusty-coral, #D893A1);
}

.status-badge.aprobado {
  background: rgba(72, 24, 39, 0.1);
  color: var(--plum, #481827);
}

.status-badge.rechazado {
  background: #ffe0e0;
  color: #c00;
}

.request-email {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: #666;
}

.btn-review {
  width: 100%;
  padding: 8px 12px;
  background: var(--plum, #481827);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-review:hover {
  background: #6b2540;
}

/* Categories */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.category-item:last-child {
  border-bottom: none;
}

.category-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.category-name {
  margin: 0;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.category-count {
  font-weight: 700;
  color: var(--dusty-coral, #D893A1);
  font-size: 0.95rem;
}

.category-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--dusty-coral, #D893A1), var(--plum, #481827));
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Empty State */
.empty-state {
  padding: 32px 16px;
  text-align: center;
  color: #999;
  font-size: 0.95rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.empty-state p {
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .lower-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.6rem;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pending-content {
    flex-direction: column;
    text-align: center;
  }

  .btn-pending {
    width: 100%;
  }
}
</style>
