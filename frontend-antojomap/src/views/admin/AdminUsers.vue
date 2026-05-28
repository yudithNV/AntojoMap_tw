<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Usuarios</h1>
      <p class="subtitle">Administra los usuarios de la plataforma</p>
    </div>

    <!-- Contadores -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-number">{{ usuarios.length }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ usuarios.filter(u => u.rol === 'RESTAURANTE').length }}</span>
        <span class="stat-label">Restaurantes</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ usuarios.filter(u => u.rol === 'USER').length }}</span>
        <span class="stat-label">Usuarios</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ usuarios.filter(u => u.rol === 'ADMIN').length }}</span>
        <span class="stat-label">Admins</span>
      </div>
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
              <th>Usuario</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Registro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <!-- Avatar + nombre + id truncado -->
              <td>
                <div class="user-cell">
                  <div class="avatar" :style="avatarStyle(usuario)">
                    <img v-if="usuario.foto_perfil" :src="usuario.foto_perfil" :alt="usuario.nombre" />
                    <span v-else>{{ inicial(usuario.nombre) }}</span>
                  </div>
                  <div class="user-info">
                    <span class="user-nombre">{{ usuario.nombre || 'N/A' }}</span>
                    <span class="user-id">#{{ usuario.id.slice(0, 8) }}</span>
                  </div>
                </div>
              </td>
              <td>{{ usuario.email }}</td>
              <td>
                <span class="badge" :class="usuario.rol?.toLowerCase()">
                  {{ usuario.rol }}
                </span>
              </td>
              <td>{{ formatDate(usuario.creado_en) }}</td>
              <!-- Toggle activo -->
              <td>
                <button
                  class="toggle-btn"
                  :class="{ activo: usuario.activo }"
                  @click="openToggleModal(usuario)"
                  :disabled="togglingId === usuario.id"
                >
                  {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===== MODAL DE CONFIRMACIÓN PARA TOGGLE ACTIVO ===== -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="showToggleModal" class="modal-overlay" @click.self="closeToggleModal">
            <div class="modal-card">
              <div class="modal-icon">
                <div class="icon-circle" :class="selectedUsuario?.activo ? 'deactivate' : 'activate'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <path d="M12 1v6m0 6v6"></path>
                    <path d="M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24"></path>
                    <path d="M1 12h6m6 0h6"></path>
                    <path d="M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24"></path>
                  </svg>
                </div>
              </div>
              <h2 class="modal-title">
                {{ selectedUsuario?.activo ? '¿Desactivar usuario?' : '¿Activar usuario?' }}
              </h2>
              <p class="modal-message">
                {{ selectedUsuario?.activo 
                  ? `¿Estás seguro de que deseas desactivar a ${selectedUsuario?.nombre}?` 
                  : `¿Estás seguro de que deseas activar a ${selectedUsuario?.nombre}?` }}
              </p>
              <div class="modal-actions">
                <button class="modal-btn cancel" @click="closeToggleModal">Cancelar</button>
                <button 
                  class="modal-btn confirm-toggle" 
                  :class="selectedUsuario?.activo ? 'deactivate' : 'activate'"
                  @click="confirmToggle"
                >
                  {{ selectedUsuario?.activo ? 'Desactivar' : 'Activar' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

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
const togglingId = ref(null)

// Modal state
const showToggleModal = ref(false)
const selectedUsuario = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const inicial = (nombre) => {
  if (!nombre) return '?'
  return nombre.charAt(0).toUpperCase()
}

// Colores distintos por inicial para los avatares sin foto
const avatarColors = ['#e57373','#f06292','#ba68c8','#7986cb','#4fc3f7','#4db6ac','#aed581','#ffb74d']
const avatarStyle = (usuario) => {
  if (usuario.foto_perfil) return {}
  const index = usuario.nombre?.charCodeAt(0) % avatarColors.length || 0
  return { backgroundColor: avatarColors[index] }
}

// Modal handlers
const openToggleModal = (usuario) => {
  selectedUsuario.value = usuario
  showToggleModal.value = true
}

const closeToggleModal = () => {
  showToggleModal.value = false
  selectedUsuario.value = null
}

const confirmToggle = async () => {
  if (!selectedUsuario.value) return
  
  const usuario = selectedUsuario.value
  closeToggleModal()
  await toggleActivo(usuario)
}

const toggleActivo = async (usuario) => {
  try {
    togglingId.value = usuario.id
    await adminService.toggleActivo(usuario.id)
    usuario.activo = !usuario.activo // actualiza local sin recargar todo
  } catch (err) {
    error.value = 'Error al cambiar estado del usuario'
    console.error(err)
  } finally {
    togglingId.value = null
  }
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
  margin-bottom: 20px;
}
.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 6px 0;
}
.subtitle {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
}
.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--plum);
}
.stat-label {
  font-size: 0.8rem;
  color: var(--dusty-coral);
  margin-top: 2px;
}

/* Tabla */
.content-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
}
.loading, .content-placeholder {
  padding: 60px 20px;
  text-align: center;
  color: var(--dusty-coral);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.table-container { overflow-x: auto; }
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
.users-table tbody tr:hover { background-color: #fafafa; }

/* Avatar */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-nombre { font-weight: 600; font-size: 0.9rem; }
.user-id { font-size: 0.75rem; color: #999; }

/* Badges */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge.user { background-color: #e3f2fd; color: #1976d2; }
.badge.restaurante { background-color: #fff3e0; color: #f57c00; }
.badge.admin { background-color: #f3e5f5; color: #7b1fa2; }

/* Toggle */
.toggle-btn {
  padding: 5px 14px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: #ffebee;
  color: #c62828;
  transition: all 0.2s;
}
.toggle-btn.activo {
  background-color: #e8f5e9;
  color: #2e7d32;
}
.toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.error-message {
  padding: 15px;
  background-color: #ffebee;
  color: #c62828;
  text-align: center;
}
.error-message p { margin: 0; }

/* ===== MODALES ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.75rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
  z-index: 1001;
}

.modal-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-circle {
  border-radius: 9999px;
  padding: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-circle.activate {
  background-color: #dcfce7;
  color: #16a34a;
}

.icon-circle.deactivate {
  background-color: #fee2e2;
  color: #dc2626;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.modal-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.modal-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-btn.cancel {
  background-color: #f3f4f6;
  color: #4b5563;
}

.modal-btn.cancel:hover {
  background-color: #e5e7eb;
}

.modal-btn.confirm-toggle.activate {
  background-color: #16a34a;
  color: white;
}

.modal-btn.confirm-toggle.activate:hover {
  background-color: #15803d;
}

.modal-btn.confirm-toggle.deactivate {
  background-color: #dc2626;
  color: white;
}

.modal-btn.confirm-toggle.deactivate:hover {
  background-color: #b91c1c;
}

/* Transiciones del modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: scale(0.95);
  opacity: 0;
}
</style>