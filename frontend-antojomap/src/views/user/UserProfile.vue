<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Mi perfil</h1>
      <p class="subtitle">Tu información personal en AntojoMap</p>
    </div>

    <div class="profile-wrapper">
      <!-- Avatar + nombre -->
      <div class="profile-left">
        <div class="avatar">
          <img v-if="perfil.foto_perfil" :src="perfil.foto_perfil" alt="foto de perfil" class="avatar-img" />
          <User v-else :size="48" stroke-width="1.5" />
        </div>
        <h2 class="profile-name">{{ perfil.nombre }}</h2>
        <p class="profile-email">{{ perfil.email }}</p>
        <p v-if="perfil.bio" class="profile-bio">{{ perfil.bio }}</p>

        <button class="btn-edit" @click="abrirEditor">
          <Pen :size="16" :stroke-width="2" class="btn-icon" /> 
          Editar perfil
        </button>
      </div>

      <!-- Info -->
      <div class="profile-right">
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Nombre</span>
            <span class="info-value">{{ perfil.nombre }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ perfil.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Bio</span>
            <span class="info-value">{{ perfil.bio || 'Sin bio' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Miembro desde</span>
            <span class="info-value">{{ formatFecha(perfil.creado_en) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <Teleport to="body">
      <div v-if="editando" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h2>Editar perfil</h2>

          <label>Nombre</label>
          <input v-model="form.nombre" type="text" class="input" />

          <label>URL de foto de perfil</label>
          <input v-model="form.foto_perfil" type="text" class="input" placeholder="https://..." />

          <label>Bio</label>
          <textarea v-model="form.bio" class="input textarea" placeholder="Cuéntanos algo sobre ti..." />

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeModal">Cancelar</button>
            <button class="btn-save" @click="openConfirmModal" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>
        </div>
      </div>
    </Teleport>

    <!-- ===== MODAL DE CONFIRMACIÓN ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showConfirmModal" class="confirm-overlay" @click.self="closeConfirmModal">
          <div class="confirm-modal">
            <div class="confirm-icon">
              <div class="icon-circle-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
            <h3 class="confirm-title">¿Estás seguro de guardar los cambios?</h3>
            <p class="confirm-message">Los cambios se aplicarán a tu perfil inmediatamente.</p>
            <div class="confirm-actions">
              <button class="confirm-btn cancel" @click="closeConfirmModal">No, cancelar</button>
              <button class="confirm-btn save" @click="confirmGuardar">Sí, guardar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== TOAST DE ÉXITO ===== -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="showSuccessToast" class="success-toast">
          <div class="toast-content">
            <div class="toast-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="toast-message">
              <strong>¡Cambios guardados exitosamente!</strong>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { User, Pen } from 'lucide-vue-next'
import { usuariosService } from '../../services/usuarios.service.js'
import { useAuthStore } from '../../stores/auth.store.js'

const authStore = useAuthStore()

// ========== ESTADO ==========
const perfil = ref({
  nombre: '',
  email: '',
  bio: '',
  foto_perfil: '',
  creado_en: ''
})
const editando = ref(false)
const guardando = ref(false)
const error = ref('')
const form = ref({
  nombre: '',
  foto_perfil: '',
  bio: ''
})

// ========== MODAL DE CONFIRMACIÓN ==========
const showConfirmModal = ref(false)

const openConfirmModal = () => {
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
}

// ========== TOAST ==========
const showSuccessToast = ref(false)
let toastTimeout = null

const showToast = () => {
  if (toastTimeout) clearTimeout(toastTimeout)
  showSuccessToast.value = true
  toastTimeout = setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

// ========== FUNCIONES ==========
const cargarPerfil = async () => {
  try {
    const data = await usuariosService.getMiPerfil()
    perfil.value = data
    authStore.actualizarPerfil(data)
  } catch (e) {
    console.error('Error cargando perfil:', e)
  }
}

const abrirEditor = () => {
  form.value = {
    nombre: perfil.value.nombre,
    foto_perfil: perfil.value.foto_perfil || '',
    bio: perfil.value.bio || ''
  }
  error.value = ''
  editando.value = true
}

const closeModal = () => {
  editando.value = false
  error.value = ''
}

// Función real de guardado (ahora llamada desde el modal de confirmación)
const ejecutarGuardado = async () => {
  if (!form.value.nombre.trim()) {
    error.value = 'El nombre es obligatorio'
    return false
  }

  guardando.value = true
  error.value = ''

  try {
    const data = await usuariosService.editarPerfil(form.value)
    
    perfil.value = { ...perfil.value, ...data }
    authStore.actualizarPerfil(data)
    
    // Cerrar ambos modales
    closeModal()
    
    // Mostrar toast de éxito
    showToast()
    
    return true
  } catch (e) {
    error.value = e.message || 'Error al guardar, intenta de nuevo.'
    return false
  } finally {
    guardando.value = false
  }
}

// Manejar clic en "Sí, guardar" del modal de confirmación
const confirmGuardar = async () => {
  closeConfirmModal()
  await ejecutarGuardado()
}

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ========== LIFECYCLE ==========
onMounted(async () => {
  perfil.value = {
    nombre: authStore.nombre || '',
    email: authStore.email || '',
    foto_perfil: authStore.foto || '',
    bio: authStore.bio || '',
    creado_en: ''
  }
  await cargarPerfil()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0;
}

.profile-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

.profile-left {
  background: white;
  border-radius: 15px;
  padding: 32px 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blush), var(--dusty-coral));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.2rem;
  color: var(--plum);
  margin: 0;
  font-weight: 700;
}

.profile-email {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.profile-bio {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  font-style: italic;
}

.btn-edit {
  margin-top: 8px;
  width: 100%;
  padding: 10px;
  border: 2px solid var(--plum);
  background: transparent;
  color: var(--plum);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  display: inline-block;
}

.btn-edit:hover {
  background: linear-gradient(135deg, var(--blush), var(--dusty-coral));
  color: var(--plum);
  border-color: transparent;
}

.profile-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  color: var(--plum);
  font-size: 0.95rem;
}

/* ===== MODAL DE EDICIÓN ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 1.5rem;
  padding: 1.75rem;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal h2 {
  margin: 0 0 8px;
  color: var(--plum);
  font-size: 1.4rem;
}

label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #666;
}

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--plum);
  outline: none;
}

.textarea {
  resize: vertical;
  min-height: 90px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  flex: 1;
  padding: 10px;
  border: 1.5px solid #e8e8e8;
  background: transparent;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-save {
  flex: 1;
  padding: 10px;
  border: none;
  background: var(--plum);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #6b2540;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #c0392b;
  font-size: 0.85rem;
  margin: 0;
}

/* ===== MODAL DE CONFIRMACIÓN ===== */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
}

.confirm-modal {
  background: white;
  border-radius: 1.5rem;
  padding: 1.75rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.confirm-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-circle-warning {
  background-color: #fff3e6;
  border-radius: 9999px;
  padding: 0.75rem;
  color: #f2a359;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.confirm-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.confirm-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.confirm-btn.cancel {
  background-color: #f3f4f6;
  color: #4b5563;
}

.confirm-btn.cancel:hover {
  background-color: #e5e7eb;
}

.confirm-btn.save {
  background-color: var(--plum);
  color: white;
}

.confirm-btn.save:hover {
  background-color: #6b2540;
}

/* ===== TOAST DE ÉXITO ===== */
.success-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1200;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 12px 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  min-width: 280px;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #dcfce7;
  border-radius: 50%;
  color: #16a34a;
}

.toast-message strong {
  font-size: 0.875rem;
  font-weight: 700;
  color: #166534;
  display: block;
}

/* ===== TRANSICIONES ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .confirm-modal,
.modal-fade-leave-active .confirm-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .confirm-modal,
.modal-fade-leave-to .confirm-modal {
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

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .profile-wrapper {
    grid-template-columns: 1fr;
  }

  .success-toast {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
  }

  .confirm-modal {
    margin: 1rem;
  }
}
</style>