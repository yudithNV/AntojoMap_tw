<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <AlertCircle :size="48" class="warning-icon" />
        <h2>Solicitud Pendiente de Aprobación</h2>
      </div>

      <div class="modal-body">
        <p class="message">
          Tu solicitud para registrar el restaurante <strong>{{ restauranteName }}</strong> está siendo revisada por nuestro equipo de administradores.
        </p>

        <div class="status-box">
          <div class="status-item">
            <span class="status-label">Estado de tu solicitud:</span>
            <span class="status-value" :class="status.toLowerCase()">{{ status }}</span>
          </div>
        </div>

        <p class="info-text">
          Por favor, espera a que tu solicitud sea aprobada para acceder al panel de control.
        </p>

        <div class="timeline">
          <div class="timeline-item active">
            <div class="timeline-dot"></div>
            <p>Solicitud Enviada</p>
          </div>
          
          <div class="timeline-item" :class="{ active: status === 'APROBADO' }">
            <div class="timeline-dot"></div>
            <p>Aprobado</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="logout" class="btn-logout">
          Cerrar Sesión
        </button>
        <button @click="refreshStatus" class="btn-refresh" :disabled="isRefreshing">
          {{ isRefreshing ? 'Verificando...' : 'Verificar Estado' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'
import { authService } from '../services/auth.service.js'

const router = useRouter()

const isVisible = ref(false)
const restauranteName = ref('')
const status = ref('PENDIENTE')
const isRefreshing = ref(false)

const checkStatus = async () => {
  try {
    const user_id = localStorage.getItem('user_id')
    if (!user_id) return

    const response = await authService.verificarEstadoSolicitud(user_id)
    
    restauranteName.value = response.nombre_restaurante
    status.value = response.estado

    if (response.puede_acceder) {
      isVisible.value = false
    } else {
      isVisible.value = true
    }
  } catch (error) {
    console.error('Error verificando estado:', error)
    isVisible.value = true
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_name')
  localStorage.removeItem('user_role')
  router.push('/login')
}

const refreshStatus = async () => {
  isRefreshing.value = true
  try {
    await checkStatus()
  } finally {
    isRefreshing.value = false
  }
}

onMounted(() => {
  checkStatus()
  // Verificar cada 30 segundos
  setInterval(checkStatus, 30000)
})

defineExpose({
  checkStatus
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.warning-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-body {
  padding: 30px;
}

.message {
  color: #333;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
}

.status-box {
  background: #fef3c7;
  border: 2px solid #fcd34d;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.status-label {
  font-weight: 600;
  color: #333;
}

.status-value {
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.status-value.pendiente {
  background: #fef3c7;
  color: #a16207;
}

.status-value.aprobado {
  background: #dcfce7;
  color: #166534;
}

.status-value.rechazado {
  background: #fee2e2;
  color: #991b1b;
}

.info-text {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 25px;
}

.timeline {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;
  z-index: -1;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 3px solid #e5e7eb;
  transition: all 0.3s;
}

.timeline-item.active .timeline-dot {
  background: #f59e0b;
  border-color: #f59e0b;
}

.timeline-item p {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin: 0;
  font-weight: 600;
}

.timeline-item.active p {
  color: #f59e0b;
}

.modal-footer {
  padding: 20px 30px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-logout,
.btn-refresh {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-logout {
  background: #ef4444;
  color: white;
}

.btn-logout:hover {
  background: #dc2626;
}

.btn-refresh {
  background: #f59e0b;
  color: white;
}

.btn-refresh:hover:not(:disabled) {
  background: #d97706;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
