<template>
  <section class="recommended-section">
    <div class="section-header">
      <div>
        <h2>Recomendado para ti</h2>
        <p>Basado en tus gustos y ubicaciones populares</p>
      </div>
      <button class="see-all-btn" @click="verTodos">Ver todos →</button>
    </div>
    
    <!-- Contenedor Glassmorphism que envuelve todo el carrusel -->
    <div class="carousel-glass-container">
      <!-- Degradado lateral izquierdo (fade) -->
      <div class="fade-edge fade-left"></div>
      
      <!-- Degradado lateral derecho (fade) -->
      <div class="fade-edge fade-right"></div>
      
      <!-- Carrusel 3D con 5 Tarjetas Visibles -->
      <div 
        class="carousel-5d-container"
        @mouseenter="pauseAutoPlay"
        @mouseleave="startAutoPlay"
      >
        <div class="carousel-5d-track">
          <div
            v-for="(slide, idx) in restaurantes"
            :key="slide.id"
            class="carousel-card"
            :class="getCardClasses(idx)"
            @click="goToSlide(idx)"
          >
            <!-- Contenedor vertical amplio (4:5) -->
            <div class="image-portrait" :class="{ 'cursor-pointer': idx !== currentIndex }">
              <div class="portrait-inner" :class="{ 'center-shadow': idx === currentIndex }">
                <img 
                  :src="slide.image" 
                  :alt="slide.name"
                  class="food-image"
                  :class="{ 'zoom-on-hover': idx === currentIndex }"
                />
                <div class="image-overlay"></div>
              </div>
              
              <!-- Badge flotante solo en tarjeta central (estilo refinado) -->
              <div v-if="idx === currentIndex" class="slide-badge" :class="getBadgeClass(slide.badge)">
                <span class="badge-dot" :class="getBadgeDotClass(slide.badge)"></span>
                {{ slide.badge }}
              </div>
            </div>
            
            <!-- Tarjeta de información solo en tarjeta central -->
            <div v-if="idx === currentIndex" class="info-card">
              <div class="restaurant-logo">
                <img 
                  :src="slide.logo || `https://ui-avatars.com/api/?background=F97316&color=fff&name=${slide.name.charAt(0)}`" 
                  :alt="slide.name"
                />
              </div>
              
              <div class="info-content">
                <h3 class="restaurant-name">{{ slide.name }}</h3>
                <p class="categories">{{ slide.category }}</p>
                <div class="rating-info">
                  <span class="stars">{{ slide.rating }}</span>
                  <span class="separator">•</span>
                  <span class="delivery-time">{{ slide.deliveryTime }}</span>
                </div>
                <button class="cta-btn" @click.stop="verRestaurante(slide.id)">
                  Ver restaurante
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Dots indicadores -->
        <div class="carousel-dots">
          <button
            v-for="(_, idx) in restaurantes"
            :key="idx"
            @click="goToSlide(idx)"
            class="dot"
            :class="{ active: currentIndex === idx }"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()

// Estado del carrusel
const currentIndex = ref(0)
const autoPlayInterval = ref(null)
const isHovering = ref(false)
const isAnimating = ref(false)

// Datos de restaurantes
const restaurantes = ref([
  {
    id: 1,
    name: 'The Burger Joint',
    category: 'Hamburguesas • Comida Rápida',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&h=900&fit=crop',
    rating: '⭐ 4.8',
    deliveryTime: '20-30 min',
    badge: 'Promoción',
    logo: ''
  },
  {
    id: 2,
    name: 'Sakura Sushi',
    category: 'Sushi • Japonesa',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&h=900&fit=crop',
    rating: '⭐ 4.6',
    deliveryTime: '35-45 min',
    badge: 'Nuevo',
    logo: ''
  },
  {
    id: 3,
    name: 'Bella Pizza',
    category: 'Pizza • Italiana',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=700&h=900&fit=crop',
    rating: '⭐ 4.9',
    deliveryTime: '25-35 min',
    badge: 'Popular',
    logo: ''
  },
  {
    id: 4,
    name: 'Taco Express',
    category: 'Mexicana • Tacos',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=700&h=900&fit=crop',
    rating: '⭐ 4.7',
    deliveryTime: '15-20 min',
    badge: 'Promoción',
    logo: ''
  },
  {
    id: 5,
    name: 'Green Bowl',
    category: 'Comida Saludable • Ensaladas',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&h=900&fit=crop',
    rating: '⭐ 4.5',
    deliveryTime: '15-25 min',
    badge: 'Nuevo',
    logo: ''
  },
  {
    id: 6,
    name: 'Pasta Fresh',
    category: 'Italiana • Pastas',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=700&h=900&fit=crop',
    rating: '⭐ 4.8',
    deliveryTime: '20-30 min',
    badge: 'Popular',
    logo: ''
  },
  {
    id: 7,
    name: 'Wok Oriental',
    category: 'China • Asiática',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&h=900&fit=crop',
    rating: '⭐ 4.7',
    deliveryTime: '25-35 min',
    badge: 'Nuevo',
    logo: ''
  }
])

const getBadgeClass = (badge) => {
  const classes = {
    'Promoción': 'badge-promo',
    'Nuevo': 'badge-new',
    'Popular': 'badge-popular'
  }
  return classes[badge] || 'badge-default'
}

const getBadgeDotClass = (badge) => {
  const classes = {
    'Promoción': 'dot-promo',
    'Nuevo': 'dot-new',
    'Popular': 'dot-popular'
  }
  return classes[badge] || 'dot-default'
}

// Obtener posición relativa de cada tarjeta
const getRelativePosition = (idx) => {
  const total = restaurantes.value.length
  let diff = idx - currentIndex.value
  
  if (diff > total / 2) diff -= total
  if (diff < -total / 2) diff += total
  
  if (diff < -2) return null
  if (diff > 2) return null
  
  return diff
}

// Asignar clases según posición
const getCardClasses = (idx) => {
  const pos = getRelativePosition(idx)
  const classes = ['transition-all duration-400 ease-out']
  
  if (pos === null) {
    classes.push('card-hidden')
  } 
  else if (pos === 0) {
    classes.push('card-center')
  }
  else if (pos === -1) {
    classes.push('card-left-1')
  }
  else if (pos === 1) {
    classes.push('card-right-1')
  }
  else if (pos === -2) {
    classes.push('card-left-2')
  }
  else if (pos === 2) {
    classes.push('card-right-2')
  }
  
  return classes
}

// Navegación con animación GSAP
const nextSlide = async () => {
  if (isAnimating.value) return
  isAnimating.value = true
  
  const newIndex = (currentIndex.value + 1) % restaurantes.value.length
  await animateTransition(newIndex)
  
  isAnimating.value = false
  resetAutoPlay()
}

const prevSlide = async () => {
  if (isAnimating.value) return
  isAnimating.value = true
  
  const newIndex = (currentIndex.value - 1 + restaurantes.value.length) % restaurantes.value.length
  await animateTransition(newIndex)
  
  isAnimating.value = false
  resetAutoPlay()
}

const goToSlide = async (index) => {
  if (isAnimating.value || index === currentIndex.value) return
  isAnimating.value = true
  
  await animateTransition(index)
  
  isAnimating.value = false
  resetAutoPlay()
}

// Animación suave de transición
const animateTransition = async (newIndex) => {
  const visibleCards = document.querySelectorAll('.carousel-card:not(.card-hidden)')
  
  if (visibleCards.length) {
    await gsap.to(visibleCards, {
      filter: 'blur(6px)',
      opacity: 0.7,
      duration: 0.2,
      ease: 'power2.in',
      stagger: 0.03
    })
  }
  
  currentIndex.value = newIndex
  
  await new Promise(resolve => setTimeout(resolve, 50))
  
  const newVisibleCards = document.querySelectorAll('.carousel-card:not(.card-hidden)')
  
  if (newVisibleCards.length) {
    gsap.set(newVisibleCards, {
      filter: 'blur(6px)',
      opacity: 0.7
    })
    
    await gsap.to(newVisibleCards, {
      filter: 'blur(0px)',
      opacity: 1,
      duration: 0.35,
      ease: 'back.out(0.3)',
      stagger: 0.04
    })
  }
}

// Auto-play: 4.5 segundos
const startAutoPlay = () => {
  if (autoPlayInterval.value) clearInterval(autoPlayInterval.value)
  autoPlayInterval.value = setInterval(() => {
    if (!isAnimating.value && !isHovering.value) {
      nextSlide()
    }
  }, 4500)
}

const pauseAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const resetAutoPlay = () => {
  pauseAutoPlay()
  startAutoPlay()
}

const verRestaurante = (id) => {
  router.push(`/restaurante/${id}`)
}

const verTodos = () => {
  router.push('/explorar')
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  pauseAutoPlay()
})
</script>

<style scoped>
.recommended-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, #8B2A4E 0%, #6B1B3C 100%);
  overflow-x: clip;
}

.section-header {
  max-width: 1400px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 20px;
}

.section-header h2 {
  font-size: 2.2rem;
  color: #FFF8F0;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.section-header p {
  color: #E8D5B5;
  font-size: 1rem;
  margin: 0;
}

.see-all-btn {
  background: rgba(255, 248, 240, 0.2);
  border: 1px solid rgba(255, 248, 240, 0.4);
  color: #FFF8F0;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.see-all-btn:hover {
  background: rgba(255, 248, 240, 0.3);
  transform: translateX(3px);
}

/* ========== CONTENEDOR GLASSMORPHISM ========== */
.carousel-glass-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 48px;
  padding: 40px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* Degradados laterales para difuminar bordes */
.fade-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 25;
  pointer-events: none;
}

.fade-left {
  left: 0;
  background: linear-gradient(to right, 
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.15) 50%,
    transparent 100%
  );
}

.fade-right {
  right: 0;
  background: linear-gradient(to left, 
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.15) 50%,
    transparent 100%
  );
}

/* ========== CARRUSEL 5D ========== */
.carousel-5d-container {
  overflow: visible;
  padding: 10px 0;
}

.carousel-5d-track {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 650px;
}

.carousel-card {
  position: absolute;
  transition-property: all;
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  will-change: transform, opacity, filter;
}

/* ===== POSICIONES DE LAS 5 TARJETAS ===== */

/* CENTRO */
.carousel-card.card-center {
  position: relative;
  z-index: 30;
  transform: scale(1) translateX(0);
  opacity: 1;
  filter: blur(0px);
}

/* IZQUIERDA NIVEL 1 */
.carousel-card.card-left-1 {
  z-index: 20;
  transform: scale(0.85) translateX(-240px);
  opacity: 0.9;
  filter: blur(2px);
}

/* DERECHA NIVEL 1 */
.carousel-card.card-right-1 {
  z-index: 20;
  transform: scale(0.85) translateX(240px);
  opacity: 0.9;
  filter: blur(2px);
}

/* IZQUIERDA NIVEL 2 */
.carousel-card.card-left-2 {
  z-index: 10;
  transform: scale(0.70) translateX(-420px);
  opacity: 0.6;
  filter: blur(4px);
}

/* DERECHA NIVEL 2 */
.carousel-card.card-right-2 {
  z-index: 10;
  transform: scale(0.70) translateX(420px);
  opacity: 0.6;
  filter: blur(4px);
}

/* Tarjetas ocultas */
.carousel-card.card-hidden {
  display: none;
}

/* ===== IMAGEN VERTICAL ===== */
.image-portrait {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  position: relative;
}

.portrait-inner {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 28px;
  transition: box-shadow 0.3s ease;
}

/* Sombra especial para la tarjeta central */
.portrait-inner.center-shadow {
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6);
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease-out;
}

.zoom-on-hover {
  transition: transform 0.7s ease-out;
}

.image-portrait:hover .zoom-on-hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
  border-radius: 28px;
  pointer-events: none;
}

/* ===== BADGE REFINADO ===== */
.slide-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 15;
  padding: 6px 14px;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 500;
  color: white;
  letter-spacing: 0.3px;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.badge-promo {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(234, 88, 12, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dot-promo {
  background: #FBBF24;
  box-shadow: 0 0 4px #FBBF24;
}

.badge-new {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dot-new {
  background: #34D399;
  box-shadow: 0 0 4px #34D399;
}

.badge-popular {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dot-popular {
  background: #A78BFA;
  box-shadow: 0 0 4px #A78BFA;
}

/* ===== TARJETA DE INFORMACIÓN ===== */
.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px 22px;
  margin-top: 24px;
  width: 100%;
  max-width: 360px;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(249, 115, 22, 0.3);
}

.restaurant-logo {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.restaurant-logo img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.info-content {
  flex: 1;
  text-align: left;
}

.restaurant-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
}

.categories {
  font-size: 0.75rem;
  color: #E8D5B5;
  margin: 0 0 6px 0;
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.stars {
  font-size: 0.85rem;
  font-weight: 600;
  color: #FBBF24;
}

.separator {
  color: rgba(255, 255, 255, 0.4);
}

.delivery-time {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
}

.cta-btn {
  background: linear-gradient(135deg, #F97316, #EA580C);
  color: white;
  padding: 5px 16px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.cta-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

.btn-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.cta-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* Dots indicadores */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.dot {
  height: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  width: 24px;
}

.dot.active {
  background: linear-gradient(135deg, #F97316, #EA580C);
  width: 48px;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

/* Responsive */
@media (max-width: 1200px) {
  .carousel-card.card-left-1 {
    transform: scale(0.85) translateX(-180px);
  }
  
  .carousel-card.card-right-1 {
    transform: scale(0.85) translateX(180px);
  }
  
  .carousel-card.card-left-2 {
    transform: scale(0.70) translateX(-320px);
  }
  
  .carousel-card.card-right-2 {
    transform: scale(0.70) translateX(320px);
  }
  
  .carousel-glass-container {
    padding: 30px 15px;
  }
}

@media (max-width: 1000px) {
  .carousel-card.card-left-1 {
    transform: scale(0.80) translateX(-140px);
  }
  
  .carousel-card.card-right-1 {
    transform: scale(0.80) translateX(140px);
  }
  
  .carousel-card.card-left-2 {
    transform: scale(0.65) translateX(-240px);
  }
  
  .carousel-card.card-right-2 {
    transform: scale(0.65) translateX(240px);
  }
  
  .image-portrait {
    max-width: 300px;
  }
  
  .info-card {
    max-width: 300px;
    padding: 14px 18px;
  }
  
  .fade-edge {
    width: 80px;
  }
}

@media (max-width: 800px) {
  .carousel-card.card-left-1 {
    transform: scale(0.75) translateX(-100px);
  }
  
  .carousel-card.card-right-1 {
    transform: scale(0.75) translateX(100px);
  }
  
  .carousel-card.card-left-2 {
    transform: scale(0.60) translateX(-180px);
  }
  
  .carousel-card.card-right-2 {
    transform: scale(0.60) translateX(180px);
  }
  
  .image-portrait {
    max-width: 260px;
  }
  
  .info-card {
    max-width: 260px;
    padding: 12px 16px;
  }
  
  .restaurant-name {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .carousel-glass-container {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    border-radius: 32px;
    padding: 20px 10px;
  }
  
  .fade-edge {
    width: 50px;
  }
  
  .carousel-5d-track {
    min-height: 550px;
  }
  
  .carousel-card.card-left-1,
  .carousel-card.card-right-1,
  .carousel-card.card-left-2,
  .carousel-card.card-right-2 {
    display: none;
  }
  
  .carousel-card.card-center {
    position: relative;
    transform: scale(1) translateX(0);
  }
  
  .image-portrait {
    max-width: 280px;
  }
  
  .info-card {
    max-width: 280px;
  }
}
</style>