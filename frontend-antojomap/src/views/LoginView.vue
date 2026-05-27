<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left side - Image/Branding -->
      <div class="auth-left">
        <div class="auth-visual">
          <div class="food-image">
            <Ham :size="200" stroke-width="1.5" />
          </div>
        </div>
      </div>

      <!-- Right side - Form -->
      <div class="auth-right">
        <div class="auth-form-wrapper">
          <div class="auth-header">
            <div class="logo">
              <div class="logo-icon">
                <UtensilsCrossed :size="32" stroke-width="2" />
              </div>
              <div class="logo-text">
                <span class="logo-main">AntojoMap</span>
                <span class="logo-sub">Foodies</span>
              </div>
            </div>
          </div>

          <div class="form-content">
            <h2>Bienvenido de nuevo</h2>
            <p class="subtitle">Ingresa tus credenciales para acceder a los mejores menús.</p>

            <form @submit.prevent="handleLogin" novalidate>
              <!-- Campo Email -->
              <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="tu@correo.com"
                  :class="{ 'input-error': emailError }"
                  @input="clearEmailError"
                  required
                />
              </div>

              <!-- Campo Contraseña -->
              <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="password-input-wrapper">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    :class="{ 'input-error': passwordError || serverError }"
                    @input="validatePassword"
                    required
                  />
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="showPassword" :size="20" stroke-width="2" />
                    <EyeOff v-else :size="20" stroke-width="2" />
                  </button>
                </div>
                
                <!-- 🔥 MENSAJE DE ERROR DINÁMICO 🔥 -->
                <div 
                  v-if="passwordError" 
                  class="error-alert"
                  role="alert"
                  aria-live="polite"
                >
                  <div class="error-alert-content">
                    <div class="error-icon-wrapper">
                      <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                    </div>
                    <span class="error-text">{{ passwordError }}</span>
                  </div>
                </div>
                
                <div 
                  v-else-if="serverError" 
                  class="error-alert server-error"
                  role="alert"
                  aria-live="polite"
                >
                  <div class="error-alert-content">
                    <div class="error-icon-wrapper">
                      <XCircle :size="18" class="error-icon" stroke-width="2" />
                    </div>
                    <span class="error-text">{{ serverError }}</span>
                  </div>
                </div>
              </div>

              <!-- Form options -->
              <div class="form-options">
                <label class="checkbox">
                  <input v-model="form.remember" type="checkbox" />
                  Recuérdame
                </label>
                <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" class="btn-submit" :disabled="isLoading || !!passwordError">
                {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
              </button>
            </form>

            <div class="auth-footer">
              <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de éxito -->
    <Transition name="modal-fade-scale">
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-content">
            <div class="success-icon-wrapper">
              <div class="success-icon-circle">
                <CheckCircle :size="56" stroke-width="1.5" class="check-icon" />
              </div>
            </div>
            <h3 class="modal-title">¡Ingreso Exitoso!</h3>
            <p class="modal-message">{{ modalMessage }}</p>
            <div class="modal-spinner">
              <div class="spinner"></div>
              <span>Redirigiendo...</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Eye, EyeOff, Ham, AlertCircle, XCircle, CheckCircle } from 'lucide-vue-next'
import { authService } from '../services/auth.service.js'
import { useAuthStore } from '../stores/auth.store.js'

const authStore = useAuthStore()
const router = useRouter()

// ========== ESTADO ==========
const showPassword = ref(false)
const isLoading = ref(false)
const passwordError = ref('')
const serverError = ref('')
const emailError = ref('')
const showSuccessModal = ref(false)
const modalMessage = ref('¡Bienvenido de nuevo! Iniciando sesión...')
let redirectTimer = null

const form = ref({
  email: '',
  password: '',
  remember: false
})

// 🔥 LISTA DE CUENTAS CON EXCEPCIÓN (requieren solo 6 caracteres) 🔥
const EXCEPTION_EMAILS = ['admin2@test.com', 'pizza@test.com']

// 🔥 FUNCIÓN PARA OBTENER LONGITUD MÍNIMA SEGÚN EMAIL 🔥
const getPasswordMinLength = () => {
  const email = form.value.email?.trim().toLowerCase()
  
  // Si el email está en la lista de excepciones, requiere solo 6 caracteres
  if (EXCEPTION_EMAILS.includes(email)) {
    return 6
  }
  // Para todos los demás, requiere 8 caracteres
  return 8
}

// 🔥 COMPUTED PARA MOSTRAR EL MENSAJE DINÁMICO EN EL ERROR 🔥
const passwordMinLengthMessage = computed(() => {
  const minLength = getPasswordMinLength()
  if (minLength === 6) {
    return 'La contraseña debe tener al menos 6 caracteres (cuenta de prueba).'
  }
  return 'La contraseña debe tener al menos 8 caracteres.'
})

// ========== VALIDACIÓN DE CONTRASEÑA DINÁMICA ==========
const validatePassword = () => {
  const password = form.value.password
  const minLength = getPasswordMinLength()
  
  if (!password) {
    passwordError.value = ''
    return
  }
  
  if (password.length < minLength) {
    passwordError.value = passwordMinLengthMessage.value
  } else {
    passwordError.value = ''
  }
  
  if (serverError.value) {
    serverError.value = ''
  }
}

const clearEmailError = () => {
  emailError.value = ''
}

// ========== MANEJAR LOGIN ==========
const handleLogin = async () => {
  const { email, password, remember } = form.value
  
  // Limpiar errores previos
  passwordError.value = ''
  serverError.value = ''
  emailError.value = ''
  
  // Validar campos vacíos
  if (!email || !password) {
    if (!email) emailError.value = 'El correo electrónico es requerido'
    if (!password) passwordError.value = 'La contraseña es requerida'
    return
  }
  
  // 🔥 VALIDAR LONGITUD DE CONTRASEÑA CON LA REGLA DINÁMICA 🔥
  const minLength = getPasswordMinLength()
  if (password.length < minLength) {
    passwordError.value = passwordMinLengthMessage.value
    return
  }

  isLoading.value = true
  
  try {
    const response = await authService.login(email, password)
    
    let normalizedRole = response.usuario.rol.toLowerCase()
    if (normalizedRole === 'restaurante') normalizedRole = 'restaurant'

    authStore.setUsuario({
      token: response.token,
      id: response.usuario.id,
      email: response.usuario.email,
      nombre: response.usuario.nombre,
      rol: normalizedRole,
      foto_perfil: response.usuario.foto_perfil || ''
    })

    if (response.usuario.restaurante_id) {
      localStorage.setItem('restaurante_id', response.usuario.restaurante_id)
    }

    if (remember) {
      localStorage.setItem('remembered_email', email)
    } else {
      localStorage.removeItem('remembered_email')
    }

    isLoading.value = false
    showSuccessModal.value = true
    modalMessage.value = '¡Bienvenido de nuevo! Iniciando sesión...'
    
    const pendingCategory = localStorage.getItem('pending_category')
    let targetRoute = '/user/feed'
    
    if (normalizedRole === 'admin') {
      targetRoute = '/admin/dashboard'
    } else if (normalizedRole === 'restaurant') {
      targetRoute = '/restaurant/dashboard'
    } else if (pendingCategory) {
      localStorage.removeItem('pending_category')
      targetRoute = { path: '/user/feed', query: { categoria: pendingCategory } }
    }
    
    redirectTimer = setTimeout(() => {
      showSuccessModal.value = false
      router.push(targetRoute)
    }, 2000)
    
  } catch (error) {
    serverError.value = error.message || 'El email o la contraseña son incorrectos.'
    isLoading.value = false
  }
}

// ========== RECUPERAR EMAIL GUARDADO ==========
const loadRememberedEmail = () => {
  const remembered = localStorage.getItem('remembered_email')
  if (remembered) {
    form.value.email = remembered
    form.value.remember = true
    // Re-validar contraseña cuando cambia el email
    validatePassword()
  }
}

const handleForgotPassword = () => {
  router.push('/forgot-password')
}

const cleanup = () => {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
  }
}

// 🔥 OBSERVAR CAMBIOS EN EMAIL Y CONTRASEÑA 🔥
watch(() => form.value.email, () => {
  // Re-validar contraseña cuando cambia el email (la longitud mínima puede cambiar)
  validatePassword()
})

watch(() => form.value.password, () => {
  validatePassword()
})

// Cargar email recordado
loadRememberedEmail()

import { onUnmounted } from 'vue'
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* ===== ESTILOS EXISTENTES (MANTENER IGUAL) ===== */
.auth-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(255, 251, 242, 0.95), #fffbf2 0%, #f7ede5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #4a2c2c;
  padding-top: 130px;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1000px;
  min-height: 640px;
  background: rgba(255, 251, 242, 0.88);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 26px 65px rgba(107, 33, 33, 0.14);
  border: 1px solid rgba(255, 251, 242, 0.9);
  backdrop-filter: blur(16px);
}

.auth-left {
  background: linear-gradient(180deg, #6B2121 0%, #A33333 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), transparent 42%);
}

.food-image {
  position: relative;
  z-index: 1;
  font-size: 15rem;
  opacity: 0.92;
  filter: drop-shadow(0 14px 36px rgba(0, 0, 0, 0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
}

.auth-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 38px;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 420px;
  animation: fadeInUp 0.8s ease forwards;
  opacity: 0;
  transform: translateY(24px);
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.logo-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: #fff;
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-main {
  font-size: 1.45rem;
  font-weight: 800;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #3a1f1f;
}

.logo-sub {
  font-size: 0.98rem;
  color: #6b2121;
  font-weight: 600;
}

.form-content h2 {
  font-size: 2rem;
  color: #4a1f1f;
  margin: 0 0 12px 0;
  text-align: center;
  font-weight: 800;
}

.subtitle {
  color: #6b2121;
  font-size: 1rem;
  text-align: center;
  margin: 0 0 30px 0;
  line-height: 1.6;
  font-weight: 500;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
  color: #5a2c2c;
  margin-bottom: 10px;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 16px 18px;
  border: 1px solid rgba(107, 33, 33, 0.18);
  border-radius: 18px;
  font-size: 1rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
  box-sizing: border-box;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.88);
  color: #422424;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #A33333;
  box-shadow: 0 0 0 4px rgba(163, 51, 51, 0.12);
  background: #fff;
}

.input-error {
  border-color: #dc2626 !important;
  background-color: #fef2f2 !important;
}

.input-error:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 46px;
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s ease, background-color 0.2s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #6b2121;
}

.toggle-password:hover {
  opacity: 1;
  transform: translateY(-1px);
  background-color: rgba(163, 51, 51, 0.08);
}

.toggle-password:active {
  transform: scale(0.98);
}

.error-alert {
  margin-top: 10px;
  animation: slideDown 0.25s ease-out;
}

.error-alert-content {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 10px 14px;
  transition: all 0.2s ease;
}

.error-alert.server-error .error-alert-content {
  background-color: #fff1f0;
  border-color: #ffccc7;
}

.error-icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  color: #dc2626;
  stroke-width: 2;
}

.error-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #991b1b;
  line-height: 1.4;
  flex: 1;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 0.95rem;
}

.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  color: #4c3434;
  font-weight: 500;
}

.checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #A33333;
}

.forgot-password {
  color: #A33333;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.2s ease;
  font-size: 0.95rem;
}

.forgot-password:hover {
  color: #6b2121;
}

.btn-submit {
  width: 100%;
  padding: 16px 18px;
  background: #A33333;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease;
  margin-bottom: 20px;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  box-shadow: 0 12px 28px rgba(163, 51, 51, 0.16);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.01);
  background-color: #d34b2f;
  box-shadow: 0 16px 28px rgba(163, 51, 51, 0.22);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
  box-shadow: 0 12px 20px rgba(163, 51, 51, 0.18);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-footer {
  text-align: center;
  font-size: 0.95rem;
  color: #6b2121;
  font-weight: 500;
}

.auth-footer a {
  color: #A33333;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.2s ease;
}

.auth-footer a:hover {
  color: #6b2121;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@media (max-width: 768px) {
  .auth-page {
    padding-top: 100px;
  }

  .auth-container {
    grid-template-columns: 1fr;
    height: auto;
    max-width: 100%;
    border-radius: 18px;
  }

  .auth-left {
    display: none;
  }

  .auth-right {
    padding: 30px 20px;
  }

  .auth-form-wrapper {
    max-width: 100%;
  }

  .form-content h2 {
    font-size: 1.75rem;
  }

  .form-options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .error-alert-content {
    padding: 8px 12px;
  }
  
  .error-text {
    font-size: 0.8rem;
  }
}

/* ========== ESTILOS DEL MODAL DE ÉXITO ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #fffbf5 0%, #fff5ea 100%);
  border-radius: 32px;
  padding: 40px 48px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(163, 51, 51, 0.2);
}

.success-icon-wrapper {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.success-icon-circle {
  width: 88px;
  height: 88px;
  background: linear-gradient(135deg, #A33333, #6B2121);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 0.5s ease-out;
}

.check-icon {
  color: white;
  animation: checkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #4a1f1f;
  margin-bottom: 12px;
  font-family: 'Poppins', sans-serif;
}

.modal-message {
  font-size: 1rem;
  color: #6b2121;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #A33333;
  font-weight: 500;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(163, 51, 51, 0.2);
  border-top-color: #A33333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-fade-scale-enter-active,
.modal-fade-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-scale-enter-from,
.modal-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-fade-scale-enter-to,
.modal-fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>