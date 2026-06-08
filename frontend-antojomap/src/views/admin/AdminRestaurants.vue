<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Restaurantes</h1>
      <p class="subtitle">Monitorea todos los restaurantes en la plataforma</p>
    </div>

    <!-- Contadores -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-number">{{ restaurantes.length }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ restaurantes.filter(r => r.estado === 'activo').length }}</span>
        <span class="stat-label">Activos</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ restaurantes.filter(r => r.estado !== 'activo').length }}</span>
        <span class="stat-label">Inactivos</span>
      </div>
    </div>

    <div class="content-container">
      <div v-if="loading" class="loading"><p>Cargando restaurantes...</p></div>

      <div v-else-if="restaurantes.length === 0" class="content-placeholder">
        <Store :size="48" stroke-width="1.5" />
        <p>No hay restaurantes disponibles</p>
      </div>

      <div v-else class="table-container">
        <table class="restaurants-table">
          <thead>
            <tr>
              <th>Restaurante</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Propietario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="restaurante in restaurantes" :key="restaurante.id" @click="goToDetalle(restaurante.id)" class="clickable-row">
              <td>
                <div class="rest-cell">
                  <div class="avatar" :style="avatarStyle(restaurante)">
                    <img v-if="restaurante.foto_portada" :src="restaurante.foto_portada" :alt="restaurante.nombre" />
                    <span v-else>{{ inicial(restaurante.nombre) }}</span>
                  </div>
                  <div class="rest-info">
                    <span class="rest-nombre">{{ restaurante.nombre }}</span>
                    <span class="rest-id">#{{ restaurante.id.slice(0, 8) }}</span>
                  </div>
                </div>
              </td>
              <td>{{ restaurante.direccion || 'N/A' }}</td>
              <td>{{ restaurante.telefono || 'N/A' }}</td>
              <td>{{ restaurante.propietario?.email || 'N/A' }}</td>
              <td>
                <span class="estado-badge" :class="restaurante.estado">
                  {{ restaurante.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="error" class="error-message"><p>{{ error }}</p></div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Store } from 'lucide-vue-next'
import { adminService } from '../../services/admin.service.js'

const router = useRouter()
const restaurantes = ref([])
const loading = ref(true)
const error = ref(null)

const inicial = (nombre) => nombre ? nombre.charAt(0).toUpperCase() : '?'

const avatarColors = ['#e57373','#f06292','#ba68c8','#7986cb','#4fc3f7','#4db6ac','#aed581','#ffb74d']
const avatarStyle = (restaurante) => {
  if (restaurante.foto_portada) return {}
  const index = restaurante.nombre?.charCodeAt(0) % avatarColors.length || 0
  return { backgroundColor: avatarColors[index] }
}

const goToDetalle = (restauranteId) => {
  router.push({ name: 'admin-restaurante-detalle', params: { id: restauranteId } })
}

const loadRestaurantes = async () => {
  try {
    loading.value = true
    error.value = null
    const res = await adminService.getRestaurantes()
    restaurantes.value = Array.isArray(res) ? res : res.restaurantes
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => loadRestaurantes())
</script>

<style scoped>
.page-header { 
  margin-bottom: 28px; 
}

.page-header h1 { 
  color: #481827; 
  font-size: 1.75rem; 
  font-weight: 700;
  margin: 0 0 6px 0; 
  letter-spacing: -0.3px;
}

.subtitle { 
  color: #D893A1; 
  font-size: 0.88rem; 
  margin: 0; 
}

/* ===== STATS ROW - OCUPA TODO EL ANCHO HORIZONTAL ===== */
.stats-row { 
  display: flex; 
  flex-wrap: wrap;
  gap: 14px; 
  margin-bottom: 28px; 
}

.stat-card {
  background: white; 
  border-radius: 18px; 
  padding: 18px 24px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.02);
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  flex: 1;
  min-width: 100px;
  transition: all 0.25s ease;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
  border-color: rgba(216, 147, 161, 0.15);
}

.stat-number { 
  font-size: 1.9rem; 
  font-weight: 800; 
  color: #481827; 
  line-height: 1.2;
}

.stat-label { 
  font-size: 0.75rem; 
  color: #D893A1; 
  font-weight: 500; 
  letter-spacing: 0.3px;
  margin-top: 4px;
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.content-container {
  background: white; 
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid #f5f2ef;
  overflow: hidden;
}

.loading, .content-placeholder {
  padding: 60px 20px; 
  text-align: center; 
  color: #D893A1;
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 14px;
}

/* ===== TABLA ===== */
.table-container { 
  overflow-x: auto; 
}

.restaurants-table { 
  width: 100%; 
  border-collapse: collapse; 
  min-width: 800px;
}

/* CABECERA CON GRADIENTE ROSA COMO LA TABLA DE USUARIOS */
/* CABECERA DE TABLA EN COLOR VINO */
.restaurants-table thead {
  background: #481827;
  border-bottom: 1px solid #5c2a3a;
}

.restaurants-table th {
  padding: 14px 20px;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.restaurants-table td { 
  padding: 14px 20px; 
  border-bottom: 1px solid #f5f2ef; 
  color: #555;
  font-size: 0.85rem;
}

.restaurants-table tbody tr { 
  transition: all 0.2s ease;
}

.restaurants-table tbody tr:hover { 
  background-color: #FAF8F6;
}

/* ===== FILA CLICKEABLE ===== */
.clickable-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-row:hover {
  background-color: #FAF8F6;
}

/* ===== CELDA DE RESTAURANTE ===== */
.rest-cell { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.avatar {
  width: 42px; 
  height: 42px; 
  border-radius: 50%; 
  overflow: hidden;
  display: flex; 
  align-items: center; 
  justify-content: center;
  font-weight: 600; 
  color: white; 
  font-size: 0.95rem; 
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.avatar:hover {
  transform: scale(1.02);
  filter: brightness(1.02);
}

.avatar img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.rest-info { 
  display: flex; 
  flex-direction: column; 
  gap: 2px;
}

.rest-nombre { 
  font-weight: 700; 
  font-size: 0.88rem;
  color: #481827;
}

.rest-id { 
  font-size: 0.68rem; 
  color: #aaa;
  font-family: monospace;
}

/* ===== BADGE DE ESTADO ===== */
.estado-badge {
  display: inline-block; 
  padding: 4px 12px;
  border-radius: 30px; 
  font-size: 0.68rem; 
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  transition: all 0.2s ease;
}

.estado-badge.activo { 
  background-color: #D1FAE5; 
  color: #059669; 
}

.estado-badge:not(.activo) { 
  background-color: #FEE2E2; 
  color: #DC2626; 
}

.estado-badge:hover {
  transform: scale(1.02);
}

/* ===== ERROR ===== */
.error-message { 
  padding: 15px; 
  background-color: #FEE2E2; 
  color: #DC2626; 
  text-align: center;
  margin: 0;
  border-radius: 14px;
}

.error-message p { 
  margin: 0; 
  font-size: 0.85rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .stats-row {
    gap: 10px;
  }
  
  .stat-card {
    padding: 12px 14px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.68rem;
  }
  
  .restaurants-table th,
  .restaurants-table td {
    padding: 10px 12px;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
  }
  
  .rest-nombre {
    font-size: 0.82rem;
  }
}

@media (max-width: 640px) {
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>