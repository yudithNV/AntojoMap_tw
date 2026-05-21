<template>
  <DashboardLayout>
    <div class="dashboard-header">
      <h1>Dashboard de Administrador</h1>
      <p class="subtitle">Bienvenido al panel de control de AntojoMap</p>
    </div>

    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <Users :size="28" stroke-width="2" />
        </div>
        <div class="stat-content">
          <h3>Usuarios Activos</h3>
          <p class="stat-number">{{ estadisticas.total_usuarios }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Store :size="28" stroke-width="2" />
        </div>
        <div class="stat-content">
          <h3>Restaurantes</h3>
          <p class="stat-number">{{ estadisticas.total_restaurantes }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <ClipboardList :size="28" stroke-width="2" />
        </div>
        <div class="stat-content">
          <h3>Solicitudes Pendientes</h3>
          <p class="stat-number">{{ estadisticas.solicitudes_pendientes }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <TrendingUp :size="28" stroke-width="2" />
        </div>
        <div class="stat-content">
          <h3>Total de Feedbacks</h3>
          <p class="stat-number">{{ estadisticas.total_feedbacks }}</p>
        </div>
      </div>
    </div>

    <section class="recent-section">
      <h2><BarChart3 :size="24" stroke-width="2" /> Actividad Reciente</h2>
      <div v-if="cargando" class="activity-placeholder">
        <p>Cargando actividades...</p>
      </div>
      <div v-else-if="actividades.length === 0" class="activity-placeholder">
        <p>No hay actividades recientes</p>
      </div>
      <div v-else class="activity-list">
        <div v-for="actividad in actividades.slice(0, 5)" :key="actividad.id" class="activity-item">
          <div class="activity-icon">
            <Star :size="16" stroke-width="2" />
          </div>
          <div class="activity-info">
            <p class="activity-text">
              <strong>{{ actividad.usuario.nombre }}</strong> calificó a 
              <strong>{{ actividad.restaurante.nombre }}</strong> con 
              <strong>{{ actividad.calificacion }} ⭐</strong>
            </p>
            <p class="activity-date">{{ formatDate(actividad.creado_en) }}</p>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Users, Store, ClipboardList, TrendingUp, BarChart3, Star } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { reportesService } from '../../services/menu.service.js'

const estadisticas = ref({
  total_usuarios: 0,
  total_restaurantes: 0,
  total_feedbacks: 0,
  solicitudes_pendientes: 0
})

const actividades = ref([])
const cargando = ref(true)

const formatDate = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  try {
    const [stats, acts] = await Promise.all([
      reportesService.getEstadisticas(),
      reportesService.getActividadUsuarios(5)
    ])
    
    estadisticas.value = stats
    actividades.value = acts || []
  } catch (error) {
    console.error('Error cargando dashboard:', error)
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
  color: var(--color-plum);
  font-size: 2rem;
  margin: 0 0 12px 0;
  font-weight: 700;
  font-family: var(--font-family-display);
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--color-white);
  padding: 24px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  border: 1px solid var(--color-gray-100);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-gray-200);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(171, 72, 45, 0.08);
  border-radius: var(--radius-md);
  flex-shrink: 0;
  color: var(--color-blood-orange);
}

.stat-content h3 {
  color: var(--color-gray-500);
  font-size: 0.85rem;
  margin: 0 0 8px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  color: var(--color-plum);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.recent-section {
  background: var(--color-white);
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-100);
}

.recent-section h2 {
  color: var(--color-plum);
  margin: 0 0 24px 0;
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-family-display);
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-placeholder {
  padding: 48px 24px;
  text-align: center;
  color: var(--color-gray-400);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-gray-200);
}

.activity-placeholder p {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: var(--radius-md);
  background-color: var(--color-gray-50);
  border-left: 3px solid var(--color-blood-orange);
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 107, 0, 0.1);
  border-radius: var(--radius-sm);
  color: var(--color-blood-orange);
  flex-shrink: 0;
}

.activity-info {
  flex: 1;
}

.activity-text {
  margin: 0 0 6px 0;
  color: var(--color-gray-700);
  font-size: 0.95rem;
  line-height: 1.5;
}

.activity-date {
  margin: 0;
  color: var(--color-gray-400);
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.6rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
  }
}
</style>

<style scoped>
.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h1 {
  color: var(--color-plum);
  font-size: 2rem;
  margin: 0 0 12px 0;
  font-weight: 700;
  font-family: var(--font-family-display);
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--color-white);
  padding: 24px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  border: 1px solid var(--color-gray-100);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-gray-200);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(171, 72, 45, 0.08);
  border-radius: var(--radius-md);
  flex-shrink: 0;
  color: var(--color-blood-orange);
}

.stat-content h3 {
  color: var(--color-gray-500);
  font-size: 0.85rem;
  margin: 0 0 8px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  color: var(--color-plum);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.recent-section {
  background: var(--color-white);
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-100);
}

.recent-section h2 {
  color: var(--color-plum);
  margin: 0 0 24px 0;
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-family-display);
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-placeholder {
  padding: 48px 24px;
  text-align: center;
  color: var(--color-gray-400);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-gray-200);
}

.activity-placeholder p {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.6rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
  }
}
</style>
