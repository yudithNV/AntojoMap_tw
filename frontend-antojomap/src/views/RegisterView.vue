<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left side - Branding (Igual, solo ajusté padding) -->
      <div class="auth-left">
        <div class="auth-visual">
          <div class="food-image">
            <User v-if="activeTab === 'usuario'" :size="180" stroke-width="1.5" />
            <UtensilsCrossed v-else :size="180" stroke-width="1.5" />
          </div>
        </div>
      </div>

      <!-- Right side - Form -->
      <div class="auth-right">
        <!-- Logo FIJO arriba del todo, como en la imagen original -->
        <div class="auth-header-fixed">
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

        <!-- TABS debajo del logo y ANTES del contenido scrolleable -->
        <div class="tabs-navigation">
          <div class="tabs-container">
            <button
              :class="['tab-button', { active: activeTab === 'usuario' }]"
              @click="activeTab = 'usuario'"
            >
              <Utensils :size="18" stroke-width="2" />
              Usuario
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'restaurante' }]"
              @click="activeTab = 'restaurante'"
            >
              <Store :size="18" stroke-width="2" />
              Restaurante
            </button>
          </div>
        </div>

        <!-- Contenido que SÍ puede tener scroll, pero con mejor padding -->
        <div class="form-scroll-content">
          <div class="auth-form-wrapper">
            <!-- Usuario Form -->
            <template v-if="activeTab === 'usuario'">
              <h2>Crea tu cuenta</h2>
              <p class="subtitle">Únete a la comunidad foodie más grande</p>

              <form @submit.prevent="handleUserRegister">
                <div class="form-group">
                  <label for="user-name">Nombre Completo</label>
                  <input
                    id="user-name"
                    v-model="userForm.name"
                    type="text"
                    placeholder="Tu nombre"
                    required
                    @blur="handleFieldBlur('user', 'name')"
                  />
                  <p v-if="touched.user.name && formErrors.user.name" class="field-error">{{ formErrors.user.name }}</p>
                </div>

                <div class="form-group">
                  <label for="user-email">Correo Electrónico</label>
                  <input
                    id="user-email"
                    v-model="userForm.email"
                    type="email"
                    placeholder="tu@correo.com"
                    required
                    @blur="handleFieldBlur('user', 'email')"
                  />
                  <p v-if="touched.user.email && formErrors.user.email" class="field-error">{{ formErrors.user.email }}</p>
                </div>

                <div class="form-group">
                  <label for="user-password">Contraseña</label>
                  <div class="password-input-wrapper">
                    <input
                      id="user-password"
                      v-model="userForm.password"
                      :type="showUserPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      required
                      @blur="handleFieldBlur('user', 'password')"
                    />
                    <button type="button" class="toggle-password" @click="showUserPassword = !showUserPassword">
                      <Eye v-if="showUserPassword" :size="20" stroke-width="2" />
                      <EyeOff v-else :size="20" stroke-width="2" />
                    </button>
                  </div>
                  <p v-if="touched.user.password && formErrors.user.password" class="field-error">{{ formErrors.user.password }}</p>
                </div>

                <button type="submit" class="btn-submit" :disabled="!isUserFormValid || isLoading">{{ isLoading ? 'Registrando...' : 'Registrarse' }}</button>
                <div v-if="registerFeedback.message && activeTab === 'usuario'" class="form-feedback" :class="registerFeedback.type" aria-live="polite">
                  {{ registerFeedback.message }}
                </div>
              </form>
            </template>

            <!-- Restaurante Form -->
            <template v-else>
              <h2>Registra tu Restaurante</h2>
              <p class="subtitle">Únete como vendedor y crece con AntojoMap</p>

              <form @submit.prevent="handleRestaurantRegister">
                <div class="form-group">
                  <label for="rest-name">Nombre del Restaurante</label>
                  <input
                    id="rest-name"
                    v-model="restaurantForm.name"
                    type="text"
                    placeholder="Nombre de tu restaurante"
                    required
                    @blur="handleFieldBlur('restaurant', 'name')"
                  />
                  <p v-if="touched.restaurant.name && formErrors.restaurant.name" class="field-error">{{ formErrors.restaurant.name }}</p>
                </div>

                <div class="form-group">
                  <label for="rest-address">Dirección</label>
                  <input
                    id="rest-address"
                    v-model="restaurantForm.address"
                    type="text"
                    placeholder="Dirección del restaurante"
                    required
                    @blur="handleFieldBlur('restaurant', 'address')"
                  />
                  <p v-if="touched.restaurant.address && formErrors.restaurant.address" class="field-error">{{ formErrors.restaurant.address }}</p>
                </div>

                <div class="form-group">
                  <label for="rest-phone">Teléfono</label>
                  <input
                    id="rest-phone"
                    v-model="restaurantForm.phone"
                    type="tel"
                    placeholder="+56 9 XXXX XXXX"
                    required
                    @blur="handleFieldBlur('restaurant', 'phone')"
                  />
                  <p v-if="touched.restaurant.phone && formErrors.restaurant.phone" class="field-error">{{ formErrors.restaurant.phone }}</p>
                </div>

                <div class="form-group">
                  <label for="rest-category">Categoría</label>
                  <select
                    id="rest-category"
                    v-model="restaurantForm.category"
                    required
                    @blur="handleFieldBlur('restaurant', 'category')"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="tacos">Tacos</option>
                    <option value="burgers">Hamburguesas</option>
                    <option value="sushi">Sushi</option>
                    <option value="pizza">Pizza</option>
                    <option value="postres">Postres</option>
                    <option value="veggie">Veggie</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="rest-email">Correo para el Administrador de Restaurante</label>
                  <input
                    id="rest-email"
                    v-model="restaurantForm.email"
                    type="email"
                    placeholder="correo@negocio.com"
                    required
                    @blur="handleFieldBlur('restaurant', 'email')"
                  />
                  <p v-if="touched.restaurant.email && formErrors.restaurant.email" class="field-error">{{ formErrors.restaurant.email }}</p>
                </div>

                <div class="form-group">
                  <label for="rest-password">Contraseña de Acceso</label>
                  <input
                    id="rest-password"
                    v-model="restaurantForm.password"
                    type="password"
                    placeholder="••••••••"
                    required
                    @blur="handleFieldBlur('restaurant', 'password')"
                  />
                  <p v-if="touched.restaurant.password && formErrors.restaurant.password" class="field-error">{{ formErrors.restaurant.password }}</p>
                </div>

                <div class="form-group">
                  <label for="rest-photo">Foto del Establecimiento</label>
                  <input
                    id="rest-photo"
                    v-model="restaurantForm.foto_comprobante"
                    type="text"
                    placeholder="URL de la foto (ej: https://..."
                    @blur="handleFieldBlur('restaurant', 'foto_comprobante')"
                  />
                  <p class="field-hint">Por ahora ingresa la URL de una foto. Pronto podrás subir archivos directamente.</p>
                  <p v-if="touched.restaurant.foto_comprobante && formErrors.restaurant.foto_comprobante" class="field-error">{{ formErrors.restaurant.foto_comprobante }}</p>
                </div>

                <button type="submit" class="btn-submit" :disabled="!isRestaurantFormValid || isLoading">{{ isLoading ? 'Enviando...' : 'Registrar Restaurante' }}</button>
                <div v-if="registerFeedback.message && activeTab === 'restaurante'" class="form-feedback" :class="registerFeedback.type" aria-live="polite">
                  {{ registerFeedback.message }}
                </div>
              </form>
            </template>

            <div class="auth-footer">
              <p>¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Utensils, Eye, EyeOff, User, Store } from 'lucide-vue-next'
import { authService } from '../services/auth.service.js'

const router = useRouter()
const activeTab = ref('usuario')
const showUserPassword = ref(false)
const isLoading = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const userForm = ref({
  name: '',
  email: '',
  password: ''
})

const restaurantForm = ref({
  name: '',
  address: '',
  phone: '',
  category: '',
  email: '',
  password: '',
  foto_comprobante: ''
})

const formErrors = reactive({
  user: {
    name: '',
    email: '',
    password: ''
  },
  restaurant: {
    name: '',
    address: '',
    phone: '',
    category: '',
    email: '',
    password: '',
    foto_comprobante: ''
  }
})

const touched = reactive({
  user: {
    name: false,
    email: false,
    password: false
  },
  restaurant: {
    name: false,
    address: false,
    phone: false,
    category: false,
    email: false,
    password: false,
    foto_comprobante: false
  }
})

const registerFeedback = ref({ message: '', type: '' })

const validateField = (type, field, value) => {
  if (!value || !String(value).trim()) {
    return 'Este campo es obligatorio'
  }

  if (field === 'email' && !emailRegex.test(value)) {
    return 'Ingresa un correo válido'
  }

  if (field === 'password' && value.length < 8) {
    return 'Debe tener al menos 8 caracteres'
  }

  return ''
}

const validateForm = (type) => {
  const source = type === 'user' ? userForm.value : restaurantForm.value
  const fields = Object.keys(formErrors[type])

  fields.forEach((field) => {
    formErrors[type][field] = validateField(type, field, source[field])
  })

  return !fields.some((field) => Boolean(formErrors[type][field]))
}

const touchFormFields = (type) => {
  Object.keys(touched[type]).forEach((field) => {
    touched[type][field] = true
  })
}

const handleFieldBlur = (type, field) => {
  touched[type][field] = true
  const source = type === 'user' ? userForm.value : restaurantForm.value
  formErrors[type][field] = validateField(type, field, source[field])
}

const isUserFormValid = computed(() => {
  return (
    userForm.value.name.trim() &&
    emailRegex.test(userForm.value.email) &&
    userForm.value.password.length >= 8 &&
    !Object.values(formErrors.user).some(Boolean)
  )
})

const isRestaurantFormValid = computed(() => {
  return (
    restaurantForm.value.name.trim() &&
    restaurantForm.value.address.trim() &&
    restaurantForm.value.phone.trim() &&
    restaurantForm.value.category.trim() &&
    emailRegex.test(restaurantForm.value.email) &&
    restaurantForm.value.password.length >= 8 &&
    !Object.values(formErrors.restaurant).some(Boolean)
  )
})

const handleUserRegister = async () => {
  touchFormFields('user')

  if (!validateForm('user')) {
    registerFeedback.value.message = 'Corrige los campos marcados'
    registerFeedback.value.type = 'error'
    return
  }

  isLoading.value = true
  try {
    const response = await authService.registro(userForm.value.name, userForm.value.email, userForm.value.password)
    
    // Auto-login: Guardar token y datos
    localStorage.setItem('token', response.token)
    localStorage.setItem('user_id', response.usuario.id)
    localStorage.setItem('user_email', response.usuario.email)
    localStorage.setItem('user_name', response.usuario.nombre)
    const normalizedRole = response.usuario.rol.toLowerCase()
    localStorage.setItem('user_role', normalizedRole)
    
    registerFeedback.value.message = '¡Bienvenido! Redirigiendo a tu dashboard...'
    registerFeedback.value.type = 'success'
    
    setTimeout(() => router.push('/user/feed'), 1500)
  } catch (error) {
    registerFeedback.value.message = error.message || 'Error en el registro'
    registerFeedback.value.type = 'error'
  } finally {
    isLoading.value = false
  }
}

const handleRestaurantRegister = async () => {
  touchFormFields('restaurant')

  if (!validateForm('restaurant')) {
    registerFeedback.value.message = 'Corrige los campos marcados'
    registerFeedback.value.type = 'error'
    return
  }

  isLoading.value = true
  try {
    await authService.solicitarRestaurante({
      nombre_restaurante: restaurantForm.value.name,
      direccion: restaurantForm.value.address,
      telefono: restaurantForm.value.phone,
      categoria: restaurantForm.value.category,
      email: restaurantForm.value.email,
      password: restaurantForm.value.password,
      foto_comprobante: restaurantForm.value.foto_comprobante
    })
    registerFeedback.value.message = '✅ ¡Solicitud enviada! El administrador revisará tu registro pronto. Redirigiendo a login...'
    registerFeedback.value.type = 'success'
    setTimeout(() => router.push('/login'), 3000)
  } catch (error) {
    registerFeedback.value.message = error.message || 'Error en la solicitud'
    registerFeedback.value.type = 'error'
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
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1024px;
  min-height: 720px;
  background: rgba(255, 251, 242, 0.86);
  border: 1px solid rgba(255, 251, 242, 0.85);
  box-shadow: 0 28px 70px rgba(107, 33, 33, 0.14);
  border-radius: 20px;
  backdrop-filter: blur(18px);
  overflow: hidden;
}

.auth-left {
  background: linear-gradient(180deg, #6B2121 0%, #A33333 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.14), transparent 38%);
}

.food-image {
  position: relative;
  z-index: 1;
  font-size: 14rem;
  opacity: 0.92;
  filter: drop-shadow(0 14px 36px rgba(0, 0, 0, 0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
}

.auth-right {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.auth-header-fixed {
  padding: 32px 40px 12px;
  text-align: center;
  flex-shrink: 0;
}

.logo {
  display: inline-flex;
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
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
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

.tabs-navigation {
  padding: 0 40px;
  margin-bottom: 22px;
  flex-shrink: 0;
}

.tabs-container {
  display: flex;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(107, 33, 33, 0.1);
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 14px 18px;
  background: transparent;
  border: none;
  color: #6b2121;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.tab-button.active {
  background: rgba(163, 51, 51, 0.14);
  color: #A33333;
}

.form-scroll-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 40px 40px;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease forwards;
  opacity: 0;
  transform: translateY(24px);
}

.auth-form-wrapper h2 {
  font-size: 2rem;
  color: #4a1f1f;
  margin: 0 0 14px;
  text-align: center;
  font-weight: 800;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.subtitle {
  color: #6b2121;
  font-size: 1rem;
  text-align: center;
  margin: 0 0 32px;
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

.field-error {
  color: #A33333;
  font-size: 0.85rem;
  margin-top: 8px;
  line-height: 1.4;
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

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input[type="email"],
input[type="password"],
input[type="text"],
input[type="tel"],
select {
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
input[type="text"]:focus,
input[type="tel"]:focus,
select:focus {
  outline: none;
  border-color: #A33333;
  box-shadow: 0 0 0 4px rgba(163, 51, 51, 0.12);
  background: #fff;
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B2121' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 44px;
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
  box-shadow: 0 12px 28px rgba(163, 51, 51, 0.15);
}

.btn-submit:hover {
  transform: scale(1.03);
  filter: brightness(1.06);
  box-shadow: 0 18px 32px rgba(163, 51, 51, 0.2);
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
input[type="text"],
input[type="tel"],
select,
.password-input-wrapper input {
  transition: border-color 0.24s ease, box-shadow 0.24s ease, background-color 0.24s ease, transform 0.24s ease;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus,
input[type="tel"]:focus,
select:focus,
.password-input-wrapper input:focus {
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

.tab-button:hover {
  transform: translateY(-1px);
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

@media (max-width: 900px) {
  .auth-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .auth-left {
    min-height: 240px;
  }
}

@media (max-width: 768px) {
  .auth-container {
    border-radius: 18px;
    margin-top: 20px;
  }

  .auth-left {
    display: none;
  }

  .auth-header-fixed {
    padding: 28px 22px 12px;
  }

  .tabs-navigation {
    padding: 0 22px;
    margin-bottom: 18px;
  }

  .form-scroll-content {
    overflow-y: visible;
    padding: 0 20px 30px;
  }

  .auth-form-wrapper {
    max-width: 100%;
    padding-top: 8px;
  }

  .auth-form-wrapper h2 {
    font-size: 1.75rem;
  }
}
</style>