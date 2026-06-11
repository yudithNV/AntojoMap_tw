<template>
  <div class="reset-password-page">
    <div class="reset-container">
      <div class="reset-card">
        <button class="back-btn" @click="goBack">← Volver</button>
        
        <div class="icon-wrapper">
          <Lock :size="64" stroke-width="1.5" />
        </div>
        
        <h2>Crear nueva contraseña</h2>
        <p class="description">Ingresa tu nueva contraseña a continuación</p>
        
        <form @submit.prevent="handleResetPassword" novalidate>
          <!-- Nueva Contraseña -->
          <div class="form-group">
            <label for="password">Nueva contraseña</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :class="{ 'input-error': formErrors.password }"
                @blur="validatePasswordField"
                @input="validatePasswordField"
                :disabled="loading"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <Eye v-if="showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
            <div v-if="formErrors.password" class="error-alert" role="alert">
              <div class="error-alert-content">
                <div class="error-icon-wrapper">
                  <AlertCircle :size="18" class="error-icon" />
                </div>
                <span class="error-text">{{ formErrors.password }}</span>
              </div>
            </div>
            <div v-if="password && !formErrors.password" class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :class="passwordStrength.class"></div>
              </div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <div class="password-input-wrapper">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :class="{ 'input-error': formErrors.confirmPassword }"
                @blur="validateConfirmPasswordField"
                @input="validateConfirmPasswordField"
                :disabled="loading"
              />
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <Eye v-if="showConfirmPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
            <div v-if="formErrors.confirmPassword" class="error-alert" role="alert">
              <div class="error-alert-content">
                <div class="error-icon-wrapper">
                  <AlertCircle :size="18" class="error-icon" />
                </div>
                <span class="error-text">{{ formErrors.confirmPassword }}</span>
              </div>
            </div>
          </div>
          
          <button type="submit" class="btn-submit" :disabled="loading || !isFormValid">
            {{ loading ? 'Actualizando...' : 'Restablecer contraseña' }}
          </button>
        </form>
        
        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const token = ref('')

// Misma regex que el registro
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/

// Errores
const formErrors = ref({
  password: '',
  confirmPassword: ''
})

// ========== VALIDACIÓN DE CONTRASEÑA ==========
const validatePasswordField = () => {
  const value = password.value
  
  if (!value) {
    formErrors.value.password = 'La contraseña es requerida'
    return false
  }
  
  if (value.length < 8) {
    formErrors.value.password = 'La contraseña debe tener al menos 8 caracteres'
    return false
  }
  
  if (!PASSWORD_REGEX.test(value)) {
    formErrors.value.password = 'La contraseña debe incluir al menos una mayúscula, una minúscula y un símbolo (!@#$%^&*, etc.)'
    return false
  }
  
  formErrors.value.password = ''
  return true
}

// ========== VALIDACIÓN DE CONFIRMACIÓN ==========
const validateConfirmPasswordField = () => {
  const value = confirmPassword.value
  
  if (!value) {
    formErrors.value.confirmPassword = 'Debes confirmar tu contraseña'
    return false
  }
  
  if (value !== password.value) {
    formErrors.value.confirmPassword = 'Las contraseñas no coinciden'
    return false
  }
  
  formErrors.value.confirmPassword = ''
  return true
}

// ========== INDICADOR DE SEGURIDAD ==========
const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return { class: '', text: '' }
  
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[\W_]/.test(pwd)) score++
  
  if (score === 4) return { class: 'strong', text: 'Contraseña segura' }
  if (score === 3) return { class: 'medium', text: 'Contraseña media' }
  return { class: 'weak', text: 'Contraseña débil' }
})

// ========== VALIDACIÓN COMPLETA ==========
const isFormValid = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    !formErrors.value.password &&
    !formErrors.value.confirmPassword &&
    password.value === confirmPassword.value &&
    password.value.length >= 8 &&
    PASSWORD_REGEX.test(password.value)
  )
})

// ========== TOKEN ==========
onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    message.value = 'Token inválido o expirado'
    messageType.value = 'error'
  }
})

const goBack = () => {
  router.push('/login')
}

// ========== RESET PASSWORD ==========
const handleResetPassword = async () => {
  const isPasswordValid = validatePasswordField()
  const isConfirmValid = validateConfirmPasswordField()
  
  if (!isPasswordValid || !isConfirmValid) {
    return
  }
  
  loading.value = true
  message.value = ''
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token: token.value, 
        newPassword: password.value 
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al restablecer la contraseña')
    }
    
    message.value = data.mensaje || 'Contraseña actualizada exitosamente'
    messageType.value = 'success'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7ede5 0%, #fffbf2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.reset-container {
  width: 100%;
  max-width: 500px;
}

.reset-card {
  background: white;
  border-radius: 24px;
  padding: 48px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  background: none;
  border: none;
  color: #A33333;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(163, 51, 51, 0.1);
}

.icon-wrapper {
  text-align: center;
  margin-bottom: 24px;
  color: #A33333;
}

h2 {
  text-align: center;
  color: #4a1f1f;
  font-size: 1.8rem;
  margin-bottom: 12px;
  font-weight: 800;
}

.description {
  text-align: center;
  color: #6b2121;
  margin-bottom: 32px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 600;
  color: #4a1f1f;
  margin-bottom: 8px;
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper input {
  width: 100%;
  padding: 14px 48px 14px 16px;
  border: 2px solid #e5e0db;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
}

.password-input-wrapper input:focus {
  outline: none;
  border-color: #A33333;
  box-shadow: 0 0 0 3px rgba(163, 51, 51, 0.1);
}

.input-error {
  border-color: #dc2626 !important;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
}

.error-alert {
  margin-top: 8px;
  animation: slideDown 0.2s ease-out;
}

.error-alert-content {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 10px 14px;
}

.error-icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  color: #dc2626;
}

.error-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #991b1b;
  line-height: 1.4;
  flex: 1;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  width: 0%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-fill.weak {
  width: 33%;
  background-color: #ef4444;
}

.strength-fill.medium {
  width: 66%;
  background-color: #f59e0b;
}

.strength-fill.strong {
  width: 100%;
  background-color: #10b981;
}

.strength-text {
  font-size: 0.7rem;
  color: #6b7280;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #A33333;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.btn-submit:hover:not(:disabled) {
  background: #6B2121;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>