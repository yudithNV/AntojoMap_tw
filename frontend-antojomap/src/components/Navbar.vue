<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <UtensilsCrossed :size="24" stroke-width="2" />
        </div>
        <span class="logo-text">AntojoMap</span>
      </router-link>
      
      <div class="nav-buttons">
        <router-link 
          to="/" 
          class="nav-button"
          :class="{ active: $route.path === '/' }"
        >
          Inicio
        </router-link>
        
        <router-link 
          to="/negocios" 
          class="nav-button"
          :class="{ active: $route.path === '/negocios' }"
        >
          Negocios
        </router-link>

        <router-link 
          to="/no-se-que-comer" 
          class="nav-button"
          :class="{ active: $route.path === '/no-se-que-comer' }"
        >
          No sé qué comer
        </router-link>
        
        <router-link 
          to="/register" 
          class="nav-button"
          :class="{ active: $route.path === '/register' }"
        >
          Registrarse
        </router-link>
        
        <router-link 
          to="/login" 
          class="nav-button"
          :class="{ active: $route.path === '/login' }"
        >
          Ingresar
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { UtensilsCrossed } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const scrollToSection = () => {
  // Aquí puedes agregar lógica para scroll a sección de negocios
  console.log('Sección de negocios')
}
</script>

<style scoped>
.navbar {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-xs);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blood-orange);
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  font-family: var(--font-family-display);
  color: var(--color-plum);
}

.nav-buttons {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-button {
  text-decoration: none;
  color: var(--color-plum);
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  background-color: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.nav-button:hover,
.nav-button.active {
  background-color: #C64445;
  color: #FDFCFB;
}

@media (max-width: 768px) {
  .nav-buttons {
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  
  .nav-button {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .logo-text {
    font-size: 1rem;
  }
}
</style>