<template>
  <div class="landing">
    <Navbar />
    
    <header class="hero">
      <div class="hero-wrapper">
        <!-- 🔥 BLOQUE IZQUIERDO - REESTRUCTURADO 🔥 -->
        <div class="hero-content">
          <div class="hero-text-container">
            <span class="hero-badge">
              <Zap :size="16" stroke-width="2" />
              ¡TU RULETA GASTRONÓMICA LOCAL!
            </span>
            <h1>¿Qué <span class="highlight">comerás</span> hoy?</h1>
            <p class="hero-description">Descubre restaurantes cerca de ti o deja que la Ruleta del Antojo decida por ti.</p>
          </div>
          
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
            <div class="avatar-group">
              <Users :size="24" stroke-width="2" />
            </div>
            <span class="social-text">22,000+ foodistas ya disfrutan AntojoMap</span>
          </div>
        </div>

        <div class="hero-visual">
          <WheelSpinner v-show="!mostrarMapa" />
          <AsyncMapaRestaurantes v-if="mostrarMapa" />
        </div>
      </div>
    </header>

    <AsyncCategoriesSection />
    <AsyncRecommendedSection />

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2026 AntojoMap - Encuentra tu comida favorita</p>
        <div class="footer-links"></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Zap, MapPin, Users } from 'lucide-vue-next'
import Navbar from '../components/Navbar.vue'

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

onMounted(() => {
  requestIdleCallback(() => {
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

/* ===== BLOQUE IZQUIERDO - REESTRUCTURADO ===== */
.hero-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-text-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  color: #E8D5B5;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: var(--font-family);
  backdrop-filter: blur(4px);
  width: fit-content;
}

h1 {
  font-size: 3.8rem;
  color: #FFF8F0;
  margin: 0;
  line-height: 1.15;
  font-weight: 800;
  font-family: var(--font-family-display);
  letter-spacing: -0.5px;
}

.highlight {
  color: #E8D5B5;
  position: relative;
  display: inline-block;
}

/* 🔥 LÍNEA DECORATIVA ELIMINADA - ya no hay highlight::after 🔥 */

.hero-description {
  font-size: 1.05rem;
  color: rgba(240, 224, 208, 0.9);
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
  max-width: 90%;
}

.hero-actions {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-top: 4px;
}

.btn-primary,
.btn-secondary {
  padding: 14px 32px;
  border-radius: 50px;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: var(--font-family);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 180px;
}

.btn-primary {
  background: linear-gradient(135deg, #E8D5B5 0%, #C4A77D 100%);
  color: #4a122a;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #F0E5D0 0%, #D4B88C 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.btn-primary:active {
  transform: scale(0.97);
}

.btn-secondary {
  background-color: transparent;
  color: #E8D5B5;
  border: 2px solid #E8D5B5;
  box-shadow: none;
}

.btn-secondary:hover {
  background-color: rgba(232, 213, 181, 0.12);
  transform: translateY(-2px);
  border-color: #F0E5D0;
  color: #F0E5D0;
}

.btn-secondary:active {
  transform: scale(0.97);
}

.social-proof {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
  padding-top: 8px;
}

.avatar-group {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #E8D5B5;
  background: rgba(232, 213, 181, 0.12);
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.social-text {
  font-size: 0.9rem;
  color: rgba(240, 224, 208, 0.85);
  font-weight: 500;
}

/* ===== FIN BLOQUE IZQUIERDO ===== */

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
    font-size: 2.5rem;
  }

  .hero {
    padding: 40px 20px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 14px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    min-width: auto;
  }

  .hero-description {
    max-width: 100%;
  }

  .hero-content {
    gap: 24px;
  }

  .hero-text-container {
    gap: 16px;
  }

  .footer-links {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }

  .hero-badge {
    font-size: 0.65rem;
    padding: 6px 12px;
  }

  .social-proof {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>