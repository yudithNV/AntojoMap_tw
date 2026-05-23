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

            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="password-input-wrapper">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
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
              </div>

              <div class="form-options">
                <label class="checkbox">
                  <input v-model="form.remember" type="checkbox" />
                  Recuérdame
                </label>
                <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" class="btn-submit" :disabled="isLoading">
                {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
              </button>

              <div v-if="loginFeedback.message" class="form-feedback" :class="loginFeedback.type" aria-live="polite">
                {{ loginFeedback.message }}
              </div>
            </form>

            <div class="auth-footer">
              <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Eye, EyeOff, Ham } from 'lucide-vue-next'
import { authService } from '../services/auth.service.js'
import { useAuthStore } from '../stores/auth.store.js'

const authStore = useAuthStore()
const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)
const form = ref({
  email: '',
  password: '',
  remember: false
})
const loginFeedback = ref({ message: '', type: '' })

const handleLogin = async () => {
  const { email, password } = form.value
  loginFeedback.value.message = ''
  loginFeedback.value.type = ''

  if (!email || !password) {
    loginFeedback.value.message = 'Por favor completa todos los campos'
    loginFeedback.value.type = 'error'
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

    loginFeedback.value.message = 'Ingreso exitoso'
    loginFeedback.value.type = 'success'

    setTimeout(() => {
      const pendingCategory = localStorage.getItem('pending_category')
      
      if (normalizedRole === 'admin') {
        router.push('/admin/dashboard')
      } else if (normalizedRole === 'restaurant') {
        router.push('/restaurant/dashboard')
      } else {
        if (pendingCategory) {
          localStorage.removeItem('pending_category')
          router.push({ path: '/user/feed', query: { categoria: pendingCategory } })
        } else {
          router.push('/user/feed')
        }
      }
    }, 300)
  } catch (error) {
    loginFeedback.value.message = error.message || 'Credenciales incorrectas'
    loginFeedback.value.type = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(255, 251, 242, 0.95), #fffbf2 0%, #f7ede5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #4a2c2c;
  /* 🔥 PADDING TOP MÁS GRANDE - BAJA MÁS EL CONTENIDO 🔥 */
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

.form-feedback {
  margin-top: 18px;
  font-size: 0.95rem;
  line-height: 1.4;
}

.form-feedback.error {
  color: #A33333;
}

.form-feedback.success {
  color: #1B6A3A;
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
  transition: opacity 0.2s ease;
  color: #6b2121;
}

.toggle-password:hover {
  opacity: 1;
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

.btn-submit:hover {
  transform: scale(1.03);
  filter: brightness(1.06);
  box-shadow: 0 18px 32px rgba(163, 51, 51, 0.22);
}

.btn-submit:active {
  transform: scale(0.99);
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

input[type="email"],
input[type="password"],
input[type="text"] {
  transition: border-color 0.24s ease, box-shadow 0.24s ease, background-color 0.24s ease, transform 0.24s ease;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #C64445;
  background-color: #fff7f1;
  box-shadow: 0 0 0 4px rgba(163, 51, 51, 0.12);
  transform: translateY(-1px);
}

.btn-submit {
  transition: transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease, color 0.22s ease;
}

.btn-submit:hover {
  transform: translateY(-1px) scale(1.01);
  background-color: #d34b2f;
  box-shadow: 0 16px 28px rgba(163, 51, 51, 0.22);
}

.btn-submit:active {
  transform: translateY(0) scale(0.99);
  box-shadow: 0 12px 20px rgba(163, 51, 51, 0.18);
}

.toggle-password:hover {
  transform: translateY(-1px);
  background-color: rgba(163, 51, 51, 0.08);
}

.toggle-password:active {
  transform: scale(0.98);
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
}
</style>