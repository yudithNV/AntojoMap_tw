<template>
  <div class="menu-page">
    <button @click="router.back()" class="back-btn">← Volver</button>

    <!-- Hero / Portada -->
    <div class="hero" :style="restaurante.foto_portada ? `background-image: url(${restaurante.foto_portada})` : ''">
      <div class="hero-overlay">
        <div class="hero-content">
          <span v-if="categoria" class="categoria-chip">{{ categoria }}</span>
          <h1>{{ restaurante.nombre }}</h1>
          <p v-if="restaurante.direccion" class="hero-direccion">📍 {{ restaurante.direccion }}</p>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- Columna izquierda: menú + reseñas -->
      <div class="col-main">

        <!-- Descripción -->
        <section v-if="restaurante.descripcion" class="section-card">
          <p class="descripcion">{{ restaurante.descripcion }}</p>
        </section>

        <!-- Menú del Día (Destacado) -->
        <section v-if="menuDelDia.length > 0" class="section-card menu-del-dia-section">
          <h2 class="section-title">🌟 Menú del Día</h2>
          <div v-for="item in menuDelDia" :key="item.id" class="menu-del-dia-card">
            <div class="menu-del-dia-img">
              <img v-if="item.foto_url" :src="item.foto_url" :alt="item.nombre" />
              <div v-else class="img-placeholder">🍽️</div>
            </div>
            <div class="menu-del-dia-content">
              <div class="menu-del-dia-header">
                <div>
                  <h3>{{ item.nombre }}</h3>
                  <p class="menu-del-dia-subtitle">{{ item.descripcion }}</p>
                </div>
                <div class="menu-del-dia-price">
                  <div class="price-value">Bs {{ item.precio }}</div>
                  <div class="price-label">PRECIO POR PERSONA</div>
                </div>
              </div>

              <div v-if="item.tipo === 'almuerzo_completo'" class="meal-components">
                <div v-if="item.entrada_nombre" class="component-item">
                  <span class="component-icon">🍴</span>
                  <div>
                    <strong>Entrada</strong>
                    <p>{{ item.entrada_nombre }}</p>
                  </div>
                </div>
                <div v-if="item.principal_nombre" class="component-item">
                  <span class="component-icon">🍗</span>
                  <div>
                    <strong>Segundo</strong>
                    <p>{{ item.principal_nombre }}</p>
                  </div>
                </div>
                <div v-if="item.postre_nombre" class="component-item">
                  <span class="component-icon">🍰</span>
                  <div>
                    <strong>Bebida o Postre</strong>
                    <p>{{ item.postre_nombre }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Menú Regular -->
        <section class="section-card">
          <h2 class="section-title">{{ menuDelDia.length > 0 ? 'Menú Regular' : 'Menú' }}</h2>
          <div v-if="cargando" class="loading">Cargando menú...</div>
          <div v-else-if="menuRegular.length === 0" class="empty">No hay platos disponibles aún.</div>
          <div v-else class="menu-grid">
            <!-- Tarjeta con tooltip al hover -->
            <div 
              v-for="item in menuRegular" 
              :key="item.id" 
              class="menu-card"
              @mouseenter="showTooltip(item.id)"
              @mouseleave="hideTooltip(item.id)"
            >
              <div class="menu-card-img">
                <img v-if="item.foto_url" :src="item.foto_url" :alt="item.nombre" />
                <div v-else class="img-placeholder">🍽️</div>
                <span v-if="!item.disponible" class="badge-no-disp">No disponible</span>
              </div>
              <div class="menu-card-info">
                <h3>{{ item.nombre }}</h3>
                <span class="menu-price">Bs {{ item.precio }}</span>
                
                <div v-if="item.tipo === 'almuerzo_completo'" class="almuerzo-detalles">
                  <div v-if="item.entrada_nombre" class="detalle-item">
                    <span class="detalle-icon">🍴</span> {{ item.entrada_nombre }}
                  </div>
                  <div v-if="item.principal_nombre" class="detalle-item">
                    <span class="detalle-icon">🍗</span> {{ item.principal_nombre }}
                  </div>
                  <div v-if="item.postre_nombre" class="detalle-item">
                    <span class="detalle-icon">🍰</span> {{ item.postre_nombre }}
                  </div>
                </div>
                
                <p v-else-if="item.descripcion" class="menu-desc">{{ item.descripcion }}</p>
              </div>

              <!-- Tooltip flotante -->
              <Transition name="tooltip-fade">
                <div 
                  v-if="activeTooltip === item.id" 
                  class="menu-tooltip"
                  @mouseenter="keepTooltip(item.id)"
                  @mouseleave="hideTooltip(item.id)"
                >
                  <div class="tooltip-header">
                    <h4>{{ item.nombre }}</h4>
                    <span class="tooltip-price">Bs {{ item.precio }}</span>
                  </div>
                  
                  <div class="tooltip-divider"></div>
                  
                  <div class="tooltip-description">
                    <span class="tooltip-label">📝 Descripción</span>
                    <p>{{ item.descripcion || 'Sin descripción detallada' }}</p>
                  </div>
                  
                  <!-- Ingredientes o alérgenos -->
                  <div class="tooltip-ingredients">
                    <span class="tooltip-label">⚠️ Ingredientes / Alérgenos</span>
                    <div class="ingredients-content">
                      <p v-if="item.ingredientes">{{ item.ingredientes }}</p>
                      <p v-else class="no-ingredients">Consulta con el restaurante sobre ingredientes específicos o posibles alérgenos.</p>
                    </div>
                  </div>

                  <!-- Información adicional para almuerzos -->
                  <div v-if="item.tipo === 'almuerzo_completo'" class="tooltip-almuerzo">
                    <div class="tooltip-divider"></div>
                    <div class="tooltip-meal">
                      <span class="tooltip-label">🍴 Incluye:</span>
                      <div class="meal-items">
                        <span v-if="item.entrada_nombre" class="meal-tag">Entrada: {{ item.entrada_nombre }}</span>
                        <span v-if="item.principal_nombre" class="meal-tag">Principal: {{ item.principal_nombre }}</span>
                        <span v-if="item.postre_nombre" class="meal-tag">Postre: {{ item.postre_nombre }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </section>

        <!-- Reseñas -->
        <section class="section-card">
          <h2 class="section-title">Reseñas</h2>

          <!-- Formulario de reseña -->
          <div v-if="showReviewForm" class="review-form">
            <div class="stars-input">
              <span
                v-for="n in 5" :key="n"
                class="star"
                :class="{ active: n <= newReview.puntuacion }"
                @click="newReview.puntuacion = n"
              >★</span>
            </div>
            <textarea
              v-model="newReview.comentario"
              placeholder="Comparte tu experiencia..."
              rows="3"
            />
            <div class="review-form-buttons">
              <button class="btn-submit-review" @click="enviarReview" :disabled="enviandoReview">
                {{ enviandoReview ? 'Enviando...' : 'Publicar reseña' }}
              </button>
              <button class="btn-cancel-review" @click="showReviewForm = false">Cancelar</button>
            </div>
            <p v-if="reviewError" class="review-error">{{ reviewError }}</p>
          </div>

          <!-- Lista de reseñas -->
          <div v-if="reviews.length === 0 && !showReviewForm" class="empty">Sin reseñas aún. ¡Sé el primero!</div>
          <div class="reviews-list">
            <div v-for="r in reviews" :key="r.id" class="review-card">
              <div class="review-header">
                <div class="review-avatar" :style="{ backgroundColor: avatarColor(r.usuario?.nombre) }">
                  <img v-if="r.usuario?.foto_perfil" :src="r.usuario.foto_perfil" :alt="r.usuario.nombre" />
                  <span v-else>{{ r.usuario?.nombre?.charAt(0)?.toUpperCase() || '?' }}</span>
                </div>
                <div>
                  <p class="review-autor">{{ r.usuario?.nombre || 'Usuario' }}</p>
                  <div class="review-stars-row">
                    <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= r.puntuacion }">★</span>
                    <span class="review-fecha">{{ formatFecha(r.fecha) }}</span>
                  </div>
                </div>
              </div>
              <p class="review-comentario">{{ r.comentario }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna derecha: info -->
      <aside class="col-aside">
        <!-- Información Card -->
        <div class="section-card info-card">
          <h2 class="section-title">Información</h2>

          <!-- Horario -->
          <div v-if="horarios.length > 0" class="info-item">
            <div class="info-label-row">
              <span class="info-label-icon">⏰</span>
              <span class="info-label">Horario de atención</span>
            </div>
            <div class="horario-compact">
              <div v-for="h in horarios" :key="h.id" class="horario-line">
                <span class="dia">{{ diasSemana[h.dia_semana] }}</span>
                <span class="horas">{{ h.apertura }} – {{ h.cierre }}</span>
              </div>
            </div>
          </div>

          <!-- Teléfono -->
          <div v-if="restaurante.telefono" class="info-item">
            <div class="info-label-row">
              <span class="info-label-icon">📱</span>
              <span class="info-label">Teléfono</span>
            </div>
            <p class="info-value">{{ restaurante.telefono }}</p>
          </div>

          <!-- Categoría -->
          <div v-if="categoria" class="info-item">
            <div class="info-label-row">
              <span class="info-label-icon">🍽️</span>
              <span class="info-label">Tipo de Cocina</span>
            </div>
            <p class="info-value">{{ categoria }}</p>
          </div>

          <!-- Ubicación / Mapa -->
          <div v-if="restaurante.latitud" class="mapa-section">
            <h3 class="info-label">UBICACIÓN</h3>
            <div id="mapa-detalle" class="mapa"></div>
          </div>
        </div>

        <!-- Card Calificación Naranja -->
        <div class="card-calificar">
          <h3>¿Ya lo probaste?</h3>
          <p>Comparte tu experiencia con otros usuarios.</p>
          <button class="btn-calificar" @click="showReviewForm = true">
            📷 Calificar
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { restaurantesService, almuerzosService, feedbackService } from '@/services/menu.service.js'
import { api } from '@/services/api.js'

const router = useRouter()
const route = useRoute()
const restauranteId = route.params.id

const restaurante = ref({})
const categoria = ref('')
const menu = ref([])
const horarios = ref([])
const reviews = ref([])
const cargando = ref(true)
const showReviewForm = ref(false)
const enviandoReview = ref(false)
const reviewError = ref('')
const newReview = ref({ puntuacion: 5, comentario: '' })

// ===== ESTADOS PARA TOOLTIP =====
const activeTooltip = ref(null)
let tooltipTimeout = null

// ===== FUNCIONES DEL TOOLTIP =====
const showTooltip = (itemId) => {
  if (tooltipTimeout) clearTimeout(tooltipTimeout)
  activeTooltip.value = itemId
}

const hideTooltip = (itemId) => {
  tooltipTimeout = setTimeout(() => {
    if (activeTooltip.value === itemId) {
      activeTooltip.value = null
    }
  }, 100)
}

const keepTooltip = (itemId) => {
  if (tooltipTimeout) clearTimeout(tooltipTimeout)
  activeTooltip.value = itemId
}

// Computed properties para separar menú en dos secciones
const menuDelDia = computed(() => {
  return menu.value.filter(item => item.es_menu_del_dia === true && item.disponible !== false)
})

const menuRegular = computed(() => {
  return menu.value.filter(item => item.es_menu_del_dia !== true || item.disponible === false)
})

const diasSemana = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
  4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 0: 'Domingo'
}

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' })
}

const cargarHorarios = async () => {
  try {
    const data = await api.get(`/horarios/${restauranteId}`)
    horarios.value = data || []
  } catch (e) {}
}

const cargarReviews = async () => {
  try {
    const data = await feedbackService.getFeedbacksRestaurante(restauranteId)
    reviews.value = data || []
  } catch (e) {}
}

const enviarReview = async () => {
  if (!newReview.value.comentario.trim()) {
    reviewError.value = 'Escribe un comentario'
    return
  }
  enviandoReview.value = true
  reviewError.value = ''
  try {
    await feedbackService.crearFeedback({
      restaurante_id: restauranteId,
      puntuacion: newReview.value.puntuacion,
      comentario: newReview.value.comentario
    })
    newReview.value = { puntuacion: 5, comentario: '' }
    showReviewForm.value = false
    await cargarReviews()
  } catch (e) {
    reviewError.value = e.message || 'Error al enviar reseña'
  } finally {
    enviandoReview.value = false
  }
}

const avatarColors = ['#e57373','#f06292','#ba68c8','#7986cb','#4fc3f7','#4db6ac','#aed581','#ffb74d']
const avatarColor = (nombre) => {
  if (!nombre) return '#ccc'
  return avatarColors[nombre.charCodeAt(0) % avatarColors.length]
}

const initMapa = async () => {
  if (!restaurante.value.latitud) return
  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')
  setTimeout(() => {
    const mapa = L.map('mapa-detalle').setView([restaurante.value.latitud, restaurante.value.longitud], 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(mapa)
    L.marker([restaurante.value.latitud, restaurante.value.longitud]).addTo(mapa)
  }, 100)
}

onMounted(async () => {
  try {
    const r = await restaurantesService.getRestaurante(restauranteId)
    restaurante.value = r
    categoria.value = r.restaurante_categorias?.[0]?.categorias_restaurante?.nombre || ''
  } catch (e) {}

  try {
    const data = await almuerzosService.getAlmuerzos(restauranteId)
    menu.value = (data || []).filter(item => item.disponible)
  } catch (e) {}

  cargando.value = false
  await cargarHorarios()
  await cargarReviews()
  await initMapa()
})
</script>

<style scoped>
/* Estilos existentes (se mantienen igual) */
.menu-page {
  min-height: 100vh;
  background: #f5f5f0;
  font-family: inherit;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  padding: 8px 16px;
  background: var(--plum, #481827);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: background 0.2s;
}
.back-btn:hover { background: #6b2540; }

/* Hero */
.hero {
  width: 100%;
  height: 320px;
  background: linear-gradient(135deg, var(--plum, #481827) 0%, #8b3a52 100%);
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(30,10,15,0.85) 0%, rgba(30,10,15,0.3) 100%);
  display: flex;
  align-items: flex-end;
  padding: 40px;
}

.hero-content { color: white; }

.categoria-chip {
  display: inline-block;
  background: #FF6B00;
  color: white;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.hero-content h1 {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.768);
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.1;
}

.hero-direccion {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.85;
}

/* Layout */
.page-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 24px;
}

.section-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--plum, #481827);
  margin: 0 0 20px 0;
}

.descripcion {
  color: #555;
  line-height: 1.7;
  margin: 0;
  font-size: 1rem;
}

/* Menú grid - Posición relativa para el tooltip */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.menu-card {
  position: relative;
  border-radius: 12px;
  overflow: visible;
  border: 1px solid #f0ede7;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}
.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.menu-card-img {
  position: relative;
  height: 150px;
  background: #f5f0eb;
}
.menu-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}
.badge-no-disp {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}

.menu-card-info {
  padding: 14px;
}
.menu-card-info h3 {
  margin: 0 0 6px;
  font-size: 1rem;
  color: var(--plum, #481827);
  font-weight: 700;
}
.menu-card-info p {
  margin: 0 0 8px;
  font-size: 0.83rem;
  color: #888;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.menu-price {
  font-size: 1.1rem;
  font-weight: 800;
  color: #C0392B;
  display: block;
  margin: 8px 0;
}

.almuerzo-detalles {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0ede7;
}

.detalle-item {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detalle-icon {
  font-size: 1rem;
}

.menu-desc {
  margin: 8px 0 0 0;
  font-size: 0.83rem;
  color: #888;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== TOOLTIP FLOTANTE ===== */
.menu-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background: white;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 50;
  backdrop-filter: blur(0px);
  transition: all 0.2s ease;
}

/* Flecha del tooltip */
.menu-tooltip::before {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 16px;
  height: 16px;
  background: white;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

/* Para cards en el borde izquierdo */
.menu-card:first-child .menu-tooltip {
  left: 0;
  transform: translateX(0);
}
.menu-card:first-child .menu-tooltip::before {
  left: 20px;
  transform: rotate(45deg);
}

/* Para cards en el borde derecho */
.menu-card:last-child .menu-tooltip {
  left: auto;
  right: 0;
  transform: translateX(0);
}
.menu-card:last-child .menu-tooltip::before {
  left: auto;
  right: 20px;
  transform: rotate(45deg);
}

/* Animación del tooltip */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

.menu-card:first-child .tooltip-fade-enter-from,
.menu-card:first-child .tooltip-fade-leave-to {
  transform: translateX(0) translateY(8px);
}

.menu-card:last-child .tooltip-fade-enter-from,
.menu-card:last-child .tooltip-fade-leave-to {
  transform: translateX(0) translateY(8px);
}

/* Contenido del tooltip */
.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.tooltip-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--plum, #481827);
}

.tooltip-price {
  font-size: 1.1rem;
  font-weight: 800;
  color: #C0392B;
}

.tooltip-divider {
  height: 1px;
  background: linear-gradient(90deg, #FF6B00, #E8D5B5, #FF6B00);
  margin: 10px 0;
  opacity: 0.4;
}

.tooltip-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #FF6B00;
  margin-bottom: 6px;
}

.tooltip-description p {
  margin: 0 0 10px 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #555;
}

.tooltip-ingredients {
  margin-top: 4px;
}

.ingredients-content p {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #777;
  background: #FFF8F0;
  padding: 8px;
  border-radius: 12px;
}

.no-ingredients {
  font-style: italic;
  color: #999;
}

.tooltip-almuerzo {
  margin-top: 4px;
}

.tooltip-meal {
  margin-top: 6px;
}

.meal-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meal-tag {
  font-size: 0.75rem;
  color: #666;
  background: #F5F5F0;
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-block;
}

/* Responsive para tooltip en móviles */
@media (max-width: 640px) {
  .menu-tooltip {
    width: 240px;
    padding: 12px;
    bottom: calc(100% + 8px);
  }
  
  .tooltip-header h4 {
    font-size: 0.9rem;
  }
  
  .tooltip-price {
    font-size: 1rem;
  }
  
  .tooltip-description p,
  .ingredients-content p {
    font-size: 0.75rem;
  }
}

/* Reseñas */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.reviews-header .section-title { margin: 0; }

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}
.review-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.review-autor {
  font-weight: 700;
  font-size: 0.95rem;
  color: #333;
  margin: 0 0 4px 0;
}
.review-stars-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-review {
  padding: 8px 16px;
  background: var(--plum, #481827);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-review:hover { background: #6b2540; }

.review-form {
  background: #faf8f6;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.review-autor {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--plum, #481827);
  margin: 0 0 4px 0;
}

.stars-input {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}
.star {
  font-size: 1.8rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.15s;
}
.star.active { color: var(--plum, #481827); }

.review-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.review-form textarea:focus { outline: none; border-color: var(--plum, #481827); }

.btn-submit-review {
  padding: 10px 24px;
  background: var(--plum, #481827);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-submit-review:hover:not(:disabled) { background: var(--plum, #6b2540); }
.btn-submit-review:disabled { opacity: 0.6; cursor: not-allowed; }
.review-error { color: #c00; font-size: 0.88rem; margin-top: 8px; }

.reviews-list { display: flex; flex-direction: column; gap: 16px; }
.review-card {
  padding: 16px;
  background: #faf8f6;
  border-radius: 10px;
  border-left: 3px solid var(--plum, #481827);
}
.review-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.review-stars { display: flex; gap: 2px; }
.review-fecha { font-size: 0.8rem; color: #999; }
.review-comentario { margin: 0; color: #444; font-size: 0.93rem; line-height: 1.5; }

/* Aside */
.col-aside { position: sticky; top: 24px; align-self: start; }
.info-card { position: static; }

.info-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ede7;
}
.info-item:last-of-type {
  border-bottom: none;
}

.info-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.info-label-icon {
  font-size: 1.2rem;
  color: var(--plum, #481827);
}

.info-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.info-value {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.horario-compact {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.horario-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  padding: 4px 0;
}
.horario-line .dia {
  font-weight: 600;
  color: #333;
}
.horario-line .horas {
  color: var(--plum, #481827);
  font-weight: 600;
}

.mapa-section { 
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}
.mapa {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 12px;
}

.loading, .empty {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 0.95rem;
}

/* Menú del Día */
.menu-del-dia-section {
  background: linear-gradient(135deg, rgba(248, 245, 240, 0.8) 0%, rgba(255, 107, 0, 0.05) 100%);
  border: 2px solid #C0392B;
  box-shadow: 0 4px 16px rgba(72, 24, 39, 0.15);
}

.menu-del-dia-section .section-title {
  color: var(--plum, #C0392B);
  font-size: 1.5rem;
  text-shadow: 0 2px 4px rgba(72, 24, 39, 0.1);
  margin-bottom: 24px;
}

.menu-del-dia-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #FFE8CC;
  box-shadow: 0 2px 8px rgba(255, 107, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.menu-del-dia-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(255, 107, 0, 0.15);
}

.menu-del-dia-img {
  flex-shrink: 0;
  width: 260px;
  min-height: 220px;
  position: relative;
  background: #f5f0eb;
}
.menu-del-dia-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-del-dia-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.menu-del-dia-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.menu-del-dia-header > div:first-child {
  flex-grow: 1;
}

.menu-del-dia-header h3 {
  font-size: 1.3rem;
  color: var(--plum, #C0392B);
  margin: 0 0 4px 0;
  font-weight: 700;
}

.menu-del-dia-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: var(--plum, #C0392B);
  font-weight: 500;
}

.menu-del-dia-price {
  text-align: right;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #C0392B;
}

.price-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meal-components {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.component-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px;
  background: #FFF5ED;
  border-left: 3px solid #C0392B;
  border-radius: 6px;
}

.component-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.component-item strong {
  display: block;
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.component-item p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

/* Card Calificar */
.card-calificar {
  background: linear-gradient(135deg, var(--plum, #481827) 0%, var(--plum-dark, #6b2540) 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 6px 16px rgba(72, 24, 39, 0.25);
  margin-top: 24px;
}

.card-calificar h3 {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: white;
}

.card-calificar p {
  margin: 0 0 18px 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.btn-calificar {
  width: 100%;
  background: white;
  color: var(--plum, #481827);
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-calificar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-calificar:active {
  transform: translateY(0);
}

/* Review Form Buttons */
.review-form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn-cancel-review {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
}

.btn-cancel-review:hover {
  background: #efefef;
  border-color: #ccc;
}

.btn-submit-review {
  flex: 1;
}

@media (max-width: 900px) {
  .page-body { grid-template-columns: 1fr; }
  .info-card { position: static; }
  .hero-content h1 { font-size: 1.8rem; }
  .menu-del-dia-card { flex-direction: column; }
  .menu-del-dia-img { width: 100%; height: 180px; }
}

@media (max-width: 600px) {
  .hero { height: 240px; }
  .hero-overlay { padding: 24px; }
  .page-body { padding: 16px; }
  .section-card { padding: 20px; }
  .menu-grid { grid-template-columns: 1fr; }
  .menu-del-dia-card { flex-direction: column; }
  .menu-del-dia-img { width: 100%; height: 150px; }
  .menu-del-dia-header { flex-direction: column; }
  .menu-del-dia-price { text-align: left; }
}
</style>