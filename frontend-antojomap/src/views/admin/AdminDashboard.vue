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
          <button class="btn-pending" @click="$router.push('/admin/requests')">
            Ver solicitudes
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- Fila Inferior: 3 Columnas -->
      <div class="lower-grid">
        <!-- Top 5 Restaurantes -->
        <div class="section-card">
          <div class="section-header">
            <h2>Restaurantes destacados</h2>
            <span class="section-badge">Mejor valorados</span>
          </div>
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
        <div class="section-card">
          <div class="section-header">
            <h2>Solicitudes recientes</h2>
            <span class="section-badge">Últimas solicitudes</span>
          </div>
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

        <!-- Distribución por Categorías (barra mejorada) -->
        <div class="section-card">
          <div class="section-header">
            <h2>Distribución por categoría</h2>
            <span class="section-badge">Restaurantes por tipo</span>
          </div>
          <div class="categories-list">
            <div v-for="categoria in dashboard.distribucion_categorias" :key="categoria.nombre_categoria" class="category-item">
              <div class="category-header">
                <div class="category-name-wrapper">
                  <span class="category-bullet" :style="{ backgroundColor: getCategoryColor(categoria.nombre_categoria) }"></span>
                  <p class="category-name">{{ categoria.nombre_categoria }}</p>
                </div>
                <span class="category-count">{{ categoria.total }}</span>
              </div>
              <div class="category-bar-wrapper">
                <div class="category-bar-bg">
                  <div 
                    class="category-fill" 
                    :style="{ width: getBarWidth(categoria.total) + '%', backgroundColor: getCategoryColor(categoria.nombre_categoria) }"
                  ></div>
                </div>
                <span class="category-percent">{{ Math.round((categoria.total / getMaxTotal()) * 100) }}%</span>
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
  const max = getMaxTotal()
  return max > 0 ? (total / max) * 100 : 0
}

const getMaxTotal = () => {
  if (dashboard.value.distribucion_categorias.length === 0) return 0
  return Math.max(...dashboard.value.distribucion_categorias.map(c => c.total))
}

// Colores para cada categoría (puedes ampliarlos)
const getCategoryColor = (nombre) => {
  const colors = {
    'Pizza': '#E76F51',
    'Sushi': '#2A9D8F',
    'Pollo': '#E9C46A',
    'Postres': '#F4A261',
    'Pasta': '#E76F51',
    'Hamburguesas': '#D68C45',
    'Vegan': '#6A9C89',
    'Mariscos': '#264653',
    'Tacos': '#E76F51',
    'Ensaladas': '#6A9C89'
  }
  return colors[nombre] || '#D893A1'
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
/* ===== HEADER ===== */
.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-header h1 {
  color: #1E293B;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
}

.subtitle {
  color: #64748B;
  font-size: 0.9rem;
  margin: 0;
}

/* ===== ERROR BANNER ===== */
.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #FEF2F2;
  border-left: 4px solid #EF4444;
  border-radius: 16px;
  margin-bottom: 24px;
  color: #B91C1C;
}

.error-banner p {
  margin: 0;
  font-size: 0.85rem;
}

/* ===== SKELETON LOADING ===== */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.skeleton-card {
  height: 110px;
  background: #E2E8F0;
  border-radius: 24px;
}

.skeleton-full {
  background: #E2E8F0;
  border-radius: 24px;
}

/* ===== METRICS GRID ===== */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.metric-card {
  background: white;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #E2E8F0;
  transition: all 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.1);
  border-color: #CBD5E1;
}

.metric-icon {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon.users {
  background: #EFF6FF;
  color: #3B82F6;
}

.metric-icon.active {
  background: #ECFDF5;
  color: #10B981;
}

.metric-icon.restaurants {
  background: #FFF7ED;
  color: #F97316;
}

.metric-icon.reviews {
  background: #FEF2F2;
  color: #EF4444;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
}

/* ===== PENDING CARD ===== */
.pending-card {
  background: white;
  border-radius: 24px;
  padding: 20px 28px;
  margin-bottom: 28px;
  box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #E2E8F0;
  transition: all 0.2s;
}

.pending-card.has-pending {
  background: #FFFBEB;
  border-left: 6px solid #F59E0B;
}

.pending-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pending-icon {
  width: 56px;
  height: 56px;
  background: #FEF3C7;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D97706;
}

.pending-info {
  flex: 1;
}

.pending-label {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0;
}

.pending-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #D97706;
  margin-top: 4px;
}

/* Botón "Ver solicitudes" */
.btn-pending {
  background: #D893A1;
  color: white;
  border: none;
  border-radius: 40px;
  padding: 10px 28px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-pending:hover {
  background: #C17A8B;
  transform: translateY(-1px);
}

.btn-arrow {
  transition: transform 0.2s;
}

.btn-pending:hover .btn-arrow {
  transform: translateX(4px);
}

/* ===== LOWER GRID ===== */
.lower-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 24px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.section-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.section-header {
  padding: 18px 24px 12px;
  border-bottom: 1px solid #F1F5F9;
}

.section-header h2 {
  font-size: 1rem;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 4px;
}

.section-badge {
  font-size: 0.65rem;
  color: #94A3B8;
  letter-spacing: 0.3px;
}

/* ===== RANKING LIST ===== */
.ranking-list {
  padding: 8px 0;
}

.ranking-item {
  display: flex;
  gap: 16px;
  padding: 12px 20px;
  align-items: center;
  transition: background 0.2s;
  border-bottom: 1px solid #F8FAFC;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item:hover {
  background: #F8FAFC;
}

.ranking-position {
  width: 32px;
  height: 32px;
  background: #F1F5F9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  color: #334155;
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: #1E293B;
  margin-bottom: 6px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  font-size: 0.75rem;
  color: #E2E8F0;
}

.star.filled {
  color: #FBBF24;
}

.rating-value {
  margin-left: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #FBBF24;
}

/* ===== REQUESTS LIST ===== */
.requests-list {
  padding: 8px 0;
}

.request-item {
  padding: 14px 20px;
  border-left: 3px solid #D893A1;
  margin-bottom: 1px;
  transition: background 0.2s;
}

.request-item:hover {
  background: #FAFAFA;
}

.request-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}

.request-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: #1F2937;
}

.status-badge {
  font-size: 0.65rem;
  padding: 2px 10px;
  border-radius: 40px;
  font-weight: 600;
}

.status-badge.pendiente {
  background: #FEF3C7;
  color: #B45309;
}

.status-badge.aprobado {
  background: #D1FAE5;
  color: #065F46;
}

.status-badge.rechazado {
  background: #FEE2E2;
  color: #991B1B;
}

.request-email {
  font-size: 0.7rem;
  color: #6B7280;
  margin: 0;
}

/* ===== CATEGORIES LIST ===== */
.categories-list {
  padding: 16px 24px;
}

.category-item {
  margin-bottom: 20px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.category-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-bullet {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.category-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.category-count {
  font-weight: 700;
  font-size: 0.85rem;
  color: #D893A1;
}

.category-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.category-bar-bg {
  flex: 1;
  height: 6px;
  background: #F1F5F9;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.category-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 12px;
  transition: width 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.category-percent {
  font-size: 0.7rem;
  font-weight: 500;
  color: #94A3B8;
  min-width: 38px;
  text-align: right;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  padding: 48px 20px;
  text-align: center;
  color: #94A3B8;
  font-size: 0.8rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1100px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .lower-grid {
    grid-template-columns: 1fr;
  }
  .skeleton-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .pending-content {
    flex-direction: column;
    text-align: center;
  }
  .btn-pending {
    width: 100%;
    justify-content: center;
  }
  .request-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>