<template>
  <div class="business-page">
    <!-- 🔥 PARTE SUPERIOR - FONDO VINO 🔥 -->
    <div class="top-section">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-grid">
          <div class="hero-content">
            <span class="hero-badge">
              <Zap :size="16" stroke-width="2" />
              AntojoMap para Restaurantes
            </span>
            <h1>Haz que tu restaurante sea el <span class="highlight">próximo antojo</span></h1>
            <p class="subtitle">Sin comisiones, solo visibilidad</p>
            <p class="description">
              No somos una app de delivery más. Somos el puente entre tu cocina y miles de foodies locales que usan nuestra Ruleta para decidir qué comer hoy.
            </p>
            <div class="hero-actions">
              <router-link to="/register" class="btn-cta">
                Registrar mi Restaurante
                <span class="btn-arrow">→</span>
              </router-link>
              <a href="#benefits" class="hero-link">Ver beneficios</a>
            </div>

            <div class="hero-stats">
              <div class="stat-card">
                <span class="stat-value">+1500</span>
                <span class="stat-label">Restaurantes activos</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-card">
                <span class="stat-value">4.9</span>
                <span class="stat-label">Puntuación promedio</span>
              </div>
            </div>
          </div>

          <div class="hero-visual" aria-hidden="true">
            <div class="visual-circle"></div>
            <div class="visual-card visual-card--small">
              <div class="visual-icon">
                <Zap :size="24" />
              </div>
              <div>
                <strong>Conexión directa</strong>
                <p>Foodies curiosos llegan a tu menú.</p>
              </div>
            </div>

            <div class="visual-mockup">
              <div class="mockup-photo" aria-hidden="true"></div>
              <div class="mockup-copy">
                <span>✨ Imagen destacada</span>
                <p>Una vista premium de tu ambiente y propuesta de valor.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 🔥 PARTE INFERIOR - CON PATRÓN SVG 🔥 -->
    <div class="bottom-section">
      <!-- Beneficios Reales -->
      <section id="benefits" class="benefits-section">
        <div class="section-header">
          <span class="section-badge">Beneficios</span>
          <h2>¿Por qué unirte a AntojoMap?</h2>
          <p class="section-subtitle">Todo lo que necesitas para hacer crecer tu negocio</p>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">
              <Users :size="32" />
            </div>
            <h3>Visibilidad Gratis</h3>
            <p>Aparece en la Ruleta del Antojo y deja que el azar traiga nuevos clientes directamente a tu local.</p>
            <div class="benefit-hover-effect"></div>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <Zap :size="32" />
            </div>
            <h3>Gestión de Menú</h3>
            <p>Sube tus platos estrella, edita precios y actualiza fotos en tiempo real desde tu propio panel intuitivo.</p>
            <div class="benefit-hover-effect"></div>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <BarChart3 :size="32" />
            </div>
            <h3>Feedback Real</h3>
            <p>Conoce lo que opinan tus clientes y monitorea el interés por tus platillos con datos precisos.</p>
            <div class="benefit-hover-effect"></div>
          </div>
        </div>
      </section>

      <!-- Sección Cero Costo -->
      <section class="no-cost-section">
        <div class="info-card">
          <div class="info-icon">💰</div>
          <h2>Únete sin letras pequeñas</h2>
          <p>Actualmente, <strong>AntojoMap es 100% gratuito</strong> para los restaurantes locales. Queremos impulsar la gastronomía y ayudarte a digitalizar tu menú sin comisiones abusivas.</p>
          <ul class="features-list">
            <li>✓ Perfil verificado en el mapa interactivo</li>
            <li>✓ Presencia ilimitada en la Ruleta y el Feed</li>
            <li>✓ Panel de administración personalizado</li>
          </ul>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="cta-section">
        <h2>¿Listo para encender los fogones?</h2>
        <p>El registro toma menos de 5 minutos. Crea tu cuenta y empieza a recibir visitas.</p>
        <router-link to="/register" class="btn-cta-large">
          Registrar mi Restaurante
          <span class="btn-arrow">→</span>
        </router-link>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Users, BarChart3, Zap } from 'lucide-vue-next'
</script>

<style scoped>
/* ===== PALETA DE COLORES ===== */
/* ============================ */

.business-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  padding-top: 80px;
  /* 🔥 FONDO VINO PARA TODA LA PÁGINA 🔥 */
  background: linear-gradient(135deg, #8B2A4E 0%, #6B1B3C 100%);
}

/* 🔥 PARTE SUPERIOR - FONDO VINO 🔥 */
.top-section {
  background: transparent;
  position: relative;
}

/* 🔥 PARTE INFERIOR - CON PATRÓN SVG 🔥 */
.bottom-section {
  position: relative;
  background: transparent;
}

/* Patrón SVG solo en la parte inferior */
.bottom-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/seamless-repeat-pattern-background-with-hand-drawn OFICIAL.svg');
  background-repeat: repeat;
  background-size: 200px;
  opacity: 0.06;
  pointer-events: none;
  z-index: 0;
}

/* Asegurar que el contenido esté sobre el patrón */
.benefits-section,
.no-cost-section,
.cta-section {
  position: relative;
  z-index: 1;
}

.hero-section {
  position: relative;
  padding: 60px 24px 64px;
  z-index: 1;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 42px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  position: relative;
  z-index: 1;
  animation: fadeInLeft 0.8s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(232, 213, 181, 0.15);
  backdrop-filter: blur(8px);
  color: #E8D5B5;
  padding: 8px 18px;
  border-radius: 40px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 28px;
  letter-spacing: 0.5px;
  border: 1px solid rgba(232, 213, 181, 0.25);
}

.hero-section h1 {
  font-size: clamp(3rem, 4.2vw, 4.2rem);
  color: #FFF8F0;
  margin-bottom: 20px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1px;
}

.highlight {
  color: #E8D5B5;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #E8D5B5, #C4A77D);
  border-radius: 3px;
  animation: expandWidth 0.6s ease-out 0.3s both;
}

.subtitle {
  font-size: clamp(1.2rem, 1.8vw, 1.4rem);
  color: #E8D5B5;
  margin-bottom: 18px;
  font-weight: 600;
}

.description {
  max-width: 580px;
  margin: 0 0 34px;
  color: #E0D0C0;
  line-height: 1.7;
  font-size: 1rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin-bottom: 48px;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 50px;
  background: linear-gradient(135deg, #E8D5B5, #C4A77D);
  color: #4a122a;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.btn-cta:hover::before {
  left: 100%;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.btn-cta:hover .btn-arrow {
  transform: translateX(5px);
}

.hero-link {
  color: #E8D5B5;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 2px solid rgba(232, 213, 181, 0.3);
  transition: all 0.3s ease;
}

.hero-link:hover {
  color: #F0E5D0;
  border-color: #F0E5D0;
  transform: translateX(5px);
}

.hero-stats {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 12px 24px;
  border-radius: 60px;
  width: fit-content;
}

.stat-card {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: #FFF8F0;
}

.stat-label {
  display: block;
  margin-top: 4px;
  color: #E8D5B5;
  font-weight: 500;
  font-size: 0.8rem;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, #E8D5B5, transparent);
}

.hero-visual {
  position: relative;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInRight 0.8s ease-out;
}

.visual-circle {
  position: absolute;
  top: -36px;
  right: -36px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 213, 181, 0.15), transparent);
  filter: blur(20px);
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.visual-card {
  overflow: hidden;
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(232, 213, 181, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.visual-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.15);
}

.visual-card--small {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
}

.visual-icon {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  background: linear-gradient(135deg, #8B2A4E, #6B1B3C);
  color: #E8D5B5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.visual-mockup {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 20px 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(232, 213, 181, 0.2);
  transition: all 0.3s ease;
}

.visual-mockup:hover {
  transform: translateX(5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.mockup-photo {
  width: 100%;
  min-height: 100px;
  border-radius: 20px;
  background: linear-gradient(135deg, #E8D5B5, #C4A77D);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.mockup-copy span {
  display: inline-block;
  color: #75162D;
  font-weight: 700;
}

.mockup-copy p {
  margin: 8px 0 0;
  color: #6b4a3a;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* Sección Beneficios */
.benefits-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-badge {
  display: inline-block;
  background: rgba(232, 213, 181, 0.15);
  color: #E8D5B5;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.benefits-section h2 {
  color: #FFF8F0;
  margin-bottom: 16px;
  font-size: clamp(2rem, 2.8vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-subtitle {
  color: #E0D0C0;
  font-size: 1rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.benefit-card {
  padding: 36px 28px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  text-align: center;
  border: 1px solid rgba(232, 213, 181, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  position: relative;
  overflow: hidden;
}

.benefit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #E8D5B5, #C4A77D);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.benefit-card:hover::before {
  transform: scaleX(1);
}

.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
}

.benefit-icon {
  color: #75162D;
  margin-bottom: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(139, 42, 78, 0.1);
  border-radius: 24px;
  transition: all 0.3s ease;
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.1);
  background: linear-gradient(135deg, #8B2A4E, #6B1B3C);
  color: #E8D5B5;
}

.benefit-card h3 {
  color: #4a122a;
  margin-bottom: 16px;
  font-size: 1.3rem;
  font-weight: 700;
}

.benefit-card p {
  color: #6b4a3a;
  line-height: 1.7;
}

/* Sección Cero Costo */
.no-cost-section {
  padding: 80px 20px;
}

.info-card {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  padding: 48px;
  border-radius: 32px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(232, 213, 181, 0.2);
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

.info-card h2 {
  color: #4a122a;
  margin-bottom: 20px;
  font-weight: 800;
}

.info-card p {
  color: #6b4a3a;
  line-height: 1.7;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.features-list li {
  color: #4a122a;
  font-weight: 600;
  background: rgba(139, 42, 78, 0.1);
  padding: 10px 20px;
  border-radius: 40px;
  font-size: 0.85rem;
}

/* Sección CTA */
.cta-section {
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, #3a0a1c, #1a0308);
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -20%;
  width: 140%;
  height: 200%;
  background: radial-gradient(circle, rgba(232, 213, 181, 0.08) 0%, transparent 70%);
  pointer-events: none;
  animation: rotate 20s linear infinite;
}

.cta-section h2 {
  color: #E8D5B5;
  margin-bottom: 20px;
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 800;
  position: relative;
  z-index: 1;
}

.cta-section p {
  margin-bottom: 32px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255,255,255,0.9);
  position: relative;
  z-index: 1;
}

.btn-cta-large {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #E8D5B5;
  color: #4a122a;
  padding: 16px 36px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.btn-cta-large::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.btn-cta-large:hover::before {
  left: 100%;
}

.btn-cta-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
  background: #F0E5D0;
}

.btn-cta-large .btn-arrow {
  transition: transform 0.3s ease;
}

.btn-cta-large:hover .btn-arrow {
  transform: translateX(5px);
}

/* ===== ANIMACIONES GENERALES ===== */
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes expandWidth {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-visual {
    min-height: auto;
    order: -1;
  }
}

@media (max-width: 768px) {
  .business-page {
    padding-top: 60px;
  }

  .hero-section {
    padding: 40px 18px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-link {
    text-align: center;
  }

  .hero-stats {
    width: 100%;
    justify-content: center;
  }

  .benefits-section,
  .no-cost-section,
  .cta-section {
    padding: 50px 18px;
  }

  .info-card {
    padding: 32px 24px;
  }

  .features-list {
    flex-direction: column;
    align-items: center;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 16px;
    border-radius: 32px;
  }

  .stat-divider {
    width: 80%;
    height: 1px;
  }

  .visual-card--small {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .visual-icon {
    margin: 0 auto;
  }

  .visual-mockup {
    grid-template-columns: 1fr;
  }
}
</style>