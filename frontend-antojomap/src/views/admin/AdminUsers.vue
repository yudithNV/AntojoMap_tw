<template>
  <DashboardLayout>
    <div class="admin-users">
      <div class="page-header">
        <h1 class="fade-in">Usuarios</h1>
        <p class="subtitle fade-in-delay">Administra los usuarios de la plataforma</p>
      </div>

      <!-- Contadores con animación -->
      <div class="stats-row">
        <div class="stat-card hover-lift fade-in-up" v-for="(stat, idx) in statsData" :key="idx">
          <span class="stat-number">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="filters-container fade-in-up-delay">
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
        <div v-if="loading" class="loading-state">
          <div class="loader"></div>
          <p>Cargando usuarios...</p>
        </div>

        <div v-else-if="filteredUsuarios.length === 0" class="empty-state">
          <Users :size="48" stroke-width="1.5" />
          <p v-if="searchQuery || selectedType">No se encontraron usuarios con esos criterios</p>
          <p v-else>No hay usuarios disponibles</p>
        </div>

        <div v-else class="table-container">
          <table class="users-table">
            <!-- 🔥 CABECERA CON COLOR ROSA SUAVE 🔥 -->
            <thead class="table-header-rose">
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Registro</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(usuario, index) in filteredUsuarios" :key="usuario.id" class="table-row" :style="{ animationDelay: `${index * 0.02}s` }">
                <td>
                  <div class="user-cell">
                    <div class="avatar subtle-avatar" :style="avatarStyle(usuario)">
                      <img v-if="usuario.foto_perfil" :src="usuario.foto_perfil" :alt="usuario.nombre" />
                      <span v-else>{{ inicial(usuario.nombre) }}</span>
                    </div>
                    <div class="user-info">
                      <span class="user-nombre">{{ usuario.nombre || 'N/A' }}</span>
                      <span class="user-id">#{{ usuario.id.slice(0, 8) }}</span>
                    </div>
                  </div>
                </td>
                <td class="email">{{ usuario.email }}</td>
                <td>
                  <span class="badge" :class="getRolClass(usuario.rol)">
                    {{ getRolLabel(usuario.rol) }}
                  </span>
                </td>
                <td class="date">{{ formatDate(usuario.creado_en) }}</td>
                <td>
                  <button
                    class="toggle-btn"
                    :class="{ activo: usuario.activo }"
                    @click="openToggleModal(usuario)"
                    :disabled="togglingId === usuario.id"
                  >
                    <span class="toggle-dot"></span>
                    {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de confirmación -->
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
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Users } from 'lucide-vue-next'
import { adminService } from '../../services/admin.service.js'

// ========== ESTADO ==========
const usuarios = ref([])
const loading = ref(true)
const error = ref(null)
const togglingId = ref(null)
const showToggleModal = ref(false)
const selectedUsuario = ref(null)

// ========== FILTROS ==========
const searchQuery = ref('')
const selectedType = ref('')

// ========== STATS ==========
const statsData = computed(() => [
  { value: usuarios.value.length, label: 'Total' },
  { value: usuarios.value.filter(u => u.rol === 'RESTAURANTE').length, label: 'Restaurantes' },
  { value: usuarios.value.filter(u => u.rol === 'USER' || u.rol === 'usuario').length, label: 'Usuarios' },
  { value: usuarios.value.filter(u => u.rol === 'ADMIN').length, label: 'Admins' }
])

// ========== PROPIEDAD COMPUTADA PARA FILTRAR ==========
const filteredUsuarios = computed(() => {
  let result = usuarios.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(user =>
      user.nombre?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    result = result.filter(user => {
      const userRol = (user.rol || 'usuario').toLowerCase()
      const filterValue = selectedType.value.toLowerCase()
      
      if (filterValue === 'usuario') {
        return userRol === 'usuario' || userRol === 'user'
      }
      return userRol === filterValue
    })
  }

  return result
})

// ========== FUNCIONES AUXILIARES ==========
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

const avatarColors = ['#e57373','#f06292','#ba68c8','#7986cb','#4fc3f7','#4db6ac','#aed581','#ffb74d']
const avatarStyle = (usuario) => {
  if (usuario.foto_perfil) return {}
  const index = usuario.nombre?.charCodeAt(0) % avatarColors.length || 0
  return { backgroundColor: avatarColors[index] }
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
    usuario.activo = !usuario.activo
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

// ========== LIFECYCLE ==========
onMounted(() => {
  loadUsuarios()
})
</script>

<style scoped>
.admin-users {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== ANIMACIONES SUAVES ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

.fade-in-delay {
  animation: fadeIn 0.5s ease-out 0.1s both;
}

.fade-in-up {
  animation: fadeInUp 0.4s ease-out backwards;
}

.fade-in-up-delay {
  animation: fadeInUp 0.4s ease-out 0.15s backwards;
}

/* ===== HEADER ===== */
.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #481827;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.subtitle {
  color: #D893A1;
  font-size: 0.88rem;
  margin: 0;
}

/* ===== STATS ROW ===== */
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
  text-align: center;
  min-width: 100px;
  flex: 1;
  transition: all 0.25s ease;
  cursor: default;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.stat-card:nth-child(1) { animation-delay: 0s; }
.stat-card:nth-child(2) { animation-delay: 0.05s; }
.stat-card:nth-child(3) { animation-delay: 0.1s; }
.stat-card:nth-child(4) { animation-delay: 0.15s; }

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
  border-color: rgba(216, 147, 161, 0.15);
}

.stat-number {
  display: block;
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
}

/* ===== FILTROS ===== */
.filters-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
}

@media (min-width: 640px) {
  .filters-container {
    flex-direction: row;
    justify-content: space-between;
  }
  .search-wrapper {
    flex: 1;
  }
  .filter-wrapper {
    min-width: 220px;
  }
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  transition: color 0.2s;
}

.search-wrapper:focus-within .search-icon {
  color: #481827;
}

.search-input {
  width: 100%;
  padding: 11px 16px 11px 44px;
  border: 1.5px solid #f0ede7;
  border-radius: 50px;
  font-size: 0.88rem;
  background: white;
  transition: all 0.25s ease;
}

.search-input:focus {
  outline: none;
  border-color: #481827;
  box-shadow: 0 0 0 2px rgba(72, 24, 39, 0.05);
}

/* ===== SELECT REDISEÑADO (COMBO BOX) ===== */
.filter-select {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1.5px solid #f0ede7;
  border-radius: 50px;
  font-size: 0.85rem;
  background: white;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.filter-select:hover {
  border-color: #D893A1;
}

.filter-select:focus {
  outline: none;
  border-color: #481827;
  box-shadow: 0 0 0 2px rgba(72, 24, 39, 0.05);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23481827' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.content-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid #f5f2ef;
}

/* ===== LOADING & EMPTY STATES ===== */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #D893A1;
}

.loader {
  width: 36px;
  height: 36px;
  border: 2px solid #f0ede7;
  border-top-color: #481827;
  border-radius: 50%;
  margin: 0 auto 14px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
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

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

/* CABECERA DE TABLA EN COLOR VINO */
.users-table thead {
  background: #481827;
  border-bottom: 1px solid #5c2a3a;
}

.users-table th {
  padding: 14px 20px;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 14px 20px;
  font-size: 0.85rem;
  color: #555;
  border-bottom: 1px solid #f5f2ef;
}

.table-row {
  transition: background 0.2s ease;
  animation: slideInFromLeft 0.3s ease-out backwards;
}

.table-row:hover {
  background: #FAF8F6;
}

/* ===== USER CELL ===== */
.user-cell {
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

.subtle-avatar:hover {
  transform: scale(1.02);
  filter: brightness(1.02);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-nombre {
  font-weight: 700;
  color: #481827;
  font-size: 0.88rem;
}

.user-id {
  font-size: 0.68rem;
  color: #aaa;
  font-family: monospace;
}

/* ===== EMAIL ===== */
.email {
  font-family: monospace;
  font-size: 0.8rem;
  color: #888;
}

/* ===== DATE ===== */
.date {
  font-size: 0.8rem;
  color: #666;
}

/* ===== BADGES ===== */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.02);
}

.badge.usuario {
  background: #E0F2FE;
  color: #0284C7;
}

.badge.restaurante {
  background: #FEF3C7;
  color: #D97706;
}

.badge.admin {
  background: #F3E8FF;
  color: #9333EA;
}

/* ===== TOGGLE BUTTON ===== */
.toggle-btn {
  padding: 5px 14px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 600;
  background: #FEE2E2;
  color: #DC2626;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.toggle-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  transition: all 0.2s;
}

.toggle-btn.activo {
  background: #D1FAE5;
  color: #059669;
}

.toggle-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.toggle-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== MODAL REFINADO ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.3s ease-out;
}

.modal-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.icon-circle.activate {
  background: #D1FAE5;
  color: #059669;
}

.icon-circle.deactivate {
  background: #FEE2E2;
  color: #DC2626;
}

.modal-card:hover .icon-circle {
  transform: scale(1.02);
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.modal-message {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  padding: 9px 18px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.modal-btn.cancel {
  background: #f3f4f6;
  color: #4b5563;
}

.modal-btn.cancel:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.modal-btn.confirm-toggle.activate {
  background: #059669;
  color: white;
}

.modal-btn.confirm-toggle.activate:hover {
  background: #047857;
  transform: translateY(-1px);
}

.modal-btn.confirm-toggle.deactivate {
  background: #dc2626;
  color: white;
}

.modal-btn.confirm-toggle.deactivate:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

/* ===== ERROR ===== */
.error-message {
  background: #FEE2E2;
  border: 1px solid #FECACA;
  color: #DC2626;
  padding: 14px;
  border-radius: 14px;
  margin-top: 20px;
  text-align: center;
  font-size: 0.85rem;
}

/* ===== TRANSICIONES MODAL ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: scale(0.96);
  opacity: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .admin-users {
    padding: 0 16px;
  }

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

  .users-table th,
  .users-table td {
    padding: 10px 12px;
  }

  .avatar {
    width: 36px;
    height: 36px;
  }

  .user-nombre {
    font-size: 0.82rem;
  }

  .modal-card {
    margin: 16px;
    padding: 20px;
  }

  .modal-title {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .stats-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>