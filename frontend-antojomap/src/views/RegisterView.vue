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
                  <input id="user-name" v-model="userForm.name" type="text" placeholder="Tu nombre" required />
                </div>

                <div class="form-group">
                  <label for="user-email">Correo Electrónico</label>
                  <input id="user-email" v-model="userForm.email" type="email" placeholder="tu@correo.com" required />
                </div>

                <div class="form-group">
                  <label for="user-password">Contraseña</label>
                  <div class="password-input-wrapper">
                    <input id="user-password" v-model="userForm.password" :type="showUserPassword ? 'text' : 'password'" placeholder="••••••••" required />
                    <button type="button" class="toggle-password" @click="showUserPassword = !showUserPassword">
                      <Eye v-if="showUserPassword" :size="20" stroke-width="2" />
                      <EyeOff v-else :size="20" stroke-width="2" />
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn-submit">Registrarse</button>
              </form>
            </template>

            <!-- Restaurante Form -->
            <template v-else>
              <h2>Registra tu Restaurante</h2>
              <p class="subtitle">Únete como vendedor y crece con AntojoMap</p>

              <form @submit.prevent="handleRestaurantRegister">
                <div class="form-group">
                  <label for="rest-name">Nombre del Restaurante</label>
                  <input id="rest-name" v-model="restaurantForm.name" type="text" placeholder="Nombre de tu restaurante" required />
                </div>

                <div class="form-group">
                  <label for="rest-nit">NIT</label>
                  <input id="rest-nit" v-model="restaurantForm.nit" type="text" placeholder="Número de identificación" required />
                </div>

                <div class="form-group">
                  <label for="rest-address">Dirección</label>
                  <input id="rest-address" v-model="restaurantForm.address" type="text" placeholder="Dirección del restaurante" required />
                </div>

                <div class="form-group">
                  <label for="rest-phone">Teléfono</label>
                  <input id="rest-phone" v-model="restaurantForm.phone" type="tel" placeholder="+56 9 XXXX XXXX" required />
                </div>

                <div class="form-group">
                  <label for="rest-category">Categoría</label>
                  <select id="rest-category" v-model="restaurantForm.category" required>
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
                  <label for="rest-social">Redes Sociales (Opcional)</label>
                  <input id="rest-social" v-model="restaurantForm.socialMedia" type="text" placeholder="@usuario o URL" />
                </div>

                <div class="form-group">
                  <label for="rest-email">Correo para el Administrador de Restaurante</label>
                  <input id="rest-email" v-model="restaurantForm.email" type="email" placeholder="correo@negocio.com" required />
                </div>

                <div class="form-group">
                  <label for="rest-password">Contraseña de Acceso</label>
                  <input id="rest-password" v-model="restaurantForm.password" type="password" placeholder="••••••••" required />
                </div>

                <button type="submit" class="btn-submit">Registrar Restaurante</button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Utensils, Eye, EyeOff, User, Store } from 'lucide-vue-next'

const router = useRouter()
const activeTab = ref('usuario')
const showUserPassword = ref(false)

const userForm = ref({
  name: '',
  email: '',
  password: ''
})

const restaurantForm = ref({
  name: '',
  nit: '',
  address: '',
  phone: '',
  category: '',
  socialMedia: '',
  email: '',
  password: ''
})

const handleUserRegister = () => {
  console.log('User Register:', userForm.value)
  router.push('/login')
}

const handleRestaurantRegister = () => {
  console.log('Restaurant Register:', restaurantForm.value)
  router.push('/login')
}
</script>

<style scoped>
/* Estilos globales de la página */
.auth-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Contenedor principal corregido */
.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1000px;
  height: 700px;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* Parte izquierda (Visual) - Sin cambios */
.auth-left {
  background: linear-gradient(135deg, var(--color-moss-green) 0%, var(--color-dusty-coral) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px;
}

.food-image {
  font-size: 15rem;
  opacity: 0.9;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
}

/* Parte derecha (Formulario) - REESTRUCTURADA */
.auth-right {
  display: flex;
  flex-direction: column; /* Diseño en columna para fijar logo y tabs */
  height: 100%;
  overflow: hidden; /* El contenedor padre no scrollea */
}

/* Logo FIJO arriba */
.auth-header-fixed {
  padding: 30px 40px 10px 40px; /* Padding superior para el logo */
  text-align: center;
  flex-shrink: 0; /* No se encoge */
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(171, 72, 45, 0.1);
  border-radius: 10px;
  color: var(--color-blood-orange);
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-main {
  font-size: 1.3rem;
  font-weight: 700;
  font-family: var(--font-family-display);
  color: var(--color-plum);
}

.logo-sub {
  font-size: 1rem;
  color: var(--color-blood-orange);
  font-weight: 600;
}

/* Contenedor de Tabs - Separado y limpio */
.tabs-navigation {
  padding: 0 40px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.tabs-container {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-gray-200);
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--color-gray-500);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-button:hover {
  color: var(--color-blood-orange);
}

.tab-button.active {
  color: var(--color-blood-orange);
  border-bottom-color: var(--color-blood-orange);
}

/* Área de contenido con SCROLL corregida */
.form-scroll-content {
  flex-grow: 1; /* Ocupa el espacio restante */
  overflow-y: auto; /* Solo aquí hay scroll */
  padding: 0 40px 40px 40px; /* Padding inferior y lateral */
}

/* Limitar ancho del formulario interno */
.auth-form-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 0 auto; /* Centrado horizontal */
}

/* Títulos y subtítulos con márgenes corregidos */
.form-content h2 {
  font-size: 1.8rem;
  color: var(--color-plum);
  margin: 0 0 12px 0;
  text-align: center;
  font-weight: 700;
  font-family: var(--font-family-display);
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 0.95rem;
  text-align: center;
  margin: 0 0 30px 0;
  line-height: 1.5;
  font-weight: 400;
}

/* Estilos de inputs y grupos (Sin cambios, estaban bien) */
.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-plum);
  margin-bottom: 8px;
}

input[type="email"],
input[type="password"],
input[type="text"],
input[type="tel"],
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  transition: all 0.2s;
  box-sizing: border-box;
  font-family: var(--font-family);
  font-weight: 400;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus,
input[type="tel"]:focus,
select:focus {
  outline: none;
  border-color: var(--color-blood-orange);
  box-shadow: 0 0 0 3px rgba(171, 72, 45, 0.08);
}

/* Estilo especial para el select */
select {
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23AB482D' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* Wrapper para el input de contraseña */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
  color: var(--color-gray-600);
}

.toggle-password:hover {
  opacity: 1;
}

/* Botón de envío principal */
.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: var(--color-blood-orange);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
  font-family: var(--font-family);
}

.btn-submit:hover {
  background-color: var(--color-dusty-coral);
  box-shadow: var(--shadow-md);
}

.btn-submit:active {
  transform: scale(0.99);
}

/* Footer del formulario */
.auth-footer {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-gray-500);
  font-weight: 400;
}

.auth-footer a {
  color: var(--color-blood-orange);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-footer a:hover {
  color: var(--color-dusty-coral);
}

/* Responsividad para móviles */
@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
    border-radius: 0;
  }

  .auth-left {
    display: none; /* Ocultar parte visual en móvil */
  }

  .auth-right {
    padding: 0; /* Padding manejado internamente */
  }

  .auth-header-fixed {
    padding: 30px 20px 10px 20px;
  }

  .tabs-navigation {
    padding: 0 20px;
  }

  .form-scroll-content {
    overflow-y: visible; /* Scroll normal de página en móvil */
    padding: 10px 20px 30px 20px;
  }

  .form-content h2 {
    font-size: 1.5rem;
  }
}
</style>