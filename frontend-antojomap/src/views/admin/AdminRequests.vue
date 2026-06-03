<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Solicitudes de Restaurantes</h1>
      <p class="subtitle">Revisa y aprueba/rechaza nuevas solicitudes</p>
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
    <div v-if="isLoading" class="loading-message"><p>Cargando solicitudes...</p></div>

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
          <!-- Cabecera del card -->
          <div class="card-header">
            <div class="card-header-left">
              <h3 class="card-nombre">{{ solicitud.nombre_restaurante }}</h3>
              <span class="card-categoria">{{ solicitud.categoria }}</span>
            </div>
            <span class="status-badge" :class="solicitud.estado.toLowerCase()">{{ solicitud.estado }}</span>
          </div>

          <!-- Cuerpo del card -->
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

          <!-- Acciones -->
          <div class="card-actions" v-if="solicitud.estado === 'PENDIENTE'">
            <button
              class="card-btn card-btn-reject"
              @click="openRejectModal(solicitud.id)"
              :disabled="processingId === solicitud.id"
            >
              ✕ Rechazar
            </button>
            <button
              class="card-btn card-btn-approve"
              @click="openApproveModal(solicitud.id)"
              :disabled="processingId === solicitud.id"
            >
              ✓ Aprobar
            </button>
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
/* ===== HEADER ===== */
.page-header { margin-bottom: 24px; }
.page-header h1 { color: var(--plum); font-size: 2rem; margin: 0 0 8px 0; }
.subtitle { color: var(--dusty-coral); font-size: 0.95rem; margin: 0; }

/* ===== FILTROS ===== */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .filters-section {
    flex-direction: row;
    align-items: center;
  }
  .advanced-filters {
    flex-direction: row;
  }
}

.search-bar { position: relative; flex: 1; }

.search-input {
  width: 100%;
  padding: 11px 16px 11px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  box-sizing: border-box;
  transition: all 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: var(--plum);
  box-shadow: 0 0 0 3px rgba(72, 24, 39, 0.08);
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.advanced-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  background: white;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 180px;
}
.filter-select:focus {
  outline: none;
  border-color: var(--plum);
}
.dynamic-select { animation: fadeIn 0.2s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ===== ESTADOS ===== */
.loading-message, .empty-message {
  background: white;
  padding: 40px 20px;
  border-radius: 12px;
  text-align: center;
  color: var(--dusty-coral);
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c00;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* ===== STATUS BADGE (compartido tabla y cards) ===== */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.status-badge.pendiente  { background: #fff3cd; color: #856404; }
.status-badge.aprobado   { background: #d4edda; color: #155724; }
.status-badge.rechazado  { background: #f8d7da; color: #721c24; }

/* ===== FOTO LINK ===== */
.foto-link { color: var(--dusty-coral); text-decoration: none; font-weight: 600; }
.foto-link:hover { text-decoration: underline; }
.no-foto { color: #ccc; }

/* ===================================================
   TABLA — solo visible en desktop
=================================================== */
.desktop-only { display: block; }
.mobile-only  { display: none; }

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  overflow-x: auto;
}

.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}
.solicitudes-table thead { background: #f8f5f2; border-bottom: 2px solid #e8e0d8; }
.solicitudes-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 700;
  color: var(--plum);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.solicitudes-table tbody tr { border-bottom: 1px solid #f0ece8; transition: background 0.15s; }
.solicitudes-table tbody tr:hover { background: #faf8f6; }
.solicitudes-table td { padding: 14px 16px; font-size: 0.9rem; color: #333; }

.nombre   { font-weight: 700; color: var(--plum); }
.email    { color: #666; font-family: monospace; font-size: 0.82rem; }
.categoria { text-transform: capitalize; color: #666; }
.telefono  { color: #666; }
.foto     { text-align: center; }

.acciones { display: flex; gap: 8px; justify-content: flex-end; }
.btn {
  width: 34px; height: 34px;
  border: none; border-radius: 8px;
  font-size: 1rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.btn-approve { background: #d4edda; color: #155724; }
.btn-approve:hover:not(:disabled) { background: #b8dfc4; transform: scale(1.05); }
.btn-reject  { background: #f8d7da; color: #721c24; }
.btn-reject:hover:not(:disabled)  { background: #f0bbbf; transform: scale(1.05); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ===================================================
   CARDS — solo visible en móvil
=================================================== */
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.solicitud-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  overflow: hidden;
  border: 1px solid #f0ece8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 16px 10px 16px;
  border-bottom: 1px solid #f5f0eb;
  gap: 12px;
}

.card-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.card-nombre {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--plum);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-categoria {
  font-size: 0.78rem;
  color: #999;
  text-transform: capitalize;
}

.card-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-field {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
}

.card-value {
  font-size: 0.85rem;
  color: #333;
  text-align: right;
  word-break: break-word;
}

.card-value.email {
  font-family: monospace;
  font-size: 0.8rem;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #f5f0eb;
}

.card-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}
.card-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.card-btn-approve {
  background: #d4edda;
  color: #155724;
}
.card-btn-approve:hover:not(:disabled) { background: #b8dfc4; }

.card-btn-reject {
  background: #f8d7da;
  color: #721c24;
}
.card-btn-reject:hover:not(:disabled) { background: #f0bbbf; }

/* ===== SWITCH tabla ↔ cards ===== */
@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only  { display: flex; }

  .page-header h1 { font-size: 1.5rem; }
  .filter-select { min-width: auto; width: 100%; }
}

/* ===== MODALES ===== */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.modal-card {
  background: white; border-radius: 1.5rem;
  padding: 1.75rem; max-width: 420px; width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  text-align: center;
}
.modal-icon { display: flex; justify-content: center; margin-bottom: 1rem; }
.icon-circle { border-radius: 9999px; padding: 0.75rem; display: inline-flex; align-items: center; justify-content: center; }
.icon-circle.approve { background: #dcfce7; color: #16a34a; }
.icon-circle.reject  { background: #fee2e2; color: #dc2626; }
.modal-title   { font-size: 1.2rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem; }
.modal-message { font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; line-height: 1.5; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: center; }
.modal-btn {
  padding: 0.6rem 1.5rem; border-radius: 9999px;
  font-weight: 600; font-size: 0.875rem;
  cursor: pointer; border: none; transition: all 0.2s;
}
.modal-btn.cancel          { background: #f3f4f6; color: #4b5563; }
.modal-btn.cancel:hover    { background: #e5e7eb; }
.modal-btn.confirm-approve { background: #16a34a; color: white; }
.modal-btn.confirm-approve:hover { background: #15803d; }
.modal-btn.confirm-reject  { background: #dc2626; color: white; }
.modal-btn.confirm-reject:hover  { background: #b91c1c; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-active .modal-card, .modal-fade-leave-active .modal-card { transition: transform 0.25s ease, opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-card, .modal-fade-leave-to .modal-card { transform: scale(0.95); opacity: 0; }

/* ===== TOAST ===== */
.success-toast {
  position: fixed; top: 24px; right: 24px;
  z-index: 1100; border-radius: 12px;
  padding: 12px 20px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  min-width: 280px;
}
.toast-success { background: #f0fdf4; border: 1px solid #bbf7d0; }
.toast-error   { background: #fef2f2; border: 1px solid #fecaca; }
.toast-content { display: flex; align-items: center; gap: 12px; }
.toast-icon {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.toast-success .toast-icon { background: #dcfce7; color: #16a34a; }
.toast-error   .toast-icon { background: #fee2e2; color: #dc2626; }
.toast-message strong { font-size: 0.875rem; font-weight: 600; }
.toast-success .toast-message strong { color: #166534; }
.toast-error   .toast-message strong { color: #991b1b; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(100%); }

@media (max-width: 768px) {
  .success-toast { top: 16px; right: 16px; left: 16px; min-width: auto; }
  .modal-card { padding: 1.25rem; }
  .modal-title { font-size: 1rem; }
  .modal-message { font-size: 0.8rem; }
}
</style>