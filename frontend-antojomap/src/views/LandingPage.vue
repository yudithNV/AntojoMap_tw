<template>
  <div class="landing">
    
    
    <header class="hero">
      <div class="hero-wrapper">
        <div class="hero-content">
          <span class="hero-badge">
        <Zap :size="16" stroke-width="2" />
        ¡TU RULETA GASTRONÓMICA LOCAL!
      </span>
          <h1>¿Qué <span class="highlight">comerás</span> <br> hoy?</h1>
          <p class="hero-description">Descubre los mejores sabores locales en nuestra Ruleta del Antojo. La proximidad comida favorita está a solo un giro.</p>
          
          <div class="hero-actions">
            <button class="btn-primary">
              <Zap :size="18" stroke-width="2" />
              Girar la Ruleta
            </button>
            <button class="btn-secondary">
              <MapPin :size="18" stroke-width="2" />
              Ver Mapa
            </button>
          </div>

          <div class="social-proof">
            <span class="avatar-group">
              <Users :size="24" stroke-width="2" />
            </span>
            <span class="social-text">22,000+ foodistas ya disfrutan AntojoMap</span>
          </div>
        </div>

        <div class="hero-wheel">
          <WheelSpinner />
        </div>
      </div>
    </header>

    <CategoriesSection />
    <RecommendedSection />

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
import Navbar from '../components/Navbar.vue'
import WheelSpinner from '../components/WheelSpinner.vue'
import CategoriesSection from '../components/CategoriesSection.vue'
import RecommendedSection from '../components/RecommendedSection.vue'
import { Zap, MapPin, Users } from 'lucide-vue-next'
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background-color: var(--color-white);
}

.hero {
  padding: 60px 20px 80px;
  background: linear-gradient(135deg, var(--color-white) 0%, rgba(235, 226, 207, 0.3) 100%);
}

.hero-wrapper {
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
  background-color: rgba(171, 72, 45, 0.08);
  color: var(--color-blood-orange);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-family);
}

h1 {
  font-size: 3.5rem;
  color: var(--color-plum);
  margin: 0 0 20px 0;
  line-height: 1.1;
  font-weight: 700;
  font-family: var(--font-family-display);
}

.highlight {
  color: var(--color-blood-orange);
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
  background-color: var(--color-blood-orange);
  border-radius: 2px;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--color-gray-600);
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
  border-radius: var(--radius-md);
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
  background-color: var(--color-blood-orange);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background-color: var(--color-dusty-coral);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background-color: var(--color-white);
  color: var(--color-blood-orange);
  border: 1px solid var(--color-blood-orange);
}

.btn-secondary:hover {
  background-color: rgba(171, 72, 45, 0.04);
  border-color: var(--color-dusty-coral);
  color: var(--color-dusty-coral);
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
  color: var(--color-blood-orange);
}

.social-text {
  font-size: 0.9rem;
  color: var(--color-plum);
  font-weight: 500;
}

.hero-wheel {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer {
  background-color: var(--color-dark-bg);
  color: var(--color-ivory);
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
  color: var(--color-ivory);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-blood-orange);
}

@media (max-width: 768px) {
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