=<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Solicitudes de Restaurantes</h1>
      <p class="subtitle">Revisa y aprueba/rechaza nuevas solicitudes</p>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <Search class="search-icon" :size="20" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre del restaurante..."
        class="search-input"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-message">
      <p>Cargando solicitudes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Sin solicitudes -->
    <div v-else-if="filteredSolicitudes.length === 0" class="empty-message">
      <p>{{ searchQuery ? 'No se encontraron resultados' : 'No hay solicitudes pendientes' }}</p>
    </div>

    <!-- Tabla de solicitudes -->
    <div v-else class="table-container">
      <table class="solicitudes-table">
        <thead>
          <tr>
            <th>Restaurante</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Categoría</th>
            <th>Foto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in filteredSolicitudes" :key="solicitud.id" class="solicitud-row">
            <td class="nombre">{{ solicitud.nombre_restaurante }}</td>
            <td class="email">{{ solicitud.usuario?.email || 'No disponible' }}</td>
            <td class="direccion">{{ solicitud.direccion }}</td>
            <td class="telefono">{{ solicitud.telefono }}</td>
            <td class="categoria">{{ solicitud.categoria }}</td>
            <td class="foto">
              <a v-if="solicitud.foto_comprobante" :href="solicitud.foto_comprobante" target="_blank" class="foto-link">
                Ver foto
              </a>
              <span v-else class="no-foto">—</span>
            </td>
            <td class="estado">
              <span class="status-badge" :class="solicitud.estado.toLowerCase()">
                {{ solicitud.estado }}
              </span>
            </td>
            <td class="acciones">
              <button
                v-if="solicitud.estado === 'PENDIENTE'"
                class="btn btn-approve"
                @click="aprobar(solicitud.id)"
                :disabled="processingId === solicitud.id"
              >
                ✓
              </button>
              <button
                v-if="solicitud.estado === 'PENDIENTE'"
                class="btn btn-reject"
                @click="openRejectModal(solicitud.id)"
                :disabled="processingId === solicitud.id"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensaje de feedback -->
    <div v-if="feedback.message" class="feedback-message" :class="feedback.type">
      {{ feedback.message }}
    </div>

    <!-- ===== MODAL DE CONFIRMACIÓN PARA RECHAZAR ===== -->
    <Transition name="modal-fade">
      <div v-if="showRejectModal" class="modal-overlay" @click.self="closeRejectModal">
        <div class="modal-card">
          <!-- Icono de advertencia -->
          <div class="modal-icon">
            <div class="icon-circle danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          
          <!-- Título y mensaje -->
          <h2 class="modal-title">¿Estás seguro de rechazar esta solicitud?</h2>
          <p class="modal-message">
            Esta acción no se puede deshacer y el establecimiento tendrá que enviar sus datos nuevamente.
          </p>
          
          <!-- Botones de acción -->
          <div class="modal-actions">
            <button class="modal-btn cancel" @click="closeRejectModal">
              No
            </button>
            <button class="modal-btn confirm" @click="confirmReject">
              Sí, rechazar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { adminService } from '../../services/admin.service.js'
import { Search } from 'lucide-vue-next'

const solicitudes = ref([])
const isLoading = ref(false)
const error = ref('')
const processingId = ref(null)
const feedback = ref({ message: '', type: '' })
const searchQuery = ref('')

// ===== MODAL DE RECHAZO =====
const showRejectModal = ref(false)
const solicitudARechazar = ref(null)

const openRejectModal = (id) => {
  solicitudARechazar.value = id
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  solicitudARechazar.value = null
}

const confirmReject = async () => {
  if (solicitudARechazar.value) {
    await rechazar(solicitudARechazar.value)
    closeRejectModal()
  }
}

const filteredSolicitudes = computed(() => {
  if (!searchQuery.value) return solicitudes.value
  return solicitudes.value.filter(s =>
    s.nombre_restaurante.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const cargarSolicitudes = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const data = await adminService.getSolicitudes()
    solicitudes.value = data || []
  } catch (err) {
    error.value = err.message || 'Error al cargar solicitudes'
  } finally {
    isLoading.value = false
  }
}

const aprobar = async (id) => {
  processingId.value = id
  try {
    await adminService.aprobarSolicitud(id)
    feedback.value.message = '✓ Solicitud aprobada exitosamente'
    feedback.value.type = 'success'
    await cargarSolicitudes()
    setTimeout(() => { feedback.value.message = '' }, 3000)
  } catch (err) {
    feedback.value.message = err.message || 'Error al aprobar'
    feedback.value.type = 'error'
  } finally {
    processingId.value = null
  }
}

const rechazar = async (id) => {
  processingId.value = id
  try {
    await adminService.rechazarSolicitud(id)
    feedback.value.message = '✗ Solicitud rechazada'
    feedback.value.type = 'success'
    await cargarSolicitudes()
    setTimeout(() => { feedback.value.message = '' }, 3000)
  } catch (err) {
    feedback.value.message = err.message || 'Error al rechazar'
    feedback.value.type = 'error'
  } finally {
    processingId.value = null
  }
}

onMounted(() => {
  cargarSolicitudes()
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

.search-bar {
  position: relative;
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-blood-orange);
  box-shadow: 0 0 0 3px rgba(163, 51, 51, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.loading-message,
.empty-message {
  background: white;
  padding: 40px 20px;
  border-radius: 8px;
  text-align: center;
  color: var(--dusty-coral);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c00;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
}

.solicitudes-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.solicitudes-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--plum);
  font-size: 0.9rem;
}

.solicitudes-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s ease;
}

.solicitudes-table tbody tr:hover {
  background: #fafafa;
}

.solicitudes-table td {
  padding: 15px;
  font-size: 0.9rem;
  color: #333;
}

.nombre {
  font-weight: 600;
  color: var(--plum);
}

.email {
  color: #666;
  font-family: monospace;
  font-size: 0.85rem;
}

.categoria {
  text-transform: capitalize;
  color: #666;
}

.telefono {
  color: #666;
  font-size: 0.9rem;
}

.foto {
  text-align: center;
}

.foto-link {
  color: var(--color-blood-orange);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.foto-link:hover {
  text-decoration: underline;
}

.no-foto {
  color: #ccc;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.pendiente {
  background: #fff3cd;
  color: #856404;
}

.status-badge.aprobado {
  background: #d4edda;
  color: #155724;
}

.status-badge.rechazado {
  background: #f8d7da;
  color: #721c24;
}

.acciones {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-approve {
  background: #d4edda;
  color: #155724;
}

.btn-approve:hover:not(:disabled) {
  background: #c3e6cb;
  transform: scale(1.05);
}

.btn-reject {
  background: #f8d7da;
  color: #721c24;
}

.btn-reject:hover:not(:disabled) {
  background: #f5c6cb;
  transform: scale(1.05);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feedback-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.feedback-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.feedback-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* ===== ESTILOS DEL MODAL DE CONFIRMACIÓN ===== */
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
  background-color: #fee2e2;
  border-radius: 9999px;
  padding: 0.75rem;
  color: #dc2626;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.modal-btn.confirm {
  background-color: #dc2626;
  color: white;
}

.modal-btn.confirm:hover {
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

@media (max-width: 768px) {
  .solicitudes-table {
    font-size: 0.85rem;
  }

  .solicitudes-table th,
  .solicitudes-table td {
    padding: 10px;
  }

  .direccion {
    display: none;
  }

  .acciones {
    gap: 4px;
  }

  .btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .modal-card {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .modal-message {
    font-size: 0.8rem;
  }
  
  .modal-btn {
    padding: 0.5rem 1.2rem;
  }
}
</style>