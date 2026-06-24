<template>
  <DashboardLayout>
    <div class="profile-page">
      <!-- Header decorativo -->
      <div class="profile-header-bg"></div>

      <div class="page-header">
        <h1>Mi perfil</h1>
        <p class="subtitle">Tu información personal en AntojoMap</p>
      </div>

      <!-- SECCIÓN DE PROMOCIONES DE CUMPLEAÑOS -->
      <div v-if="esCumpleanos" class="birthday-banner">
        <div class="birthday-text">
          <strong>¡Feliz Cumpleaños!</strong>
          <span>Hoy es un día especial. Disfruta tu día al máximo.</span>
        </div>
      </div>

      <div class="profile-wrapper">
        <!-- Lado izquierdo - Avatar y acciones -->
        <div class="profile-left">
          <div class="avatar-container">
            <div class="avatar">
              <img v-if="perfil.foto_perfil" :src="perfil.foto_perfil" alt="foto de perfil" class="avatar-img" />
              <User v-else :size="56" stroke-width="1.5" class="avatar-icon" />
            </div>
            <div class="avatar-decoration"></div>
          </div>
          <h2 class="profile-name">{{ perfil.nombre }}</h2>
          <p class="profile-email">{{ perfil.email }}</p>
          <div v-if="perfil.bio" class="profile-bio-wrapper">
            <p class="profile-bio">{{ perfil.bio }}</p>
          </div>

          <button class="btn-edit" @click="abrirEditor">
            <Pen :size="16" :stroke-width="2" class="btn-icon" /> 
            Editar perfil
          </button>
        </div>

        <!-- Lado derecho - Información detallada -->
        <div class="profile-right">
          <div class="info-card">
            <div class="info-card-header">
              <h3>Información personal</h3>
            </div>
            <div class="info-card-content">
              <div class="info-row">
                <div class="info-label">Nombre completo</div>
                <div class="info-value">{{ perfil.nombre }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Correo electrónico</div>
                <div class="info-value">{{ perfil.email }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Biografía</div>
                <div class="info-value">{{ perfil.bio || 'Sin bio aún' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Fecha de nacimiento</div>
                <div class="info-value">{{ perfil.cumpleanos ? formatearFechaCumple(perfil.cumpleanos) : 'No especificado' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Miembro desde</div>
                <div class="info-value">{{ formatFecha(perfil.creado_en) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición con pasos -->
    <Teleport to="body">
      <div v-if="editando" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>Editar perfil</h2>
            <button class="modal-close" @click="closeModal">×</button>
          </div>

          <div class="modal-body">
            <!-- Paso 1: Información básica -->
            <div v-if="pasoActual === 1" class="step-content">
              <div class="step-title">
                <span class="step-number">1</span>
                <span>Información básica</span>
              </div>
              
              <div class="form-group">
                <label>Nombre completo</label>
                <input v-model="form.nombre" type="text" class="input" placeholder="Tu nombre" />
              </div>

              <div class="form-group">
                <label>Foto de perfil</label>
                <ImageUploader v-model="form.foto_perfil" />
              </div>
            </div>

            <!-- Paso 2: Información adicional -->
            <div v-if="pasoActual === 2" class="step-content">
              <div class="step-title">
                <span class="step-number">2</span>
                <span>Información adicional</span>
              </div>
              
              <div class="form-group">
                <label>Biografía</label>
                <textarea v-model="form.bio" class="input textarea" placeholder="Cuéntanos algo sobre ti..." rows="4" />
              </div>

              <div class="form-group">
                <label>Fecha de nacimiento</label>
                <input v-model="form.cumpleanos" type="date" class="input" />
                <span class="input-hint">Usaremos esto para celebrar tu día especial</span>
              </div>
            </div>

            <!-- Indicador de pasos -->
            <div class="step-indicator">
              <div 
                v-for="n in totalPasos" 
                :key="n"
                class="step-dot"
                :class="{ 
                  active: n === pasoActual,
                  completed: n < pasoActual
                }"
                @click="irAlPaso(n)"
              ></div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Cancelar</button>
            
            <div class="footer-actions">
              <button 
                v-if="pasoActual > 1" 
                class="btn-back" 
                @click="pasoAnterior"
              >
                Anterior
              </button>
              <button 
                v-if="pasoActual < totalPasos" 
                class="btn-next" 
                @click="siguientePaso"
              >
                Siguiente
              </button>
              <button 
                v-else 
                class="btn-save" 
                @click="openConfirmModal" 
                :disabled="guardando"
              >
                {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>
        </div>
      </div>
    </Teleport>

    <!-- Modal de confirmación -->
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
            <h3 class="confirm-title">¿Guardar los cambios?</h3>
            <p class="confirm-message">Los cambios se aplicarán a tu perfil inmediatamente.</p>
            <div class="confirm-actions">
              <button class="confirm-btn cancel" @click="closeConfirmModal">Cancelar</button>
              <button class="confirm-btn save" @click="confirmGuardar">Sí, guardar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast de éxito -->
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
              <strong>¡Perfil actualizado!</strong>
              <span>Tus cambios se guardaron correctamente</span>
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
import ImageUploader from '../../components/ImageUploader.vue'
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
  cumpleanos: '',
  creado_en: ''
})
const editando = ref(false)
const guardando = ref(false)
const error = ref('')
const esCumpleanos = ref(false)

// ========== ESTADO PARA PASOS ==========
const pasoActual = ref(1)
const totalPasos = 2

const form = ref({
  nombre: '',
  foto_perfil: '',
  bio: '',
  cumpleanos: ''
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

// ========== FUNCIONES DE PASOS ==========
const siguientePaso = () => {
  if (pasoActual.value < totalPasos) {
    // Validar paso 1 antes de continuar
    if (pasoActual.value === 1) {
      if (!form.value.nombre.trim()) {
        error.value = 'El nombre es obligatorio'
        return
      }
      error.value = ''
    }
    pasoActual.value++
  }
}

const pasoAnterior = () => {
  if (pasoActual.value > 1) {
    pasoActual.value--
    error.value = ''
  }
}

const irAlPaso = (n) => {
  // Solo permitir ir a pasos anteriores o al actual
  if (n <= pasoActual.value) {
    pasoActual.value = n
    error.value = ''
  }
}

// ========== FUNCIONES PRINCIPALES ==========
const cargarPerfil = async () => {
  try {
    const data = await usuariosService.getMiPerfil()
    perfil.value = data
    authStore.actualizarPerfil(data)
    
    if (data.cumpleanos) {
      const hoy = new Date()
      const cumple = new Date(data.cumpleanos)
      esCumpleanos.value = hoy.getMonth() === cumple.getMonth() && hoy.getDate() === cumple.getDate()
    }
  } catch (e) {
    console.error('Error cargando perfil:', e)
  }
}

const abrirEditor = () => {
  form.value = {
    nombre: perfil.value.nombre,
    foto_perfil: perfil.value.foto_perfil || '',
    bio: perfil.value.bio || '',
    cumpleanos: perfil.value.cumpleanos || ''
  }
  error.value = ''
  pasoActual.value = 1 // Reiniciar al primer paso
  editando.value = true
}

const closeModal = () => {
  editando.value = false
  error.value = ''
  pasoActual.value = 1
}

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
    closeModal()
    showToast()
    return true
  } catch (e) {
    error.value = e.message || 'Error al guardar, intenta de nuevo.'
    return false
  } finally {
    guardando.value = false
  }
}

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

const formatearFechaCumple = (fecha) => {
  if (!fecha) return 'No especificado'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  perfil.value = {
    nombre: authStore.nombre || '',
    email: authStore.email || '',
    foto_perfil: authStore.foto || '',
    bio: authStore.bio || '',
    cumpleanos: authStore.cumpleanos || '',
    creado_en: ''
  }
  await cargarPerfil()
})
</script>

<style scoped>
.profile-page {
  position: relative;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header decorativo */
.profile-header-bg {
  position: absolute;
  top: -30px;
  left: -24px;
  right: -24px;
  height: 220px;
  background: linear-gradient(135deg, #481827 0%, #6B1B3C 100%);
  border-radius: 0 0 48px 48px;
  z-index: 0;
}

.page-header {
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
  padding-top: 30px;
}

.page-header h1 {
  color: white;
  font-size: 2.2rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin: 0;
}

/* Banner de cumpleaños */
.birthday-banner {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border-radius: 24px;
  padding: 18px 28px;
  margin-bottom: 40px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.birthday-text {
  display: flex;
  flex-direction: column;
}

.birthday-text strong {
  font-size: 1.1rem;
  color: #92400E;
}

.birthday-text span {
  font-size: 0.9rem;
  color: #B45309;
}

/* Profile wrapper */
.profile-wrapper {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 32px;
  align-items: start;
}

/* Lado izquierdo */
.profile-left {
  background: white;
  border-radius: 32px;
  padding: 36px 28px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-left:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D893A1, #E8D5B5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-icon {
  color: white;
}

.avatar-decoration {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #481827, #6B1B3C);
  z-index: 1;
  opacity: 0.25;
}

.profile-name {
  font-size: 1.5rem;
  color: #481827;
  margin: 0;
  font-weight: 700;
}

.profile-email {
  font-size: 0.9rem;
  color: #888;
  margin: 0;
}

.profile-bio-wrapper {
  background: #f8f6f4;
  border-radius: 18px;
  padding: 14px 18px;
  width: 100%;
  margin-top: 4px;
}

.profile-bio {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-style: italic;
  line-height: 1.5;
}

.btn-edit {
  margin-top: 8px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #481827, #6B1B3C);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #5a1a2e, #7d2142);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(72, 24, 39, 0.3);
}

/* Lado derecho */
.profile-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
}

.info-card-header {
  padding: 24px 32px;
  background: #faf8f6;
  border-bottom: 1px solid #f0ede7;
}

.info-card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #481827;
}

.info-card-content {
  padding: 8px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 32px;
  border-bottom: 1px solid #f5f2ef;
  transition: background 0.2s;
}

.info-row:hover {
  background: #fefaf8;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #666;
  font-size: 0.95rem;
}

.info-value {
  color: #481827;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: right;
  max-width: 55%;
  word-break: break-word;
}

/* ========== MODAL DE EDICIÓN CON PASOS ========== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 32px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #481827, #6B1B3C);
  flex-shrink: 0;
}

.modal-header h2 {
  margin: 0;
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
}

/* Scroll personalizado */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #D893A1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #B87384;
}

/* Paso content */
.step-content {
  animation: fadeSlideIn 0.3s ease;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #481827;
  margin-bottom: 24px;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #481827, #6B1B3C);
  color: white;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 700;
  flex-shrink: 0;
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #481827;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 14px 18px;
  border: 1.5px solid #e8e8e8;
  border-radius: 16px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.input:focus {
  border-color: #481827;
  box-shadow: 0 0 0 3px rgba(72, 24, 39, 0.1);
}

.textarea {
  resize: vertical;
  min-height: 100px;
}

.input-hint {
  display: block;
  font-size: 0.75rem;
  color: #aaa;
  margin-top: 6px;
}

/* Indicador de pasos */
.step-indicator {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0ede7;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.step-dot:hover {
  transform: scale(1.2);
}

.step-dot.active {
  background: #481827;
  width: 24px;
  border-radius: 4px;
}

.step-dot.completed {
  background: #6B1B3C;
}

/* Modal footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  background: #faf8f6;
  border-top: 1px solid #f0ede7;
  flex-shrink: 0;
  gap: 14px;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel {
  padding: 12px 24px;
  border: 1.5px solid #e8e8e8;
  background: white;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-back {
  padding: 12px 24px;
  border: 1.5px solid #e8e8e8;
  background: white;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-back:hover {
  background: #f5f5f5;
}

.btn-next {
  padding: 12px 28px;
  border: none;
  background: linear-gradient(135deg, #481827, #6B1B3C);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(72, 24, 39, 0.3);
}

.btn-save {
  padding: 12px 28px;
  border: none;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #c0392b;
  font-size: 0.85rem;
  margin: 0;
  padding: 0 28px 20px;
  text-align: center;
}

/* ========== MODAL DE CONFIRMACIÓN ========== */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
}

.confirm-modal {
  background: white;
  border-radius: 32px;
  padding: 32px;
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
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.confirm-message {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-btn {
  padding: 0.7rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
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
  background: linear-gradient(135deg, #481827, #6B1B3C);
  color: white;
}

.confirm-btn.save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(72, 24, 39, 0.3);
}

/* ========== TOAST ========== */
.success-toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1200;
  background: linear-gradient(135deg, #10B981, #059669);
  border-radius: 20px;
  padding: 16px 24px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15);
  min-width: 300px;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
}

.toast-message {
  display: flex;
  flex-direction: column;
}

.toast-message strong {
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
}

.toast-message span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
}

/* ========== TRANSICIONES ========== */
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

/* ========== RESPONSIVE ========== */
@media (max-width: 900px) {
  .profile-page {
    padding: 0 20px;
  }

  .profile-wrapper {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .profile-left {
    max-width: 420px;
    margin: 0 auto;
  }

  .profile-header-bg {
    left: -20px;
    right: -20px;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 0 16px;
  }

  .profile-header-bg {
    height: 180px;
    left: -16px;
    right: -16px;
  }

  .page-header h1 {
    font-size: 1.6rem;
  }

  .profile-left {
    padding: 28px 20px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 16px 24px;
  }

  .info-value {
    text-align: left;
    max-width: 100%;
  }

  .info-card-header {
    padding: 18px 24px;
  }

  .info-card-header h3 {
    font-size: 1rem;
  }

  .modal {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .modal-header h2 {
    font-size: 1.2rem;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
    padding: 16px 20px;
  }

  .footer-actions {
    width: 100%;
    justify-content: center;
  }

  .btn-cancel {
    width: 100%;
    justify-content: center;
  }

  .btn-back,
  .btn-next,
  .btn-save {
    flex: 1;
    text-align: center;
    padding: 12px 16px;
  }

  .success-toast {
    bottom: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
  }

  .confirm-modal {
    margin: 1rem;
  }
}
</style>