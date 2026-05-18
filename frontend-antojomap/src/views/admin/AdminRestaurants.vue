<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Restaurantes Activos</h1>
      <p class="subtitle">Monitorea todos los restaurantes en la plataforma</p>
    </div>

    <div class="content-container">
      <div v-if="loading" class="loading">
        <p>Cargando restaurantes...</p>
      </div>

      <div v-else-if="restaurantes.length === 0" class="content-placeholder">
        <Store :size="48" stroke-width="1.5" />
        <p>No hay restaurantes disponibles</p>
      </div>

      <div v-else class="table-container">
        <table class="restaurants-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Propietario ID</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="restaurante in restaurantes" :key="restaurante.id">
              <td class="nombre">{{ restaurante.nombre }}</td>
              <td>{{ restaurante.direccion || 'N/A' }}</td>
              <td>{{ restaurante.telefono || 'N/A' }}</td>
              <td class="id-small">{{ restaurante.propietario_id }}</td>
              <td class="descripcion">{{ restaurante.descripcion || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Store } from 'lucide-vue-next'
import { adminService } from '../../services/admin.service.js'

const restaurantes = ref([])
const loading = ref(true)
const error = ref(null)

const loadRestaurantes = async () => {
  try {
    loading.value = true
    error.value = null
    restaurantes.value = await adminService.getRestaurantes()
  } catch (err) {
    error.value = err.message
    console.error('Error cargando restaurantes:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRestaurantes()
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

.content-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.loading,
.content-placeholder {
  padding: 60px 20px;
  text-align: center;
  color: var(--dusty-coral);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.content-placeholder p,
.loading p {
  font-size: 1.1rem;
  margin: 0;
}

.content-placeholder svg {
  color: var(--color-blood-orange);
}

.table-container {
  overflow-x: auto;
}

.restaurants-table {
  width: 100%;
  border-collapse: collapse;
}

.restaurants-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.restaurants-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--plum);
  font-size: 0.9rem;
}

.restaurants-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.restaurants-table tbody tr:hover {
  background-color: #fafafa;
}

.nombre {
  font-weight: 600;
  color: var(--plum);
}

.id-small {
  font-size: 0.8rem;
  font-family: monospace;
  color: #666;
}

.descripcion {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-message {
  padding: 15px;
  background-color: #ffebee;
  color: #c62828;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}

.error-message p {
  margin: 0;
}
</style>
