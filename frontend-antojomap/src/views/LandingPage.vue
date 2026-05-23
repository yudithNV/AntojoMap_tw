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
import WheelSpinner from '../components/WheelSpinner.vue'
import CategoriesSection from '../components/CategoriesSection.vue'
import RecommendedSection from '../components/RecommendedSection.vue'
import { Zap, MapPin, Users } from 'lucide-vue-next'
</script>

<style scoped>
/* ===== PALETA DE COLORES ===== */
/* Chocolate: #643016 */
/* Alert Tan: #974F2C */
/* Dark Tan: #9F6A4A */
/* Fallow: #CB9870 */
/* ================================== */

.landing {
  min-height: 100vh;
  background: linear-gradient(145deg, #CB9870 0%, #B87A50 100%);
  position: relative;
}

.landing::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 40%, rgba(255,255,255,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero {
  padding: 60px 20px 80px;
<<<<<<< Updated upstream
  background: linear-gradient(135deg, #FDFDFD 0%, rgba(255, 107, 0, 0.05) 100%);
=======
  position: relative;
  animation: fadeIn 0.8s ease-out;
  overflow: hidden;
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
>>>>>>> Stashed changes
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}

.hero-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
}

.hero-content {
  animation: slideInLeft 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.hero-visual {
  animation: slideInRight 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: #643016;
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 28px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: pulse 2s infinite;
}

h1 {
  font-size: 3.8rem;
  color: #643016;
  margin: 0 0 20px 0;
  line-height: 1.1;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.02em;
}

.highlight {
  color: #974F2C;
  text-decoration: none;
  position: relative;
  display: inline-block;
  background: linear-gradient(120deg, rgba(151,79,44,0.1) 0%, rgba(151,79,44,0) 100%);
  padding: 0 8px;
  border-radius: 8px;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #974F2C, #CB9870);
  border-radius: 3px;
  animation: expandWidth 0.6s ease-out 0.3s both;
}

.hero-description {
  font-size: 1.15rem;
  color: #5a2a14;
  margin: 0 0 36px 0;
  line-height: 1.6;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255,255,255,0.2);
}

.hero-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 45px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #643016, #974F2C);
  color: white;
  box-shadow: 0 8px 20px rgba(100, 48, 22, 0.35);
  border: none;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 30px rgba(100, 48, 22, 0.45);
  background: linear-gradient(135deg, #974F2C, #B86030);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  color: #643016;
  border: 1.5px solid rgba(100, 48, 22, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  border-color: #643016;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.btn-secondary:active {
  transform: translateY(0);
}

.social-proof {
  display: flex;
  align-items: center;
  gap: 12px;
  animation: fadeInUp 0.6s ease-out 0.4s both;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 8px 20px;
  border-radius: 50px;
  width: fit-content;
}

.avatar-group {
  font-size: 1.8rem;
  display: inline-flex;
  align-items: center;
  color: #974F2C;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.social-text {
  font-size: 0.9rem;
  color: #5a2a14;
  font-weight: 600;
}

.hero-wheel {
  display: flex;
  justify-content: center;
  align-items: center;
<<<<<<< Updated upstream
=======
  min-height: 460px;
}

.hero-map {
  width: min(560px, 100%);
  height: 430px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  animation: zoomIn 0.5s ease-out;
}

.hero-map:hover {
  transform: scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
>>>>>>> Stashed changes
}

.footer {
  background: linear-gradient(135deg, #643016, #4a2412);
  color: #CB9870;
  padding: 32px 20px;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(203,152,112,0.3), transparent);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content p {
  margin: 0 0 16px 0;
  font-size: 0.95rem;
  font-weight: 400;
  opacity: 0.8;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.footer-links a {
  color: #CB9870;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.footer-links a:hover {
  opacity: 1;
  color: #ffffff;
  transform: translateY(-2px);
}

<<<<<<< Updated upstream
=======
/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes expandWidth {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.9; 
    transform: scale(1.02); 
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== RESPONSIVE ===== */
>>>>>>> Stashed changes
@media (max-width: 768px) {
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
  }

  .btn-primary, .btn-secondary {
    width: 100%;
  }

  .footer-links {
    flex-direction: column;
    gap: 12px;
  }

  .social-proof {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }
  
  .hero-badge {
    font-size: 0.7rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
}
</style>