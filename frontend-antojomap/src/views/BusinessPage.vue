<template>
  <div class="business-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Haz que tu restaurante sea el próximo antojo</h1>
        <p class="subtitle">Sin comisiones, solo visibilidad</p>
        <p class="description">
          No somos una app de delivery más. Somos el puente entre tu cocina y miles de foodies locales que usan nuestra Ruleta para decidir qué comer hoy.
        </p>
        <router-link to="/register" class="btn-cta">
          Registrar mi Restaurante
        </router-link>
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
      
    </section>
  </div>
</template>

<script setup>
import { Users, BarChart3, Zap } from 'lucide-vue-next'
</script>

<style scoped>
.business-page {
  min-height: 100vh;
  background-color: #FDFCFB; /* Blanco Crema */
}

.hero-section {
  padding: 120px 20px 60px;
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  color: #8D161B; /* Ciruela Profundo */
  margin-bottom: 12px;
  font-family: var(--font-family-display);
}

.subtitle {
  font-size: 1.5rem;
  color: #C64445; /* Rojo Coral */
  margin-bottom: 24px;
  font-weight: 600;
}

.description {
  max-width: 700px;
  margin: 0 auto 32px;
  color: var(--color-gray-600);
  line-height: 1.6;
}

.btn-cta, .btn-cta-large {
  background-color: #C64445;
  color: #FDFCFB;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s;
  display: inline-block;
}

.btn-cta:hover, .btn-cta-large:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
}

.benefits-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.benefits-section h2 {
  text-align: center;
  color: #8D161B;
  margin-bottom: 50px;
  font-size: 2.2rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.benefit-card {
  padding: 40px;
  background: white;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #eee;
}

.benefit-icon {
  color: #C64445;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.no-cost-section {
  padding: 80px 20px;
  background-color: #f9f7f2;
}

.info-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 20px;
  border-left: 5px solid #C64445;
  text-align: center;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.features-list li {
  color: #8D161B;
  font-weight: 600;
}

.cta-section {
  padding: 100px 20px;
  text-align: center;
  background-color: #8D161B;
  color: #FDFCFB;
}

.cta-section h2 { color: white; }
.cta-section p { margin-bottom: 30px; opacity: 0.9; }

.btn-cta-large {
  background-color: white;
  color: #8D161B;
}
</style>