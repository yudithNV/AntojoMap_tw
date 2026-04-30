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

              <button type="submit" class="btn-submit">Iniciar Sesión</button>
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

const router = useRouter()
const showPassword = ref(false)
const form = ref({
  email: '',
  password: '',
  remember: false
})

const handleLogin = () => {
  const { email, password } = form.value

  // Test credentials
  if (email === 'admin@test.com' && password === 'admin123') {
    localStorage.setItem('user_role', 'admin')
    localStorage.setItem('user_email', email)
    router.push('/admin/dashboard')
  } else if (email === 'rest@test.com' && password === 'rest123') {
    localStorage.setItem('user_role', 'restaurant')
    localStorage.setItem('user_email', email)
    router.push('/restaurant/menu')
  } else if (email === 'user@test.com' && password === 'user123') {
    localStorage.setItem('user_role', 'user')
    localStorage.setItem('user_email', email)
    router.push('/user/feed')
  } else {
    alert('Credenciales inválidas. Usa:\n- admin@test.com / admin123\n- rest@test.com / rest123\n- user@test.com / user123')
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1000px;
  height: 600px;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.auth-left {
  background: linear-gradient(135deg, var(--color-moss-green) 0%, var(--color-dusty-coral) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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

.auth-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
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

.form-content h2 {
  font-size: 1.8rem;
  color: var(--color-plum);
  margin: 0 0 12px 0;
  text-align: center;
  font-weight: 700;
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 0.95rem;
  text-align: center;
  margin: 0 0 30px 0;
  line-height: 1.5;
  font-weight: 400;
}

.form-group {
  margin-bottom: 20px;
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
input[type="text"] {
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
input[type="text"]:focus {
  outline: none;
  border-color: var(--color-blood-orange);
  box-shadow: 0 0 0 3px rgba(171, 72, 45, 0.08);
}

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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 0.9rem;
}

.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  color: var(--color-gray-700);
  font-weight: 400;
}

.checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-blood-orange);
}

.forgot-password {
  color: var(--color-blood-orange);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  font-size: 0.9rem;
}

.forgot-password:hover {
  color: var(--color-dusty-coral);
}

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

@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    height: auto;
    max-width: 100%;
    border-radius: 0;
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
    font-size: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
