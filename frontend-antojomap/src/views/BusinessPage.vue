<template>
  <div class="business-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-grid">
        <div class="hero-content">
          <span class="hero-badge">AntojoMap para Restaurantes</span>
          <h1>Haz que tu restaurante sea el próximo antojo</h1>
          <p class="subtitle">Sin comisiones, solo visibilidad</p>
          <p class="description">
            No somos una app de delivery más. Somos el puente entre tu cocina y miles de foodies locales que usan nuestra Ruleta para decidir qué comer hoy.
          </p>
          <div class="hero-actions">
            <router-link to="/register" class="btn-cta">Registrar mi Restaurante</router-link>
            <a href="#benefits" class="hero-link">Ver beneficios</a>
          </div>

          <div class="hero-stats">
            <div class="stat-card">
              <span class="stat-value">+1500</span>
              <span class="stat-label">Restaurantes activos</span>
            </div>
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
              <span>Imagen destacada</span>
              <p>Una vista premium de tu ambiente y propuesta de valor.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios Reales -->
    <section class="benefits-section">
      <h2>¿Por qué unirte a AntojoMap?</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon">
            <Users :size="32" />
          </div>
          <h3>Visibilidad Gratis</h3>
          <p>Aparece en la Ruleta del Antojo y deja que el azar traiga nuevos clientes directamente a tu local.</p>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon">
            <Zap :size="32" />
          </div>
          <h3>Gestión de Menú</h3>
          <p>Sube tus platos estrella, edita precios y actualiza fotos en tiempo real desde tu propio panel intuitivo.</p>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon">
            <BarChart3 :size="32" />
          </div>
          <h3>Feedback Real</h3>
          <p>Conoce lo que opinan tus clientes y monitorea el interés por tus platillos con datos precisos.</p>
        </div>
      </div>
    </section>

    <!-- Sección Cero Costo (Adiós Planes) -->
    <section class="no-cost-section">
      <div class="info-card">
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
      <router-link to="/register" class="btn-cta-large">Registrar mi Restaurante</router-link>
    </section>
  </div>
</template>

<script setup>
import { Users, BarChart3, Zap } from 'lucide-vue-next'
</script>

<style scoped>
.business-page {
  position: relative;
  min-height: 100vh;
  background: #F6EEE4;
  overflow: hidden;
  color: #433C3A;
}

.business-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at top left, rgba(143, 36, 54, 0.10), transparent 24%),
                    radial-gradient(circle at bottom right, rgba(143, 36, 54, 0.08), transparent 22%);
  pointer-events: none;
}

.hero-section {
  position: relative;
  padding: 100px 24px 64px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 42px;
  align-items: center;
  max-width: 1180px;
  margin: 0 auto;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 14px;
  background: rgba(143, 36, 54, 0.12);
  color: #7E232F;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 26px;
  letter-spacing: 0.04em;
}

.hero-section h1 {
  font-size: clamp(3rem, 4.2vw, 4.6rem);
  color: #6E1F2F;
  margin-bottom: 20px;
  font-family: var(--font-family-display);
  font-weight: 700;
  line-height: 1.04;
}

.subtitle {
  font-size: clamp(1.35rem, 1.8vw, 1.65rem);
  color: #7C2D3C;
  margin-bottom: 18px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.description {
  max-width: 680px;
  margin: 0 0 34px;
  color: #4B403E;
  line-height: 1.78;
  font-size: 1.03rem;
  font-family: Inter, system-ui, sans-serif;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 36px;
}

.btn-cta,
.btn-cta-large {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 28px;
  border-radius: 14px;
  border: none;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease;
}

.btn-cta {
  background: #6E1F2F;
  color: #F8F1E7;
  box-shadow: 0 16px 32px rgba(110, 31, 47, 0.14);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(110, 31, 47, 0.18);
  background: #7F2638;
}

.hero-link {
  color: #7E232F;
  text-decoration: none;
  font-weight: 700;
  border-bottom: 2px solid rgba(126, 35, 47, 0.16);
  transition: color 0.22s ease, border-color 0.22s ease;
}

.hero-link:hover {
  color: #8B2F42;
  border-color: #8B2F42;
}

.hero-stats {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 250, 244, 0.92);
  border: 1px solid rgba(110, 31, 47, 0.12);
  border-radius: 16px;
  padding: 22px 24px;
  min-width: 170px;
  box-shadow: 0 14px 28px rgba(69, 52, 51, 0.08);
}

.stat-value {
  display: block;
  font-size: 1.85rem;
  font-weight: 800;
  color: #6E1F2F;
}

.stat-label {
  display: block;
  margin-top: 8px;
  color: #5A4947;
  font-weight: 600;
}

.hero-visual {
  position: relative;
  min-height: 420px;
  display: grid;
  align-content: center;
}

.hero-visual::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 30px;
  background: radial-gradient(circle at top left, rgba(143, 36, 54, 0.12), transparent 32%);
  pointer-events: none;
}

.visual-circle {
  position: absolute;
  top: -36px;
  right: -36px;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: rgba(143, 36, 54, 0.09);
  filter: blur(14px);
}

.visual-card {
  position: relative;
  overflow: hidden;
  padding: 28px;
  border-radius: 26px;
  background: rgba(255, 251, 245, 0.98);
  border: 1px solid rgba(110, 31, 47, 0.12);
  box-shadow: 0 24px 40px rgba(69, 52, 51, 0.08);
}

.visual-card--small {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: center;
  padding: 26px 28px;
  background: #FFF6ED;
}

.visual-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: #7E232F;
  color: #F8F1E7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 24px rgba(126, 35, 47, 0.18);
}

.visual-mockup {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 24px 26px;
  border-radius: 22px;
  background: rgba(255, 250, 244, 0.95);
  border: 1px solid rgba(110, 31, 47, 0.10);
  box-shadow: 0 16px 30px rgba(69, 52, 51, 0.07);
}

.mockup-photo {
  width: 100%;
  min-height: 120px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(110, 31, 47, 0.92), rgba(214, 188, 168, 0.16));
  background-blend-mode: multiply;
}

.mockup-copy {
  display: grid;
  gap: 10px;
}

.mockup-copy span {
  display: inline-block;
  color: #7E232F;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.mockup-copy p {
  margin: 0;
  color: #534741;
  line-height: 1.6;
  font-size: 0.96rem;
}

.visual-card--small p {
  margin: 8px 0 0;
  color: #564944;
  line-height: 1.5;
}

.benefits-section {
  padding: 88px 20px;
  max-width: 1180px;
  margin: 0 auto;
}

.benefits-section h2 {
  text-align: center;
  color: #6E1F2F;
  margin-bottom: 48px;
  font-size: clamp(2rem, 2.8vw, 2.5rem);
  font-family: var(--font-family-display);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}

.benefit-card {
  padding: 36px;
  background: rgba(255, 250, 244, 0.98);
  border-radius: 18px;
  text-align: left;
  border: 1px solid rgba(110, 31, 47, 0.10);
  box-shadow: 0 18px 30px rgba(69, 52, 51, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 44px rgba(69, 52, 51, 0.10);
}

.benefit-icon {
  color: #8B2F42;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.benefit-card h3 {
  color: #6E1F2F;
  margin-bottom: 14px;
  font-family: var(--font-family-display);
}

.benefit-card p {
  color: #4B403E;
  line-height: 1.75;
  font-family: Inter, system-ui, sans-serif;
}

.no-cost-section {
  padding: 88px 20px;
  background-color: #F2E7DB;
}

.info-card {
  max-width: 820px;
  margin: 0 auto;
  background: #FFF7EE;
  padding: 48px;
  border-radius: 18px;
  border-left: 5px solid #8B2F42;
  text-align: center;
  box-shadow: 0 20px 40px rgba(69, 52, 51, 0.08);
}

.info-card h2,
.info-card p {
  color: #4B403E;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.features-list li {
  color: #544541;
  font-weight: 700;
  background: rgba(143, 36, 54, 0.12);
  padding: 12px 20px;
  border-radius: 999px;
}

.cta-section {
  padding: 100px 20px;
  text-align: center;
  background-color: #6E1F2F;
  color: #F8F1E7;
}

.cta-section h2 {
  color: #F8F1E7;
  margin-bottom: 18px;
  font-family: var(--font-family-display);
  font-size: clamp(2.4rem, 3vw, 3rem);
}

.cta-section p {
  margin-bottom: 30px;
  opacity: 0.95;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(248, 241, 231, 0.92);
}

.btn-cta-large {
  background: #F8F1E7;
  color: #6E1F2F;
  border: 1px solid rgba(248, 241, 231, 0.8);
  box-shadow: 0 18px 36px rgba(110, 31, 47, 0.14);
}

.btn-cta-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 44px rgba(110, 31, 47, 0.18);
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 68px 18px 50px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-link {
    padding-left: 0;
  }

  .stat-card {
    min-width: 0;
    width: 100%;
  }

  .benefits-section,
  .no-cost-section,
  .cta-section {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>