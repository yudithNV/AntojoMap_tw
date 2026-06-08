<template>
  <DashboardLayout>
    <div class="admin-requests">
      <!-- Header -->
      <div class="page-header">
        <h1>Solicitudes de Restaurantes</h1>
        <p class="subtitle">Revisa y aprueba o rechaza nuevas solicitudes</p>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="filters-section">
        <div class="search-bar">
          <Search class="search-icon" :size="20" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre del restaurante..."
            class="search-input"
          />
        </div>

        <div class="advanced-filters">
          <select v-model="filterCriterion" class="filter-select">
            <option value="">Sin filtros avanzados</option>
            <option value="status">Filtrar por Estado</option>
            <option value="category">Filtrar por Categoría</option>
          </select>

          <select v-if="filterCriterion === 'status'" v-model="statusValue" class="filter-select dynamic-select">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>

          <select v-else-if="filterCriterion === 'category'" v-model="categoryValue" class="filter-select dynamic-select">
            <option value="">Todas las categorías</option>
            <option value="mariscos">Mariscos</option>
            <option value="ensaladas">Ensaladas</option>
            <option value="tacos">Tacos</option>
            <option value="vegano">Vegano</option>
            <option value="hamburguesas">Hamburguesas</option>
            <option value="pasta">Pasta</option>
            <option value="pizza">Pizza</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-message">
        <div class="loader"></div>
        <p>Cargando solicitudes...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <!-- Sin solicitudes -->
      <div v-else-if="filteredSolicitudes.length === 0" class="empty-message">
        <p>{{ searchQuery ? 'No se encontraron resultados' : 'No hay solicitudes pendientes' }}</p>
      </div>

      <template v-else>
        <!-- ===== TABLA (desktop) ===== -->
        <div class="table-container desktop-only">
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
                  <a v-if="solicitud.foto_comprobante" :href="solicitud.foto_comprobante" target="_blank" class="foto-link">Ver foto</a>
                  <span v-else class="no-foto">—</span>
                </td>
                <td class="estado">
                  <span class="status-badge" :class="solicitud.estado.toLowerCase()">{{ solicitud.estado }}</span>
                </td>
                <td class="acciones">
                  <button v-if="solicitud.estado === 'PENDIENTE'" class="btn btn-approve" @click="openApproveModal(solicitud.id)" :disabled="processingId === solicitud.id">✓</button>
                  <button v-if="solicitud.estado === 'PENDIENTE'" class="btn btn-reject" @click="openRejectModal(solicitud.id)" :disabled="processingId === solicitud.id">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ===== CARDS (móvil) ===== -->
        <div class="cards-container mobile-only">
          <div
            v-for="solicitud in filteredSolicitudes"
            :key="solicitud.id"
            class="solicitud-card"
          >
            <div class="card-header">
              <div class="card-header-left">
                <h3 class="card-nombre">{{ solicitud.nombre_restaurante }}</h3>
                <span class="card-categoria">{{ solicitud.categoria }}</span>
              </div>
              <span class="status-badge" :class="solicitud.estado.toLowerCase()">{{ solicitud.estado }}</span>
            </div>

            <div class="card-body">
              <div class="card-field">
                <span class="card-label">Email</span>
                <span class="card-value email">{{ solicitud.usuario?.email || 'No disponible' }}</span>
              </div>
              <div class="card-field">
                <span class="card-label">Teléfono</span>
                <span class="card-value">{{ solicitud.telefono }}</span>
              </div>
              <div class="card-field">
                <span class="card-label">Dirección</span>
                <span class="card-value">{{ solicitud.direccion }}</span>
              </div>
              <div class="card-field" v-if="solicitud.foto_comprobante">
                <span class="card-label">Comprobante</span>
                <a :href="solicitud.foto_comprobante" target="_blank" class="foto-link">Ver foto →</a>
              </div>
            </div>

            <div class="card-actions" v-if="solicitud.estado === 'PENDIENTE'">
              <button
                class="card-btn card-btn-reject"
                @click="openRejectModal(solicitud.id)"
                :disabled="processingId === solicitud.id"
              >✕ Rechazar</button>
              <button
                class="card-btn card-btn-approve"
                @click="openApproveModal(solicitud.id)"
                :disabled="processingId === solicitud.id"
              >✓ Aprobar</button>
            </div>
          </div>
        </div>
      </template>

      <!-- Modal Aprobar -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="showApproveModal" class="modal-overlay" @click.self="closeApproveModal">
            <div class="modal-card">
              <div class="modal-icon">
                <div class="icon-circle approve">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <h2 class="modal-title">¿Estás seguro de aceptar esta solicitud?</h2>
              <p class="modal-message">Esta acción es irreversible y el restaurante quedará habilitado.</p>
              <div class="modal-actions">
                <button class="modal-btn cancel" @click="closeApproveModal">No, cancelar</button>
                <button class="modal-btn confirm-approve" @click="confirmApprove">Sí, aceptar</button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Modal Rechazar -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="showRejectModal" class="modal-overlay" @click.self="closeRejectModal">
            <div class="modal-card">
              <div class="modal-icon">
                <div class="icon-circle reject">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              </div>
              <h2 class="modal-title">¿Estás seguro de rechazar esta solicitud?</h2>
              <p class="modal-message">Esta acción es irreversible y el establecimiento tendrá que enviar sus datos nuevamente.</p>
              <div class="modal-actions">
                <button class="modal-btn cancel" @click="closeRejectModal">No, cancelar</button>
                <button class="modal-btn confirm-reject" @click="confirmReject">Sí, rechazar</button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Toast -->
      <Teleport to="body">
        <Transition name="toast-slide">
          <div v-if="toast.visible" :class="['success-toast', toast.type === 'success' ? 'toast-success' : 'toast-error']">
            <div class="toast-content">
              <div class="toast-icon">
                <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <div class="toast-message"><strong>{{ toast.message }}</strong></div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { adminService } from '../../services/admin.service.js'
import { Search } from 'lucide-vue-next'

const solicitudes = ref([])
const isLoading = ref(false)
const error = ref('')
const processingId = ref(null)
const searchQuery = ref('')
const filterCriterion = ref('')
const statusValue = ref('')
const categoryValue = ref('')
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const selectedSolicitudId = ref(null)
const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimeout = null

watch(filterCriterion, () => {
  statusValue.value = ''
  categoryValue.value = ''
})

const filteredSolicitudes = computed(() => {
  let result = [...solicitudes.value]
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(s => s.nombre_restaurante?.toLowerCase().includes(query))
  }
  if (filterCriterion.value === 'status' && statusValue.value) {
    result = result.filter(s => s.estado?.toLowerCase() === statusValue.value.toLowerCase())
  }
  if (filterCriterion.value === 'category' && categoryValue.value) {
    result = result.filter(s => s.categoria?.toLowerCase() === categoryValue.value.toLowerCase())
  }
  return result
})

const showToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { visible: true, message, type }
  toastTimeout = setTimeout(() => { toast.value.visible = false }, 3000)
}

const openApproveModal = (id) => { selectedSolicitudId.value = id; showApproveModal.value = true }
const closeApproveModal = () => { showApproveModal.value = false; selectedSolicitudId.value = null }
const confirmApprove = async () => {
  const id = selectedSolicitudId.value
  closeApproveModal()
  await processApproval(id)
}

const openRejectModal = (id) => { selectedSolicitudId.value = id; showRejectModal.value = true }
const closeRejectModal = () => { showRejectModal.value = false; selectedSolicitudId.value = null }
const confirmReject = async () => {
  const id = selectedSolicitudId.value
  closeRejectModal()
  await processRejection(id)
}

const processApproval = async (id) => {
  processingId.value = id
  try {
    await adminService.aprobarSolicitud(id)
    showToast('✅ Solicitud aprobada exitosamente', 'success')
    await cargarSolicitudes()
  } catch (err) {
    showToast(err.message || '❌ Error al aprobar la solicitud', 'error')
  } finally {
    processingId.value = null }
}

const processRejection = async (id) => {
  processingId.value = id
  try {
    await adminService.rechazarSolicitud(id)
    showToast('❌ Solicitud rechazada exitosamente', 'error')
    await cargarSolicitudes()
  } catch (err) {
    showToast(err.message || '❌ Error al rechazar la solicitud', 'error')
  } finally {
    processingId.value = null
  }
}

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

onMounted(() => { cargarSolicitudes() })
</script>

<style scoped>
/* ===== BASE ===== */
.admin-requests {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== HEADER ===== */
.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #481827;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #D893A1;
  font-size: 0.9rem;
  margin: 0;
}

/* ===== FILTROS ===== */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .filters-section {
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
  .advanced-filters {
    display: flex;
    gap: 12px;
  }
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1.5px solid #f0ede7;
  border-radius: 60px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #481827;
  box-shadow: 0 0 0 3px rgba(72, 24, 39, 0.08);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.filter-select {
  padding: 10px 16px;
  border: 1.5px solid #f0ede7;
  border-radius: 40px;
  font-size: 0.85rem;
  background: white;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #481827;
}

/* ===== ESTADOS ===== */
.loading-message {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 24px;
  color: #D893A1;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #f0ede7;
  border-top-color: #481827;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-message {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 24px;
  color: #D893A1;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 20px;
}

/* ===== STATUS BADGE ===== */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pendiente {
  background: #FEF3C7;
  color: #D97706;
}

.status-badge.aprobado {
  background: #D1FAE5;
  color: #059669;
}

.status-badge.rechazado {
  background: #FEE2E2;
  color: #DC2626;
}

/* ===== FOTO LINK ===== */
.foto-link {
  color: #D893A1;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
}

.foto-link:hover {
  text-decoration: underline;
}

.no-foto {
  color: #ccc;
}

/* ===== TABLA (desktop) ===== */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.table-container {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

/* CABECERA DE LA TABLA EN ROSA CLARO */
/* CABECERA DE TABLA EN COLOR VINO */
.solicitudes-table thead {
  background: #481827;
  border-bottom: 1px solid #5c2a3a;
}

.solicitudes-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.solicitudes-table td {
  padding: 16px 20px;
  font-size: 0.85rem;
  color: #555;
  border-bottom: 1px solid #f5f2ef;
}

.solicitudes-table tbody tr:hover {
  background: #FAF8F6;
}

.nombre {
  font-weight: 700;
  color: #481827;
}

.email {
  font-family: monospace;
  font-size: 0.8rem;
  color: #888;
}

.categoria {
  text-transform: capitalize;
  color: #D893A1;
  font-weight: 500;
}

.acciones {
  display: flex;
  gap: 8px;
}

.btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-approve {
  background: #D1FAE5;
  color: #059669;
}

.btn-approve:hover:not(:disabled) {
  background: #A7F3D0;
  transform: scale(1.02);
}

.btn-reject {
  background: #FEE2E2;
  color: #DC2626;
}

.btn-reject:hover:not(:disabled) {
  background: #FECACA;
  transform: scale(1.02);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== CARDS (móvil) ===== */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .admin-requests {
    padding: 0 16px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .filter-select {
    width: 100%;
  }

  .advanced-filters {
    flex-direction: column;
    width: 100%;
  }
}

.solicitud-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #f5f2ef;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #f5f2ef;
  gap: 12px;
}

.card-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.card-nombre {
  font-size: 1rem;
  font-weight: 700;
  color: #481827;
  margin: 0;
}

.card-categoria {
  font-size: 0.7rem;
  color: #aaa;
  text-transform: capitalize;
}

.card-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-field {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.card-value {
  font-size: 0.8rem;
  color: #555;
  text-align: right;
  word-break: break-word;
}

.card-value.email {
  font-family: monospace;
  font-size: 0.75rem;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #f5f2ef;
}

.card-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.card-btn-approve {
  background: #D1FAE5;
  color: #059669;
}

.card-btn-approve:hover:not(:disabled) {
  background: #A7F3D0;
}

.card-btn-reject {
  background: #FEE2E2;
  color: #DC2626;
}

.card-btn-reject:hover:not(:disabled) {
  background: #FECACA;
}

.card-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== MODALES ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  background: white;
  border-radius: 32px;
  padding: 28px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-circle.approve {
  background: #D1FAE5;
  color: #059669;
}

.icon-circle.reject {
  background: #FEE2E2;
  color: #DC2626;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.modal-message {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.85rem;
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
}

.modal-btn.confirm-approve {
  background: #059669;
  color: white;
}

.modal-btn.confirm-approve:hover {
  background: #047857;
}

.modal-btn.confirm-reject {
  background: #dc2626;
  color: white;
}

.modal-btn.confirm-reject:hover {
  background: #b91c1c;
}

/* ===== TOAST ===== */
.success-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1100;
  border-radius: 16px;
  padding: 12px 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  min-width: 280px;
}

.toast-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.toast-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-success .toast-icon {
  background: #dcfce7;
  color: #16a34a;
}

.toast-error .toast-icon {
  background: #fee2e2;
  color: #dc2626;
}

.toast-message strong {
  font-size: 0.85rem;
  font-weight: 600;
}

.toast-success .toast-message strong {
  color: #166534;
}

.toast-error .toast-message strong {
  color: #991b1b;
}

/* ===== TRANSICIONES ===== */
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

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .success-toast {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
  }
  
  .modal-card {
    margin: 16px;
    padding: 20px;
  }
  
  .modal-title {
    font-size: 1rem;
  }
  
  .modal-message {
    font-size: 0.8rem;
  }
}
</style>