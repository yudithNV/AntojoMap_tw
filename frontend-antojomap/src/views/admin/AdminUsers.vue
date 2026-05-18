<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Usuarios</h1>
      <p class="subtitle">Administra los usuarios de la plataforma</p>
    </div>

    <div class="content-container">
      <div v-if="loading" class="loading">
        <p>Cargando usuarios...</p>
      </div>

      <div v-else-if="usuarios.length === 0" class="content-placeholder">
        <Users :size="48" stroke-width="1.5" />
        <p>No hay usuarios disponibles</p>
      </div>

      <div v-else class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nombre || 'N/A' }}</td>
              <td>{{ usuario.email }}</td>
              <td>
                <span class="badge" :class="usuario.rol || 'usuario'">
                  {{ usuario.rol || 'Usuario' }}
                </span>
              </td>
              <td>{{ formatDate(usuario.creado_en) }}</td>
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
import { Users } from 'lucide-vue-next'
import { adminService } from '../../services/admin.service.js'

const usuarios = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadUsuarios = async () => {
  try {
    loading.value = true
    error.value = null
    usuarios.value = await adminService.getUsuarios()
  } catch (err) {
    error.value = err.message
    console.error('Error cargando usuarios:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsuarios()
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.users-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--plum);
  font-size: 0.9rem;
}

.users-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.users-table tbody tr:hover {
  background-color: #fafafa;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.usuario {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge.restaurante {
  background-color: #fff3e0;
  color: #f57c00;
}

.badge.admin {
  background-color: #f3e5f5;
  color: #7b1fa2;
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
