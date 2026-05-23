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

        <!-- Menú -->
        <section class="section-card">
          <h2 class="section-title">Menú</h2>
          <div v-if="cargando" class="loading">Cargando menú...</div>
          <div v-else-if="menu.length === 0" class="empty">No hay platos disponibles aún.</div>
          <div v-else class="menu-grid">
            <div v-for="item in menu" :key="item.id" class="menu-card">
              <div class="menu-card-img">
                <img v-if="item.foto_url" :src="item.foto_url" :alt="item.nombre" />
                <div v-else class="img-placeholder">🍽️</div>
                <span v-if="!item.disponible" class="badge-no-disp">No disponible</span>
              </div>
              <div class="menu-card-info">
                <h3>{{ item.nombre }}</h3>
                <p v-if="item.descripcion">{{ item.descripcion }}</p>
                <span class="menu-price">Bs {{ item.precio }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Reseñas -->
        <section class="section-card">
          <div class="reviews-header">
            <h2 class="section-title">Reseñas</h2>
            <button class="btn-review" @click="showReviewForm = !showReviewForm">
              {{ showReviewForm ? 'Cancelar' : '✏️ Dejar reseña' }}
            </button>
          </div>

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
            <button class="btn-submit-review" @click="enviarReview" :disabled="enviandoReview">
              {{ enviandoReview ? 'Enviando...' : 'Publicar reseña' }}
            </button>
            <p v-if="reviewError" class="review-error">{{ reviewError }}</p>
          </div>

          <!-- Lista de reseñas -->
          <div v-if="reviews.length === 0 && !showReviewForm" class="empty">Sin reseñas aún. ¡Sé el primero!</div>
          <div class="reviews-list">
            <div v-for="r in reviews" :key="r.id" class="review-card">
              <div class="review-top">
                <div class="review-stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= r.puntuacion }">★</span>
                </div>
                <span class="review-fecha">{{ formatFecha(r.fecha) }}</span>
              </div>
              <p class="review-comentario">{{ r.comentario }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna derecha: info -->
      <aside class="col-aside">
        <div class="section-card info-card">
          <h2 class="section-title">Información</h2>

          <div v-if="restaurante.telefono" class="info-row">
            <span class="info-icon">📞</span>
            <span>{{ restaurante.telefono }}</span>
          </div>

          <div v-if="categoria" class="info-row">
            <span class="info-icon">🍴</span>
            <span>{{ categoria }}</span>
          </div>

          <!-- Horarios -->
          <div v-if="horarios.length > 0" class="horarios">
            <h3 class="horarios-title">Horarios</h3>
            <div v-for="h in horarios" :key="h.id" class="horario-row">
              <span class="dia">{{ diasSemana[h.dia_semana] }}</span>
              <span class="horas">{{ h.apertura }} – {{ h.cierre }}</span>
            </div>
          </div>

          <!-- Mapa -->
          <div v-if="restaurante.latitud" class="mapa-section">
            <h3 class="horarios-title">Ubicación</h3>
            <div id="mapa-detalle" class="mapa"></div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
    menu.value = data || []
  } catch (e) {}

  cargando.value = false
  await cargarHorarios()
  await cargarReviews()
  await initMapa()
})
</script>

<style scoped>
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

/* Menú grid */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.menu-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0ede7;
  transition: transform 0.2s, box-shadow 0.2s;
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
  color: #FF6B00;
}

/* Reseñas */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.reviews-header .section-title { margin: 0; }

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
.star.active { color: #FF6B00; }

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
.review-form textarea:focus { outline: none; border-color: #FF6B00; }

.btn-submit-review {
  padding: 10px 24px;
  background: #FF6B00;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-submit-review:hover:not(:disabled) { background: #e05f00; }
.btn-submit-review:disabled { opacity: 0.6; cursor: not-allowed; }
.review-error { color: #c00; font-size: 0.88rem; margin-top: 8px; }

.reviews-list { display: flex; flex-direction: column; gap: 16px; }
.review-card {
  padding: 16px;
  background: #faf8f6;
  border-radius: 10px;
  border-left: 3px solid #FF6B00;
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
.info-card { position: sticky; top: 24px; }

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0ede7;
  font-size: 0.95rem;
  color: #444;
}
.info-icon { font-size: 1.1rem; }

.horarios { margin-top: 20px; }
.horarios-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--plum, #481827);
  margin: 0 0 12px 0;
}
.horario-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.88rem;
  color: #555;
  border-bottom: 1px solid #f5f5f5;
}
.dia { font-weight: 600; color: #333; }
.horas { color: #FF6B00; font-weight: 600; }

.mapa-section { margin-top: 20px; }
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

@media (max-width: 900px) {
  .page-body { grid-template-columns: 1fr; }
  .info-card { position: static; }
  .hero-content h1 { font-size: 1.8rem; }
}

@media (max-width: 600px) {
  .hero { height: 240px; }
  .hero-overlay { padding: 24px; }
  .page-body { padding: 16px; }
  .section-card { padding: 20px; }
  .menu-grid { grid-template-columns: 1fr; }
}
</style>