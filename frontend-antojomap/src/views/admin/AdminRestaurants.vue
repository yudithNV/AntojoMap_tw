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
.page-header { margin-bottom: 20px; }
.page-header h1 { color: var(--plum); font-size: 2rem; margin: 0 0 6px 0; }
.subtitle { color: var(--dusty-coral); font-size: 0.95rem; margin: 0; }

.stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
.stat-card {
  background: white; border-radius: 12px; padding: 16px 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  display: flex; flex-direction: column; align-items: center; min-width: 90px;
}
.stat-number { font-size: 1.8rem; font-weight: 700; color: var(--plum); }
.stat-label { font-size: 0.8rem; color: var(--dusty-coral); margin-top: 2px; }

.content-container {
  background: white; border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08); overflow: hidden;
}
.loading, .content-placeholder {
  padding: 60px 20px; text-align: center; color: var(--dusty-coral);
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.table-container { overflow-x: auto; }
.restaurants-table { width: 100%; border-collapse: collapse; }
.restaurants-table thead { background-color: #f5f5f5; border-bottom: 2px solid #e0e0e0; }
.restaurants-table th {
  padding: 15px; text-align: left; font-weight: 600; color: var(--plum); font-size: 0.9rem;
}
.restaurants-table td { padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; }
.restaurants-table tbody tr:hover { background-color: #fafafa; }

.clickable-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-row:hover {
  background-color: #f0f0f0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.rest-cell { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 38px; height: 38px; border-radius: 50%; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: white; font-size: 1rem; flex-shrink: 0;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.rest-info { display: flex; flex-direction: column; }
.rest-nombre { font-weight: 600; font-size: 0.9rem; }
.rest-id { font-size: 0.75rem; color: #999; }

.estado-badge {
  display: inline-block; padding: 4px 12px;
  border-radius: 20px; font-size: 0.8rem; font-weight: 600;
}
.estado-badge.activo { background-color: #e8f5e9; color: #2e7d32; }
.estado-badge:not(.activo) { background-color: #ffebee; color: #c62828; }

.error-message { padding: 15px; background-color: #ffebee; color: #c62828; text-align: center; }
.error-message p { margin: 0; }
</style>