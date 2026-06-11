<template>
  <div class="forgot-password-page">
    <div class="forgot-container">
      <div class="forgot-card">
        <button class="back-btn" @click="goBack">
          ← Volver
        </button>
        
        <div class="icon-wrapper">
          <KeyRound :size="64" stroke-width="1.5" />
        </div>
        
        <h2>¿Olvidaste tu contraseña?</h2>
        <p class="description">
          No te preocupes, te enviaremos un enlace para restablecerla.
        </p>
        
        <form @submit.prevent="handleForgotPassword">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@correo.com"
              required
              :disabled="loading"
            />
          </div>
          
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
          </button>
        </form>
        
        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
        
        <p class="login-link">
          ¿Recordaste tu contraseña?
          <router-link to="/login">Iniciar sesión</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { KeyRound } from 'lucide-vue-next'

const router = useRouter()
const email = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const goBack = () => {
  router.push('/login')
}

const handleForgotPassword = async () => {
  if (!email.value) {
    message.value = 'Por favor ingresa tu correo electrónico'
    messageType.value = 'error'
    return
  }
  
  loading.value = true
  message.value = ''
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar el correo')
    }
    
    message.value = data.mensaje || 'Revisa tu correo para restablecer tu contraseña'
    messageType.value = 'success'
    email.value = ''
  } catch (error) {
    message.value = error.message || 'Error al enviar el correo. Intenta de nuevo'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7ede5 0%, #fffbf2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.forgot-container {
  width: 100%;
  max-width: 500px;
}

.forgot-card {
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  background: none;
  border: none;
  font-size: 1rem;
  color: #A33333;
  cursor: pointer;
  font-weight: 600;
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

input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e0db;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #A33333;
  box-shadow: 0 0 0 3px rgba(163, 51, 51, 0.1);
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

.login-link {
  text-align: center;
  margin-top: 24px;
  color: #6b2121;
}

.login-link a {
  color: #A33333;
  text-decoration: none;
  font-weight: 700;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>