<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left side - Branding -->
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

        <div class="form-scroll-content">
          <div class="auth-form-wrapper">
            <!-- Usuario Form -->
            <template v-if="activeTab === 'usuario'">
              <h2>Crea tu cuenta</h2>
              <p class="subtitle">Únete a la comunidad foodie más grande</p>

              <form @submit.prevent="handleUserRegister" novalidate>
                <div class="form-group">
                  <label for="user-name">Nombre Completo</label>
                  <input
                    id="user-name"
                    v-model="userForm.name"
                    type="text"
                    placeholder="Tu nombre"
                    :class="{ 'input-error': formErrors.user.name }"
                    @blur="validateUserField('name')"
                    @input="validateUserField('name')"
                  />
                  <div 
                    v-if="formErrors.user.name" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.user.name }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="user-email">Correo Electrónico</label>
                  <input
                    id="user-email"
                    v-model="userForm.email"
                    type="email"
                    placeholder="tu@correo.com"
                    :class="{ 'input-error': formErrors.user.email }"
                    @blur="validateUserField('email')"
                    @input="validateUserField('email')"
                  />
                  <div 
                    v-if="formErrors.user.email" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.user.email }}</span>
                    </div>
                  </div>
                </div>

                <!-- Campo: Contraseña con validación SEGURA (FLEXIBLE) -->
                <div class="form-group">
                  <label for="user-password">Contraseña</label>
                  <div class="password-input-wrapper">
                    <input
                      id="user-password"
                      v-model="userForm.password"
                      :type="showUserPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      :class="{ 'input-error': formErrors.user.password }"
                      @blur="validateUserField('password')"
                      @input="validateUserField('password')"
                    />
                    <button type="button" class="toggle-password" @click="showUserPassword = !showUserPassword">
                      <Eye v-if="showUserPassword" :size="20" stroke-width="2" />
                      <EyeOff v-else :size="20" stroke-width="2" />
                    </button>
                  </div>
                  
                  <div 
                    v-if="formErrors.user.password" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.user.password }}</span>
                    </div>
                  </div>
                  
                  <div v-if="userForm.password && !formErrors.user.password" class="password-strength">
                    <div class="strength-bar">
                      <div class="strength-fill" :class="userPasswordStrength.class"></div>
                    </div>
                    <span class="strength-text">{{ userPasswordStrength.text }}</span>
                  </div>
                </div>

                <button type="submit" class="btn-submit" :disabled="!isUserFormValid || isLoading">
                  {{ isLoading ? 'Registrando...' : 'Registrarse' }}
                </button>
              </form>
            </template>

            <!-- Restaurante Form -->
            <template v-else>
              <h2>Registra tu Restaurante</h2>
              <p class="subtitle">Únete como vendedor y crece con AntojoMap</p>

              <form @submit.prevent="handleRestaurantRegister" novalidate>
                <div class="form-group">
                  <label for="rest-name">Nombre del Restaurante</label>
                  <input
                    id="rest-name"
                    v-model="restaurantForm.name"
                    type="text"
                    placeholder="Nombre de tu restaurante"
                    :class="{ 'input-error': formErrors.restaurant.name }"
                    @blur="validateRestaurantField('name')"
                    @input="validateRestaurantField('name')"
                  />
                  <div 
                    v-if="formErrors.restaurant.name" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.restaurant.name }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rest-address">Dirección</label>
                  <input
                    id="rest-address"
                    v-model="restaurantForm.address"
                    type="text"
                    placeholder="Dirección del restaurante"
                    :class="{ 'input-error': formErrors.restaurant.address }"
                    @blur="validateRestaurantField('address')"
                    @input="validateRestaurantField('address')"
                  />
                  <div 
                    v-if="formErrors.restaurant.address" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.restaurant.address }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rest-phone">Teléfono</label>
                  <input
                    id="rest-phone"
                    v-model="restaurantForm.phone"
                    type="tel"
                    placeholder="+591 XXXX XXXX"
                    :class="{ 'input-error': formErrors.restaurant.phone }"
                    @blur="validateRestaurantField('phone')"
                    @input="validateRestaurantField('phone')"
                  />
                  <div 
                    v-if="formErrors.restaurant.phone" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.restaurant.phone }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rest-category">Categoría</label>
                  <select
                    id="rest-category"
                    v-model="restaurantForm.category"
                    :class="{ 'input-error': formErrors.restaurant.category }"
                    @blur="validateRestaurantField('category')"
                    @change="validateRestaurantField('category')"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                      {{ cat.nombre }}
                    </option>
                  </select>
                  <div 
                    v-if="formErrors.restaurant.category" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.restaurant.category }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rest-email">Correo para el Administrador de Restaurante</label>
                  <input
                    id="rest-email"
                    v-model="restaurantForm.email"
                    type="email"
                    placeholder="correo@negocio.com"
                    :class="{ 'input-error': formErrors.restaurant.email }"
                    @blur="validateRestaurantField('email')"
                    @input="validateRestaurantField('email')"
                  />
                  <div 
                    v-if="formErrors.restaurant.email" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.restaurant.email }}</span>
                    </div>
                  </div>
                </div>

                <!-- Campo: Contraseña de Acceso con validación SEGURA (FLEXIBLE) -->
                <div class="form-group">
                  <label for="rest-password">Contraseña de Acceso</label>
                  <div class="password-input-wrapper">
                    <input
                      id="rest-password"
                      v-model="restaurantForm.password"
                      :type="showRestaurantPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      :class="{ 'input-error': formErrors.restaurant.password }"
                      @blur="validateRestaurantField('password')"
                      @input="validateRestaurantField('password')"
                    />
                    <button 
                      type="button" 
                      class="toggle-password" 
                      @click="showRestaurantPassword = !showRestaurantPassword"
                    >
                      <Eye v-if="showRestaurantPassword" :size="20" stroke-width="2" />
                      <EyeOff v-else :size="20" stroke-width="2" />
                    </button>
                  </div>
                  
                  <div 
                    v-if="formErrors.restaurant.password" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.restaurant.password }}</span>
                    </div>
                  </div>
                  
                  <div v-if="restaurantForm.password && !formErrors.restaurant.password" class="password-strength">
                    <div class="strength-bar">
                      <div class="strength-fill" :class="restaurantPasswordStrength.class"></div>
                    </div>
                    <span class="strength-text">{{ restaurantPasswordStrength.text }}</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rest-photo">Foto del Establecimiento</label>
                  <input
                    id="rest-photo"
                    v-model="restaurantForm.foto_comprobante"
                    type="text"
                    placeholder="URL de la foto (ej: https://...)"
                    :class="{ 'input-error': formErrors.restaurant.foto_comprobante }"
                    @blur="validateRestaurantField('foto_comprobante')"
                    @input="validateRestaurantField('foto_comprobante')"
                  />
                  <p class="field-hint">Por ahora ingresa la URL de una foto. Pronto podrás subir archivos directamente.</p>
                  <div 
                    v-if="formErrors.restaurant.foto_comprobante" 
                    class="error-alert"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="error-alert-content">
                      <div class="error-icon-wrapper">
                        <AlertCircle :size="18" class="error-icon" stroke-width="2" />
                      </div>
                      <span class="error-text">{{ formErrors.restaurant.foto_comprobante }}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn-submit" :disabled="!isRestaurantFormValid || isLoading">
                  {{ isLoading ? 'Enviando...' : 'Registrar Restaurante' }}
                </button>
              </form>
            </template>

            <div class="auth-footer">
              <p>¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de éxito para usuario -->
    <Transition name="toast-slide">
      <div v-if="showSuccessToast" class="success-toast">
        <div class="toast-content">
          <div class="toast-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="toast-message">
            <strong>¡Cuenta creada exitosamente!</strong>
            <p>Redirigiendo...</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de éxito para restaurante -->
    <Transition name="modal-fade">
      <div v-if="showRequestSuccessModal" class="success-modal-overlay" @click.self="closeSuccessModal">
        <div class="success-modal-card">
          <div class="success-icon-animated">
            <div class="success-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <h2 class="success-modal-title">¡Solicitud Enviada Exitosamente!</h2>
          <p class="success-modal-message">
            Estamos procesando los datos de tu establecimiento.<br>
            Pronto podrás gestionar tu menú.
          </p>
          <div class="progress-bar-container">
            <div class="progress-bar"></div>
          </div>
          <p class="redirect-message">Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Utensils, Eye, EyeOff, User, Store, AlertCircle } from 'lucide-vue-next'
import { authService } from '../services/auth.service.js'
import { api } from '../services/api.js'

const categorias = ref([])
const router = useRouter()
const activeTab = ref('usuario')
const showUserPassword = ref(false)
const showRestaurantPassword = ref(false)
const isLoading = ref(false)

// ===== TOAST =====
const showSuccessToast = ref(false)
let toastTimeout = null

const showToast = () => {
  showSuccessToast.value = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    showSuccessToast.value = false
    router.push('/login')
  }, 3000)
}

// ===== MODAL PARA RESTAURANTE =====
const showRequestSuccessModal = ref(false)
let redirectTimeout = null

const showSuccessModal = () => {
  showRequestSuccessModal.value = true
  redirectTimeout = setTimeout(() => {
    closeSuccessModal()
    router.push('/login')
  }, 3000)
}

const closeSuccessModal = () => {
  showRequestSuccessModal.value = false
  if (redirectTimeout) {
    clearTimeout(redirectTimeout)
    redirectTimeout = null
  }
}

// ===== NUEVA EXPRESIÓN REGULAR FLEXIBLE =====
// Verifica: Mayúscula + Minúscula + Carácter especial (en CUALQUIER orden)
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ========== FORMULARIOS ==========
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

// ========== ERRORES ==========
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

// ========== INDICADORES DE SEGURIDAD ==========
const userPasswordStrength = computed(() => {
  const password = userForm.value.password
  if (!password) return { class: '', text: '' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[\W_]/.test(password)) score++
  
  if (score === 4) return { class: 'strong', text: '✓ Contraseña segura' }
  if (score === 3) return { class: 'medium', text: '⚡ Contraseña media' }
  return { class: 'weak', text: '⚠️ Contraseña débil' }
})

const restaurantPasswordStrength = computed(() => {
  const password = restaurantForm.value.password
  if (!password) return { class: '', text: '' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[\W_]/.test(password)) score++
  
  if (score === 4) return { class: 'strong', text: '✓ Contraseña segura' }
  if (score === 3) return { class: 'medium', text: '⚡ Contraseña media' }
  return { class: 'weak', text: '⚠️ Contraseña débil' }
})

// ========== FUNCIONES DE VALIDACIÓN ==========
// Usuario
const validateUserField = (field) => {
  const value = userForm.value[field]
  
  if (!value || !String(value).trim()) {
    formErrors.user[field] = 'Este campo es obligatorio'
    return false
  }

  if (field === 'email' && !emailRegex.test(value)) {
    formErrors.user[field] = 'Ingresa un correo válido'
    return false
  }

  if (field === 'password') {
    if (value.length < 8) {
      formErrors.user[field] = 'La contraseña debe tener al menos 8 caracteres'
      return false
    }
    if (!PASSWORD_REGEX.test(value)) {
      formErrors.user[field] = 'La contraseña debe incluir al menos una mayúscula, una minúscula y un símbolo (!@#$%^&*, etc.)'
      return false
    }
  }

  formErrors.user[field] = ''
  return true
}

// Restaurante
const validateRestaurantField = (field) => {
  const value = restaurantForm.value[field]
  
  if (field !== 'foto_comprobante' && (!value || !String(value).trim())) {
    formErrors.restaurant[field] = 'Este campo es obligatorio'
    return false
  }

  if (field === 'email' && value && !emailRegex.test(value)) {
    formErrors.restaurant[field] = 'Ingresa un correo válido'
    return false
  }

  if (field === 'password') {
    if (value && value.length < 8) {
      formErrors.restaurant[field] = 'La contraseña debe tener al menos 8 caracteres'
      return false
    }
    if (value && !PASSWORD_REGEX.test(value)) {
      formErrors.restaurant[field] = 'La contraseña debe incluir al menos una mayúscula, una minúscula y un símbolo (!@#$%^&*, etc.)'
      return false
    }
  }

  formErrors.restaurant[field] = ''
  return true
}

// ========== WATCHERS ==========
watch(() => userForm.value.name, (newVal) => {
  if (newVal && newVal.trim()) formErrors.user.name = ''
})

watch(() => userForm.value.email, (newVal) => {
  if (newVal && newVal.trim() && emailRegex.test(newVal)) {
    formErrors.user.email = ''
  }
})

watch(() => userForm.value.password, (newVal) => {
  if (newVal && newVal.length >= 8 && PASSWORD_REGEX.test(newVal)) {
    formErrors.user.password = ''
  }
})

watch(() => restaurantForm.value.name, (newVal) => {
  if (newVal && newVal.trim()) formErrors.restaurant.name = ''
})

watch(() => restaurantForm.value.address, (newVal) => {
  if (newVal && newVal.trim()) formErrors.restaurant.address = ''
})

watch(() => restaurantForm.value.phone, (newVal) => {
  if (newVal && newVal.trim()) formErrors.restaurant.phone = ''
})

watch(() => restaurantForm.value.category, (newVal) => {
  if (newVal && newVal.trim()) formErrors.restaurant.category = ''
})

watch(() => restaurantForm.value.email, (newVal) => {
  if (newVal && newVal.trim() && emailRegex.test(newVal)) {
    formErrors.restaurant.email = ''
  }
})

watch(() => restaurantForm.value.password, (newVal) => {
  if (newVal && newVal.length >= 8 && PASSWORD_REGEX.test(newVal)) {
    formErrors.restaurant.password = ''
  }
})

watch(() => restaurantForm.value.foto_comprobante, (newVal) => {
  if (newVal && newVal.trim()) formErrors.restaurant.foto_comprobante = ''
})

// ========== VALIDACIÓN COMPLETA ==========
const validateAllUserFields = () => {
  return validateUserField('name') && validateUserField('email') && validateUserField('password')
}

const validateAllRestaurantFields = () => {
  return (
    validateRestaurantField('name') &&
    validateRestaurantField('address') &&
    validateRestaurantField('phone') &&
    validateRestaurantField('category') &&
    validateRestaurantField('email') &&
    validateRestaurantField('password')
  )
}

// ========== VALIDACIÓN BOTÓN ==========
const isUserFormValid = computed(() => {
  return (
    userForm.value.name.trim() &&
    emailRegex.test(userForm.value.email) &&
    userForm.value.password.length >= 8 &&
    PASSWORD_REGEX.test(userForm.value.password) &&
    !formErrors.user.name &&
    !formErrors.user.email &&
    !formErrors.user.password
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
    PASSWORD_REGEX.test(restaurantForm.value.password) &&
    !formErrors.restaurant.name &&
    !formErrors.restaurant.address &&
    !formErrors.restaurant.phone &&
    !formErrors.restaurant.category &&
    !formErrors.restaurant.email &&
    !formErrors.restaurant.password
  )
})

// ========== HANDLERS ==========
const handleUserRegister = async () => {
  if (!validateAllUserFields()) {
    return
  }

  isLoading.value = true
  try {
    const response = await authService.registro(userForm.value.name, userForm.value.email, userForm.value.password)
    
    localStorage.setItem('token', response.token)
    localStorage.setItem('user_id', response.usuario.id)
    localStorage.setItem('user_email', response.usuario.email)
    localStorage.setItem('user_name', response.usuario.nombre)
    localStorage.setItem('user_role', response.usuario.rol.toLowerCase())
    
    showToast()
    
  } catch (error) {
    console.error('Error en registro:', error)
    alert(error.message || 'Error en el registro. Intenta de nuevo.')
  } finally {
    isLoading.value = false
  }
}

const handleRestaurantRegister = async () => {
  if (!validateAllRestaurantFields()) {
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
    
    showSuccessModal()
  } catch (error) {
    console.error('Error en solicitud:', error)
    alert(error.message || 'Error en la solicitud. Intenta de nuevo.')
  } finally {
    isLoading.value = false
  }
}

// ========== CARGAR CATEGORÍAS ==========
onMounted(async () => {
  try {
    const data = await api.get('/restaurantes/categorias')
    categorias.value = data
  } catch (e) {
    console.error('Error cargando categorías:', e)
  }
})
</script>

<style scoped>
/* ===== ESTILOS COMPLETOS ===== */
.auth-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(255, 251, 242, 0.95), #fffbf2 0%, #f7ede5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #4a2c2c;
  padding-top: 120px;
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

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-form-wrapper h2 {
  font-size: 2rem;
  color: #4a1f1f;
  margin: 0 0 14px;
  text-align: center;
  font-weight: 800;
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

.field-hint {
  color: #6b2121;
  font-size: 0.8rem;
  margin-top: 6px;
  opacity: 0.7;
}

.input-error {
  border-color: #dc2626 !important;
  background-color: #fef2f2 !important;
}

.input-error:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1) !important;
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
  stroke-width: 2;
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

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
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

input:focus, select:focus {
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
  box-shadow: 0 12px 28px rgba(163, 51, 51, 0.15);
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

.success-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
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

.toast-message p {
  font-size: 0.75rem;
  color: #15803d;
  margin: 0;
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

.success-modal-overlay {
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

.success-modal-card {
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.success-icon-animated {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.success-circle {
  background-color: #dcfce7;
  border-radius: 9999px;
  padding: 1rem;
  color: #16a34a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: scaleUp 0.4s ease-out;
}

.success-circle svg {
  animation: checkDraw 0.5s ease-out 0.2s both;
  stroke-width: 2.5;
}

.success-modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 0.75rem;
}

.success-modal-message {
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.progress-bar-container {
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 100%;
  width: 100%;
  background-color: #16a34a;
  border-radius: 9999px;
  animation: progressShrink 3s linear forwards;
}

.redirect-message {
  font-size: 0.75rem;
  color: #9ca3af;
}

@keyframes scaleUp {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes checkDraw {
  from { stroke-dasharray: 50; stroke-dashoffset: 50; opacity: 0; }
  to { stroke-dasharray: 50; stroke-dashoffset: 0; opacity: 1; }
}

@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .success-modal-card,
.modal-fade-leave-active .success-modal-card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .success-modal-card,
.modal-fade-leave-to .success-modal-card {
  transform: scale(0.9);
  opacity: 0;
}

@media (max-width: 900px) {
  .auth-container { grid-template-columns: 1fr; min-height: auto; }
  .auth-left { min-height: 240px; }
}

@media (max-width: 768px) {
  .auth-page { padding-top: 90px; }
  .auth-container { border-radius: 18px; margin-top: 20px; }
  .auth-left { display: none; }
  .auth-header-fixed { padding: 28px 22px 12px; }
  .tabs-navigation { padding: 0 22px; margin-bottom: 18px; }
  .form-scroll-content { overflow-y: visible; padding: 0 20px 30px; }
  .auth-form-wrapper { max-width: 100%; padding-top: 8px; }
  .auth-form-wrapper h2 { font-size: 1.75rem; }
  .error-alert-content { padding: 8px 12px; }
  .error-text { font-size: 0.8rem; }
  .success-toast { top: 16px; right: 16px; left: 16px; min-width: auto; }
  .success-modal-card { margin: 1rem; padding: 1.5rem; }
  .success-modal-title { font-size: 1.25rem; }
}
</style>