<template>
  <div class="landing">
    <Navbar />
    
    <header class="hero">
      <div class="hero-wrapper">
        <div class="hero-content">
          <span class="hero-badge">
            <Zap :size="16" stroke-width="2" />
            ¡TU RULETA GASTRONÓMICA LOCAL!
          </span>
          <h1>¿Qué <span class="highlight">comerás</span> <br> hoy?</h1>
          <p class="hero-description">Descubre restaurantes cerca de ti o deja que la Ruleta del Antojo decida por ti.</p>
          
          <div class="hero-actions">
            <button class="btn-primary" @click="irARuleta">
              <Zap :size="18" stroke-width="2" />
              Probar la Ruleta
            </button>
            <button class="btn-secondary" @click="toggleMapa">
              <MapPin :size="18" stroke-width="2" />
              {{ mostrarMapa ? 'Ocultar Mapa' : 'Ver Mapa' }}
            </button>
          </div>

          <div class="social-proof">
            <span class="avatar-group">
              <Users :size="24" stroke-width="2" />
            </span>
            <span class="social-text">22,000+ foodistas ya disfrutan AntojoMap</span>
          </div>
        </div>

        <div class="hero-visual">
          <!-- 🔥 v-show en lugar de v-if - el componente ya está en DOM al montarse 🔥 -->
          <WheelSpinner v-show="!mostrarMapa" />
          <AsyncMapaRestaurantes v-if="mostrarMapa" />
        </div>
      </div>
    </header>

    <!-- 🔥 Componentes cargados de forma diferida (lazy loading) 🔥 -->
    <AsyncCategoriesSection />
    <AsyncRecommendedSection />

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2026 AntojoMap - Encuentra tu comida favorita</p>
        <div class="footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Zap, MapPin, Users } from 'lucide-vue-next'
import Navbar from '../components/Navbar.vue'

// 🔥 COMPONENTES PESADOS CARGADOS DE FORMA DIFERIDA (LAZY LOADING) 🔥
// Esto evita que bloqueen el renderizado inicial de la página
const WheelSpinner = defineAsyncComponent(() => import('../components/WheelSpinner.vue'))
const AsyncMapaRestaurantes = defineAsyncComponent(() => import('@/components/MapaRestaurantes.vue'))
const AsyncCategoriesSection = defineAsyncComponent(() => import('../components/CategoriesSection.vue'))
const AsyncRecommendedSection = defineAsyncComponent(() => import('../components/RecommendedSection.vue'))

const router = useRouter()
const mostrarMapa = ref(false)

const irARuleta = () => {
  router.push('/no-se-que-comer')
}

const toggleMapa = () => {
  mostrarMapa.value = !mostrarMapa.value
}

// 🔥 PREFETCH DE COMPONENTES PESADOS - los carga en segundo plano después del renderizado inicial
onMounted(() => {
  // Esto asegura que los componentes ya estén en caché cuando el usuario los necesite
  requestIdleCallback(() => {
    // Precargar componentes que podrían necesitarse después
    import('../components/WheelSpinner.vue')
    import('@/components/MapaRestaurantes.vue')
  })
})
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: linear-gradient(135deg, #8B2A4E 0%, #6B1B3C 50%, #5a1532 100%);
  padding-top: 120px;
}

.hero {
  padding: 60px 20px 80px;
  background: transparent;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/seamless-repeat-pattern-background-with-hand-drawn OFICIAL.svg');
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}

.hero-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  color: #E8D5B5;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-family);
  backdrop-filter: blur(4px);
}

h1 {
  font-size: 3.5rem;
  color: #FFF8F0;
  margin: 0 0 20px 0;
  line-height: 1.1;
  font-weight: 700;
  font-family: var(--font-family-display);
}

.highlight {
  color: #E8D5B5;
  text-decoration: none;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #E8D5B5;
  border-radius: 2px;
}

.hero-description {
  font-size: 1.1rem;
  color: #F0E0D0;
  margin: 0 0 32px 0;
  line-height: 1.6;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-primary, .btn-secondary {
  padding: 12px 28px;
  border-radius: 50px;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-family);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #E8D5B5 0%, #C4A77D 100%);
  color: #4a122a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #F0E5D0 0%, #D4B88C 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background-color: transparent;
  color: #E8D5B5;
  border: 2px solid #E8D5B5;
  box-shadow: none;
}

.btn-secondary:hover {
  background-color: rgba(232, 213, 181, 0.15);
  transform: translateY(-2px);
  border-color: #F0E5D0;
  color: #F0E5D0;
}

.social-proof {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-group {
  font-size: 1.8rem;
  display: inline-flex;
  align-items: center;
  color: #E8D5B5;
}

.social-text {
  font-size: 0.9rem;
  color: #F0E0D0;
  font-weight: 500;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 460px;
}

.hero-map {
  width: min(560px, 100%);
  height: 430px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(232, 213, 181, 0.3);
}

.footer {
  background: linear-gradient(135deg, #3a0a1c 0%, #1a0308 100%);
  color: #FDFDFD;
  padding: 32px 20px;
  text-align: center;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content p {
  margin: 0 0 16px 0;
  font-size: 0.95rem;
  font-weight: 400;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.footer-links a {
  color: #FDFDFD;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #E8D5B5;
}

/* Ajustes para componentes internos */
:deep(.category-card),
:deep(.recommended-card) {
  background: rgba(255, 255, 255, 0.95);
}

:deep(.category-card h3),
:deep(.recommended-card h3) {
  color: #4a122a;
}

:deep(.category-card p),
:deep(.recommended-card p) {
  color: #6b4a3a;
}

:deep(.category-card:hover),
:deep(.recommended-card:hover) {
  border-color: #E8D5B5;
}

@media (max-width: 768px) {
  .landing {
    padding-top: 90px;
  }
  
  .hero-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0;
  }

  h1 {
    font-size: 2.2rem;
  }

  .hero {
    padding: 40px 20px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
  }

  .footer-links {
    flex-direction: column;
    gap: 12px;
  }
}
</style>