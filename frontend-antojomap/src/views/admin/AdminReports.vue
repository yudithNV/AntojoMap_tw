<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Reportes</h1>
      <p class="subtitle">Analiza el desempeño de la plataforma</p>
    </div>

    <div v-if="cargando" class="content-placeholder">
      <BarChart3 :size="48" stroke-width="1.5" />
      <p>Cargando reportes...</p>
    </div>

    <div v-else class="reportes-grid">
      <!-- Gráfico de Solicitudes por Estado -->
      <div class="reporte-card">
        <h3>Solicitudes por Estado</h3>
        <div class="stats-grid">
          <div class="stat-box pendiente">
            <span class="label">Pendientes</span>
            <span class="number">{{ solicitudesPorEstado.PENDIENTE || 0 }}</span>
          </div>
          <div class="stat-box aprobado">
            <span class="label">Aprobadas</span>
            <span class="number">{{ solicitudesPorEstado.APROBADO || 0 }}</span>
          </div>
          <div class="stat-box rechazado">
            <span class="label">Rechazadas</span>
            <span class="number">{{ solicitudesPorEstado.RECHAZADO || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Top Restaurantes -->
      <div class="reporte-card">
        <h3>Top Restaurantes por Calificación</h3>
        <div v-if="topRestaurantes.length === 0" class="empty-list">
          <p>No hay restaurantes con calificaciones</p>
        </div>
        <div v-else class="top-list">
          <div v-for="(rest, index) in topRestaurantes.slice(0, 5)" :key="rest.id" class="top-item">
            <span class="ranking">{{ index + 1 }}</span>
            <div class="info">
              <p class="name">{{ rest.nombre }}</p>
              <p class="stats">{{ rest.total_feedbacks }} valoraciones</p>
            </div>
            <div class="rating">
              <span class="stars">⭐</span>
              <span class="score">{{ rest.promedio_calificacion }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribución por Categoría -->
      <div class="reporte-card">
        <h3>Distribución de Restaurantes</h3>
        <div v-if="distribucion.length === 0" class="empty-list">
          <p>No hay datos de categorías</p>
        </div>
        <div v-else class="distribution-list">
          <div v-for="cat in distribucion" :key="cat.categoria" class="dist-item">
            <span class="category">{{ cat.categoria }}</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getWidth(cat.cantidad) + '%' }"></div>
            </div>
            <span class="count">{{ cat.cantidad }}</span>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../components/DashboardLayout.vue'
import { BarChart3 } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { reportesService } from '../../services/menu.service.js'

const cargando = ref(true)
const solicitudesPorEstado = ref({})
const topRestaurantes = ref([])
const distribucion = ref([])

const getWidth = (cantidad) => {
  const max = Math.max(...distribucion.value.map(d => d.cantidad), 1)
  return (cantidad / max) * 100
}

onMounted(async () => {
  try {
    const [solicitudes, top, dist] = await Promise.all([
      reportesService.getSolicitudesPorEstado(),
      reportesService.getTopRestaurantes(10),
      reportesService.getDistribucionCategorias()
    ])
    
    solicitudesPorEstado.value = solicitudes
    topRestaurantes.value = top
    distribucion.value = dist
  } catch (error) {
    console.error('Error cargando reportes:', error)
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

.reportes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.reporte-card {
  background: white;
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.reporte-card h3 {
  margin: 0 0 20px 0;
  color: var(--plum);
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-box {
  padding: 16px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-box.pendiente {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #FFC107;
}

.stat-box.aprobado {
  background-color: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
}

.stat-box.rechazado {
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #F44336;
}

.stat-box .label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-box .number {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
}

.empty-list {
  text-align: center;
  padding: 32px 16px;
  color: #999;
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
}

.ranking {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FF6B00;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  flex-shrink: 0;
}

.top-item .info {
  flex: 1;
}

.top-item .name {
  margin: 0;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.top-item .stats {
  margin: 4px 0 0 0;
  font-size: 0.8rem;
  color: #999;
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating .stars {
  font-size: 1.2rem;
}

.rating .score {
  font-weight: 700;
  color: #FF6B00;
  min-width: 32px;
  text-align: right;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dist-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dist-item .category {
  width: 120px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.progress-bar {
  flex: 1;
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B00, #FFB366);
  transition: width 0.3s ease;
}

.dist-item .count {
  width: 40px;
  text-align: right;
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .reportes-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
