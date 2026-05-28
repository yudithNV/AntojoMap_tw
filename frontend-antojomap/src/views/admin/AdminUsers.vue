<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Usuarios</h1>
      <p class="subtitle">Administra los usuarios de la plataforma</p>
    </div>

    <!-- ===== BARRA DE BÚSQUEDA Y FILTROS ===== -->
    <div class="filters-container">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o correo..."
          class="search-input"
        />
      </div>

      <div class="filter-wrapper">
        <select v-model="selectedType" class="filter-select">
          <option value="">Todos los tipos</option>
          <option value="usuario">Solo Usuarios (USER)</option>
          <option value="restaurante">Solo Restaurantes (RESTAURANTE)</option>
          <option value="admin">Solo Administradores</option>
        </select>
      </div>
    </div>

    <div class="content-container">
      <div v-if="loading" class="loading">
        <p>Cargando usuarios...</p>
      </div>

      <div v-else-if="filteredUsuarios.length === 0" class="content-placeholder">
        <Users :size="48" stroke-width="1.5" />
        <p v-if="searchQuery || selectedType">No se encontraron usuarios con esos criterios</p>
        <p v-else>No hay usuarios disponibles</p>
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
            <tr v-for="usuario in filteredUsuarios" :key="usuario.id">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nombre || 'N/A' }}</td>
              <td>{{ usuario.email }}</td>
              <td>
                <span class="badge" :class="getRolClass(usuario.rol)">
                  {{ getRolLabel(usuario.rol) }}
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
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Users } from 'lucide-vue-next'
import { adminService } from '../../services/admin.service.js'

// ========== ESTADO ==========
const usuarios = ref([])
const loading = ref(true)
const error = ref(null)

// ========== FILTROS ==========
const searchQuery = ref('')
const selectedType = ref('')

// ========== PROPIEDAD COMPUTADA PARA FILTRAR (CORREGIDA) ==========
const filteredUsuarios = computed(() => {
  let result = usuarios.value

  // Filtrar por término de búsqueda (nombre o email)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(user =>
      user.nombre?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }

  // Filtrar por tipo de usuario con comparación flexible
  if (selectedType.value) {
    result = result.filter(user => {
      const userRol = (user.rol || 'usuario').toLowerCase()
      const filterValue = selectedType.value.toLowerCase()
      
      // Comparación flexible: acepta 'usuario' tanto para 'usuario' como para 'user'
      if (filterValue === 'usuario') {
        return userRol === 'usuario' || userRol === 'user'
      }
      
      // Para otros tipos (restaurante, admin) comparación directa
      return userRol === filterValue
    })
  }

  return result
})

// ========== FUNCIONES AUXILIARES ==========
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getRolLabel = (rol) => {
  const roles = {
    'admin': 'Administrador',
    'restaurante': 'Restaurante',
    'usuario': 'Usuario',
    'user': 'Usuario'
  }
  return roles[rol?.toLowerCase()] || 'Usuario'
}

const getRolClass = (rol) => {
  const classes = {
    'admin': 'admin',
    'restaurante': 'restaurante',
    'usuario': 'usuario',
    'user': 'usuario'
  }
  return classes[rol?.toLowerCase()] || 'usuario'
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

// ========== LIFECYCLE ==========
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

/* ===== BARRA DE BÚSQUEDA Y FILTROS ===== */
.filters-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .filters-container {
    flex-direction: row;
    justify-content: space-between;
  }
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background-color: white;
}

.search-input:focus {
  outline: none;
  border-color: var(--plum);
  box-shadow: 0 0 0 3px rgba(72, 24, 39, 0.1);
}

.filter-wrapper {
  min-width: 200px;
}

.filter-select {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--plum);
  box-shadow: 0 0 0 3px rgba(72, 24, 39, 0.1);
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

/* ===== BADGES ===== */
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