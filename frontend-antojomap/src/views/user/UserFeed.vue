<template>
  <DashboardLayout>
    <div class="page-header">
      <div class="header-top">
        <h1>¿Qué se te antoja hoy?</h1>
        <p class="subtitle">Busca por nombre, categoría o deja que la ruleta decida por ti.</p>
      </div>
    </div>

    <!-- 🔥 BANNER CARRUSEL MEJORADO CON GSAP 🔥 -->
    <div class="hero-banner-wrapper">
      <div 
        class="banner-container group"
        @mouseenter="pauseBannerAutoPlay"
        @mouseleave="startBannerAutoPlay"
      >
        <div class="banner-carousel">
          <div 
            class="banner-track"
            :style="{ transform: `translateX(-${bannerIndex * 100}%)` }"
          >
            <div 
              v-for="(slide, idx) in banners" 
              :key="slide.id"
              class="banner-slide"
              :data-slide-index="idx"
            >
              <div class="banner-bg">
                <img :src="slide.image" :alt="slide.title" />
                <div class="banner-overlay"></div>
              </div>
              
              <div class="banner-content">
                <div class="content-wrapper">
                  <div class="badge-wrapper">
                    <span class="banner-badge" :class="slide.badgeClass">
                      {{ slide.badge }}
                    </span>
                  </div>
                  <h2 class="banner-title">{{ slide.title }}</h2>
                  <p class="banner-description">{{ slide.description }}</p>
                  <button class="banner-btn" @click="handleBannerAction(slide.action)">
                    {{ slide.btnText }}
                    <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          class="banner-nav-btn prev-btn"
          :class="{ visible: isBannerHovering }"
          @click="prevBannerSlide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <button 
          class="banner-nav-btn next-btn"
          :class="{ visible: isBannerHovering }"
          @click="nextBannerSlide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <div class="banner-dots">
          <button
            v-for="(_, idx) in banners"
            :key="idx"
            class="dot-line"
            :class="{ active: bannerIndex === idx }"
            @click="goToBannerSlide(idx)"
          ></button>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'restaurantes' }"
          @click="activeTab = 'restaurantes'"
        >
          <Store :size="20" />
          Restaurantes
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'platos' }"
          @click="activeTab = 'platos'"
        >
          <UtensilsCrossed :size="20" />
          Platos
        </button>
      </div>
    </div>

    <!-- TAB RESTAURANTES -->
    <div v-if="activeTab === 'restaurantes'" class="tab-content">
      <div class="search-bar">
        <Search :size="20" class="search-icon" />
        <input 
          v-model="searchRestaurantes" 
          type="text" 
          placeholder="Buscar por nombre..." 
          class="search-input" 
        />
      </div>

      <div v-if="restaurantesStore.categorias.length > 0" class="category-filter">
        <button 
          class="category-chip" 
          :class="{ active: selectedCategories.length === 0 }" 
          @click="selectedCategories = []"
        >
          Todos
        </button>
        <button 
          v-for="cat in restaurantesStore.categorias" 
          :key="cat" 
          class="category-chip" 
          :class="{ active: selectedCategories.includes(cat) }" 
          @click="toggleCategory(cat)"
        >
          {{ cat }}
        </button>
        <button class="btn-ruleta" @click="irARuleta">🎲 Sorpréndeme</button>
      </div>

      <!-- 🔥 CARRUSEL DE RESTAURANTES (en lugar de grid) 🔥 -->
      <div class="restaurants-carousel-wrapper">
        <div class="restaurants-carousel-container">
          <button 
            class="carousel-arrow carousel-arrow-left"
            @click="scrollRestaurantsLeft"
            v-if="showRestaurantArrows"
          >
            ‹
          </button>
          
          <div class="restaurants-carousel" ref="restaurantsCarouselRef">
            <div class="restaurants-carousel-track">
              <RestaurantCard 
                v-for="restaurant in filteredRestaurants" 
                :key="restaurant.id" 
                :restaurant="restaurant" 
                :linkTo="`/user/menu/${restaurant.id}`" 
                class="restaurant-carousel-card"
              />
            </div>
          </div>
          
          <button 
            class="carousel-arrow carousel-arrow-right"
            @click="scrollRestaurantsRight"
            v-if="showRestaurantArrows"
          >
            ›
          </button>
        </div>
        
        <div class="carousel-dots" v-if="filteredRestaurants.length > 0">
          <button
            v-for="(_, idx) in Math.ceil(filteredRestaurants.length / restaurantsPerView)"
            :key="idx"
            class="carousel-dot"
            :class="{ active: restaurantDotIndex === idx }"
            @click="goToRestaurantDot(idx)"
          ></button>
        </div>
      </div>

      <div v-if="filteredRestaurants.length === 0" class="no-results">
        <p>No encontramos restaurantes con esos filtros.</p>
        <button class="btn-clear" @click="clearRestaurantesFilters">Limpiar filtros</button>
      </div>
    </div>

    <!-- TAB PLATOS -->
    <div v-if="activeTab === 'platos'" class="tab-content">
      <div class="search-bar">
        <Search :size="20" class="search-icon" />
        <input 
          v-model="searchPlatos" 
          type="text" 
          placeholder="Buscar platos..." 
          class="search-input" 
        />
      </div>

      <div class="tipo-filter">
        <button 
          class="tipo-chip" 
          :class="{ active: selectedTipoPlato === '' }" 
          @click="selectedTipoPlato = ''"
        >
           Todos
        </button>
        <button 
          class="tipo-chip" 
          :class="{ active: selectedTipoPlato === 'plato_suelto' }" 
          @click="selectedTipoPlato = 'plato_suelto'"
        >
           Platos
        </button>
        <button 
          class="tipo-chip" 
          :class="{ active: selectedTipoPlato === 'almuerzo_completo' }" 
          @click="selectedTipoPlato = 'almuerzo_completo'"
        >
           Almuerzos Completos
        </button>
        <button 
  class="tipo-chip btn-sorprendeme" 
  @click="sortearPlatoSorpresa"
  :disabled="isSorteando"
>
  {{ isSorteando ? '🎲 Sorteando...' : '✨ Sorpréndeme' }}
</button>
      </div>

      <div v-if="buscandoPlatos" class="loading-state">
        <p>Buscando platos...</p>
      </div>
      <div v-else-if="!searchPlatos && selectedTipoPlato === ''" class="empty-platos">
        <UtensilsCrossed :size="48" stroke-width="1.5" />
        <p>¿Qué se te antoja?</p>
        <span>Busca un plato o filtra por tipo</span>
      </div>
      <div v-else-if="platosResultados.length === 0" class="no-results">
        <p>No encontramos platos con esos filtros.</p>
        <button class="btn-clear" @click="clearPlatosFilters">Limpiar filtros</button>
      </div>
      <div v-else class="platos-carousel-wrapper">
  <div class="platos-carousel-container">
    <button class="carousel-arrow carousel-arrow-left" @click="scrollPlatosLeft" v-if="platosResultados.length > 3">‹</button>
    <div class="platos-carousel" ref="platosCarouselRef">
      <div class="platos-carousel-track">
        <div v-for="plato in platosResultados" :key="plato.id" class="plato-card" @click="router.push(`/user/menu/${plato.restaurante_id}`)">
          <div class="plato-img">
            <img v-if="plato.foto_url" :src="plato.foto_url" :alt="plato.nombre" />
            <div v-else class="plato-img-placeholder">🍽️</div>
            <span class="plato-tipo-badge">{{ plato.tipo === 'plato_suelto' ? '🥘 Plato' : '🥗 Almuerzo' }}</span>
          </div>
          <div class="restaurante-strip">
            <img v-if="plato.restaurantes?.foto_portada" :src="plato.restaurantes.foto_portada" class="rest-mini-img" />
            <div v-else class="rest-mini-placeholder">🍴</div>
            <span class="rest-mini-nombre">{{ plato.restaurantes?.nombre }}</span>
          </div>
          <div class="plato-info">
            <h3>{{ plato.nombre }}</h3>
            <p v-if="plato.descripcion" class="plato-desc">{{ plato.descripcion }}</p>
            <div v-if="plato.tipo === 'almuerzo_completo'" class="plato-detalles">
              <span v-if="plato.entrada_nombre">🍴 {{ plato.entrada_nombre }}</span>
              <span v-if="plato.principal_nombre">🍗 {{ plato.principal_nombre }}</span>
              <span v-if="plato.postre_nombre">🍰 {{ plato.postre_nombre }}</span>
            </div>
            <span class="plato-precio">Bs {{ plato.precio }}</span>
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-arrow carousel-arrow-right" @click="scrollPlatosRight" v-if="platosResultados.length > 3">›</button>
  </div>
</div>
    </div>

    <RuletaPlatos 
      :isOpen="mostrarRuleta" 
      @close="mostrarRuleta = false"
    />

    <Teleport to="body">
      <div v-if="showRuletaRestaurantes" class="ruleta-overlay" @click.self="showRuletaRestaurantes = false">
        <div class="ruleta-modal">
          <button class="ruleta-close" @click="showRuletaRestaurantes = false">×</button>
          <WheelSpinner />
        </div>
      </div>
    </Teleport>
    <!-- MODAL SORTEO CARTA -->
<Teleport to="body">
  <Transition name="sorteo-fade">
    <div v-if="showSorteoModal" class="sorteo-overlay" @click.self="showSorteoModal = false">
      <div class="sorteo-card-wrapper">
        <div class="sorteo-card" :class="{ flipped: cartaFlipped }">
          <div class="sorteo-card-front">
            <div class="sorteo-front-content">
              <div class="sorteo-spinner">🎲</div>
              <p class="sorteo-loading-text">Sorteando...</p>
              <div class="sorteo-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <div class="sorteo-card-back">
            <div v-if="platoSorteado" class="sorteo-result">
              <button class="sorteo-close" @click="showSorteoModal = false">×</button>
              <div class="sorteo-result-img">
                <img v-if="platoSorteado.foto_url" :src="platoSorteado.foto_url" :alt="platoSorteado.nombre" />
                <div v-else class="sorteo-img-placeholder">🍽️</div>
              </div>
              <p class="sorteo-label">¡Tu antojo de hoy es!</p>
              <h3 class="sorteo-nombre">{{ platoSorteado.nombre }}</h3>
              <p class="sorteo-restaurante">{{ platoSorteado.restaurantes?.nombre }}</p>
              <span class="sorteo-precio">Bs {{ platoSorteado.precio }}</span>
              <button class="sorteo-btn-ver" @click="router.push(`/user/menu/${platoSorteado.restaurante_id}`); showSorteoModal = false">
                Ver restaurante →
              </button>
              <button class="sorteo-btn-repetir" @click="repetirSorteo">
                🎲 Otro plato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router' 
import { Search, UtensilsCrossed, Store } from 'lucide-vue-next'
import gsap from 'gsap'
import DashboardLayout from '../../components/DashboardLayout.vue'
import RestaurantCard from '../../components/RestaurantCard.vue'
import RuletaPlatos from '../../components/RuletaPlatos.vue'
import WheelSpinner from '../../components/WheelSpinner.vue'
import { useRestaurantesStore } from '../../stores/restaurantes.store.js'
import { useFavoritosStore } from '../../stores/favoritos.store.js'
import { almuerzosService } from '../../services/menu.service.js'

const router = useRouter()
const route = useRoute() 
const restaurantesStore = useRestaurantesStore()
const favoritosStore = useFavoritosStore()
const irARuleta = () => router.push('/user/ruleta')

const showSorteoModal = ref(false)
const cartaFlipped = ref(false)
const platoSorteado = ref(null)
const isSorteando = ref(false)

const repetirSorteo = () => {
  cartaFlipped.value = false
  platoSorteado.value = null
  setTimeout(() => {
    const random = Math.floor(Math.random() * platosResultados.value.length)
    platoSorteado.value = platosResultados.value[random]
    cartaFlipped.value = true
  }, 1800)
}

const sortearPlatoSorpresa = async () => {
  if (platosResultados.value.length === 0) {
    // Si no hay platos cargados, carga todos
    selectedTipoPlato.value = 'plato_suelto'
    await buscarPlatos()
  }
  if (platosResultados.value.length === 0) return

  isSorteando.value = true
  cartaFlipped.value = false
  platoSorteado.value = null
  showSorteoModal.value = true

  // Espera animación del frente
  setTimeout(() => {
    const random = Math.floor(Math.random() * platosResultados.value.length)
    platoSorteado.value = platosResultados.value[random]
    cartaFlipped.value = true
    isSorteando.value = false
  }, 1800)
}

const platosCarouselRef = ref(null)

const scrollPlatosLeft = () => {
  platosCarouselRef.value?.scrollBy({ left: -320, behavior: 'smooth' })
}

const scrollPlatosRight = () => {
  platosCarouselRef.value?.scrollBy({ left: 320, behavior: 'smooth' })
}

// ========== BANNER CARRUSEL ==========
const bannerIndex = ref(0)
const bannerAutoPlayInterval = ref(null)
const isBannerHovering = ref(false)
const isBannerAnimating = ref(false)

const banners = ref([
  {
    id: 1,
    title: '🍕 Pizzas Lovers',
    description: 'Las mejores pizzas artesanales con ingredientes frescos y masa madre.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1200&h=400&fit=crop',
    badge: 'Promoción',
    badgeClass: 'badge-promo',
    btnText: 'Ver restaurante',
    action: { type: 'restaurant', id: '00eab37-7fe5-491b-a2e9-b236d2fdfb85' }
  },
  {
    id: 2,
    title: '🍣 Takeshii Sushi',
    description: 'El mejor sushi japonés con ingredientes de primera calidad.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=400&fit=crop',
    badge: 'Destacado',
    badgeClass: 'badge-featured',
    btnText: 'Ordenar ahora',
    action: { type: 'restaurant', id: '327d6b43-c02f-45c1-bfda-0c1255c48095' }
  },
  {
    id: 3,
    title: '🌮 Taqueria El Chilango',
    description: 'Los tacos más auténticos con tortilla recién hecha. ¡Llega a tu casa en 20 min!',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=1200&h=400&fit=crop',
    badge: 'Nuevo',
    badgeClass: 'badge-new',
    btnText: 'Explorar',
    action: { type: 'restaurant', id: 'ab0c4e2f-eb29-45bb-a6a5-5836376da8bb' }
  },
  {
    id: 4,
    title: '🍔 Smash & Go Burger',
    description: 'Las mejores hamburguesas artesanales con mucho sabor.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=400&fit=crop',
    badge: 'Popular',
    badgeClass: 'badge-featured',
    btnText: 'Ver restaurante',
    action: { type: 'restaurant', id: '8774d1a2-58de-4cdb-a50a-f8d8ccafad6' }
  },
  {
    id: 5,
    title: '🥗 Green & Fresh Co.',
    description: 'Ensaladas frescas y bowls nutritivos para una vida saludable.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=400&fit=crop',
    badge: 'Oferta',
    badgeClass: 'badge-offer',
    btnText: 'Ver más',
    action: { type: 'restaurant', id: 'aaf87690-156d-45e7-840a-3d5920a70c5a' }
  }
])

const animateSlideContent = async (slideElement) => {
  if (!slideElement) return
  const badge = slideElement.querySelector('.badge-wrapper')
  const title = slideElement.querySelector('.banner-title')
  const description = slideElement.querySelector('.banner-description')
  const button = slideElement.querySelector('.banner-btn')
  
  gsap.set([badge, title, description, button], { opacity: 0, y: 20, filter: 'blur(4px)' })
  const tl = gsap.timeline()
  tl.to(badge, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'back.out(0.5)' })
  tl.to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'back.out(0.5)' }, '-=0.2')
  tl.to(description, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'back.out(0.5)' }, '-=0.15')
  tl.to(button, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'back.out(0.5)' }, '-=0.1')
}

const changeBannerSlide = async (newIndex) => {
  if (isBannerAnimating.value) return
  isBannerAnimating.value = true
  const slides = document.querySelectorAll('.banner-slide')
  const currentSlide = slides[bannerIndex.value]
  const newSlide = slides[newIndex]
  
  if (currentSlide && newSlide) {
    const currentContent = currentSlide.querySelectorAll('.badge-wrapper, .banner-title, .banner-description, .banner-btn')
    gsap.to(currentContent, { opacity: 0, y: -20, filter: 'blur(4px)', duration: 0.3, ease: 'power2.in' })
    await new Promise(resolve => setTimeout(resolve, 150))
    bannerIndex.value = newIndex
    await nextTick()
    await animateSlideContent(newSlide)
  } else {
    bannerIndex.value = newIndex
    await nextTick()
    const newSlideElem = slides[newIndex]
    if (newSlideElem) await animateSlideContent(newSlideElem)
  }
  isBannerAnimating.value = false
  resetBannerAutoPlay()
}

const nextBannerSlide = async () => {
  if (isBannerAnimating.value) return
  const newIndex = (bannerIndex.value + 1) % banners.value.length
  await changeBannerSlide(newIndex)
}

const prevBannerSlide = async () => {
  if (isBannerAnimating.value) return
  const newIndex = (bannerIndex.value - 1 + banners.value.length) % banners.value.length
  await changeBannerSlide(newIndex)
}

const goToBannerSlide = async (index) => {
  if (isBannerAnimating.value || index === bannerIndex.value) return
  await changeBannerSlide(index)
}

const startBannerAutoPlay = () => {
  if (bannerAutoPlayInterval.value) clearInterval(bannerAutoPlayInterval.value)
  bannerAutoPlayInterval.value = setInterval(() => {
    if (!isBannerHovering.value && !isBannerAnimating.value) nextBannerSlide()
  }, 5000)
}

const pauseBannerAutoPlay = () => {
  isBannerHovering.value = true
  if (bannerAutoPlayInterval.value) clearInterval(bannerAutoPlayInterval.value)
}

const resetBannerAutoPlay = () => {
  if (bannerAutoPlayInterval.value) clearInterval(bannerAutoPlayInterval.value)
  isBannerHovering.value = false
  startBannerAutoPlay()
}

const handleBannerAction = (action) => {
  if (action.type === 'restaurant') router.push(`/user/menu/${action.id}`)
}

// ========== CARRUSEL DE RESTAURANTES ==========
const restaurantsCarouselRef = ref(null)
const showRestaurantArrows = ref(true)
const restaurantDotIndex = ref(0)
const restaurantsPerView = 3

// Verificar si hay scroll para mostrar flechas
const updateRestaurantArrows = () => {
  if (!restaurantsCarouselRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = restaurantsCarouselRef.value
  showRestaurantArrows.value = scrollWidth > clientWidth
  const currentDot = Math.round(scrollLeft / (clientWidth))
  restaurantDotIndex.value = currentDot
}

const scrollRestaurantsLeft = () => {
  if (restaurantsCarouselRef.value) {
    restaurantsCarouselRef.value.scrollBy({ left: -320, behavior: 'smooth' })
  }
}

const scrollRestaurantsRight = () => {
  if (restaurantsCarouselRef.value) {
    restaurantsCarouselRef.value.scrollBy({ left: 320, behavior: 'smooth' })
  }
}

const goToRestaurantDot = (index) => {
  if (restaurantsCarouselRef.value) {
    const scrollAmount = index * restaurantsCarouselRef.value.clientWidth
    restaurantsCarouselRef.value.scrollTo({ left: scrollAmount, behavior: 'smooth' })
  }
}

// ========== ESTADO EXISTENTE ==========
const showRuletaRestaurantes = ref(false)
const activeTab = ref('restaurantes')
const searchRestaurantes = ref('')
const selectedCategories = ref([])
const searchPlatos = ref('')
const selectedTipoPlato = ref('')
const platosResultados = ref([])
const buscandoPlatos = ref(false)
const mostrarRuleta = ref(false)
let busquedaActual = 0

const filteredRestaurants = computed(() => {
  let resultado = restaurantesStore.restaurantes
  const query = searchRestaurantes.value.trim().toLowerCase()
  if (query) resultado = resultado.filter(r => r.nombre?.toLowerCase().includes(query))
  if (selectedCategories.value.length > 0) {
    const categorias = new Set(selectedCategories.value)
    resultado = resultado.filter(r => categorias.has(r.category || ''))
  }
  return resultado
})

const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  index > -1 ? selectedCategories.value.splice(index, 1) : selectedCategories.value.push(category)
}

const clearRestaurantesFilters = () => {
  searchRestaurantes.value = ''
  selectedCategories.value = []
}

const buscarPlatos = async () => {
  const query = searchPlatos.value.trim()
  const tipo = selectedTipoPlato.value
  const busquedaId = ++busquedaActual
  if (!query && !tipo) { platosResultados.value = []; return }
  buscandoPlatos.value = true
  try {
    const data = await almuerzosService.buscarPlatos(query, tipo)
    if (busquedaId === busquedaActual) platosResultados.value = data || []
  } catch (err) {
    if (busquedaId === busquedaActual) platosResultados.value = []
  } finally {
    if (busquedaId === busquedaActual) buscandoPlatos.value = false
  }
}

let debounceTimer = null
watch([searchPlatos, selectedTipoPlato], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => buscarPlatos(), 300)
})

const clearPlatosFilters = () => {
  searchPlatos.value = ''
  selectedTipoPlato.value = ''
  platosResultados.value = []
}

onMounted(async () => {
  startBannerAutoPlay()
  restaurantesStore.cargarRestaurantes()
  restaurantesStore.cargarCategorias()
  favoritosStore.cargarFavoritos()
  await nextTick()
  const firstSlide = document.querySelector('.banner-slide')
  if (firstSlide) await animateSlideContent(firstSlide)
  const categoria = route.query.categoria
  if (categoria) selectedCategories.value = [categoria]
  
  // Inicializar carrusel de restaurantes
  if (restaurantsCarouselRef.value) {
    restaurantsCarouselRef.value.addEventListener('scroll', updateRestaurantArrows)
    updateRestaurantArrows()
  }
})

onUnmounted(() => {
  if (bannerAutoPlayInterval.value) clearInterval(bannerAutoPlayInterval.value)
  if (debounceTimer) clearTimeout(debounceTimer)
  busquedaActual++
  if (restaurantsCarouselRef.value) {
    restaurantsCarouselRef.value.removeEventListener('scroll', updateRestaurantArrows)
  }
})
</script>

<style scoped>
/* ========== ESTILOS EXISTENTES ========== */
.page-header {
  margin-bottom: 32px;
}

.header-top {
  margin-bottom: 16px;
}

.page-header h1 {
  color: var(--plum, #481827);
  font-size: 2rem;
  margin: 0 0 8px 0;
  font-weight: 800;
}

.subtitle {
  color: var(--dusty-coral, #D893A1);
  font-size: 0.95rem;
  margin: 0 0 16px 0;
}

/* ========== ESTILOS DEL BANNER ========== */
.hero-banner-wrapper {
  margin-bottom: 32px;
}

.banner-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.banner-carousel {
  overflow: hidden;
  border-radius: 24px;
}

.banner-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-slide {
  flex: 0 0 100%;
  position: relative;
  min-height: 180px;
}

@media (min-width: 768px) {
  .banner-slide {
    min-height: 220px;
  }
}

.banner-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.banner-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
}

.banner-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 180px;
  padding: 24px;
}

@media (min-width: 768px) {
  .banner-content {
    min-height: 220px;
    padding: 32px;
  }
}

.content-wrapper {
  max-width: 65%;
}

@media (max-width: 640px) {
  .content-wrapper {
    max-width: 85%;
  }
}

.badge-wrapper {
  margin-bottom: 12px;
}

.banner-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
}

.badge-promo {
  background: linear-gradient(135deg, #F97316, #EA580C);
  color: white;
}

.badge-featured {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
}

.badge-new {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
}

.badge-offer {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: white;
}

.banner-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .banner-title {
    font-size: 1.5rem;
  }
}

.banner-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 16px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 20px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-btn:hover {
  background: rgba(249, 115, 22, 0.9);
  border-color: rgba(249, 115, 22, 0.9);
  transform: translateX(4px);
}

.btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.banner-btn:hover .btn-arrow {
  transform: translateX(3px);
}

.banner-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 20;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.2s ease;
}

.banner-nav-btn.visible {
  opacity: 1;
}

.banner-nav-btn:hover {
  background: #F97316;
  color: white;
  transform: translateY(-50%) scale(1.05);
}

.prev-btn { left: 16px; }
.next-btn { right: 16px; }

.banner-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 20;
}

.dot-line {
  width: 24px;
  height: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  border: none;
}

.dot-line.active {
  background: #F97316;
  width: 40px;
}

/* ========== CARRUSEL DE RESTAURANTES - SIN BARRA DE SCROLL, MOVIMIENTO SUAVE ========== */
.restaurants-carousel-wrapper {
  position: relative;
  margin: 20px 0;
  width: 100%;
}

.restaurants-carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.restaurants-carousel {
  flex: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
  /* OCULTAR LA BARRA DE SCROLL COMPLETAMENTE */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  padding: 10px 0;
  cursor: grab;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

/* Ocultar scrollbar en Chrome/Safari/Opera */
.restaurants-carousel::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.restaurants-carousel:active {
  cursor: grabbing;
}

.restaurants-carousel-track {
  display: flex;
  gap: 24px;
  padding: 5px;
}

.restaurant-carousel-card {
  flex: 0 0 320px;
  scroll-snap-align: start;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.restaurant-carousel-card:hover {
  transform: translateY(-4px);
}

/* Flechas de navegación - más elegantes */
.carousel-arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(216, 147, 161, 0.3);
  font-size: 2rem;
  font-weight: 400;
  color: #D893A1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.carousel-arrow:hover {
  background: #D893A1;
  color: white;
  transform: scale(1.08);
  box-shadow: 0 6px 16px rgba(216, 147, 161, 0.3);
  border-color: transparent;
}

.carousel-arrow:active {
  transform: scale(0.96);
}

/* Puntos indicadores (dots) - más elegantes */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  margin-bottom: 8px;
}

.carousel-dot {
  width: 32px;
  height: 4px;
  border-radius: 4px;
  background: #e0c4cb;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  padding: 0;
}

.carousel-dot.active {
  background: #D893A1;
  width: 56px;
  box-shadow: 0 2px 6px rgba(216, 147, 161, 0.4);
}

/* ========== RESTO DE ESTILOS EXISTENTES ========== */
.btn-ruleta {
  padding: 10px 20px;
  background: linear-gradient(135deg, #8A9A8B 0%, #7D8F81 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(125, 143, 129, 0.3);
}

.btn-ruleta:hover {
  background: linear-gradient(135deg, #7D8F81 0%, #657869 100%);
  transform: translateY(-2px);
}

.ruleta-overlay {
  position: fixed;
  inset: 0;
  background: rgba(19, 2, 10, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.ruleta-modal {
  background: linear-gradient(135deg, #8B2A4E 0%, #6B1B3C 100%);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  min-height: 600px;
  position: relative;
  max-height: 95vh;
  overflow-y: auto;
}

.ruleta-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.ruleta-modal :deep(.wheel-container) {
  margin: 0;
  padding: 0;
}

.ruleta-modal :deep(.wheel) {
  width: 300px;
  height: 300px;
}

.ruleta-modal :deep(.wheel-center) {
  width: 90px;
  height: 90px;
}

.ruleta-modal :deep(.go-button) {
  width: 80px;
  height: 80px;
  font-size: 1.2rem;
}

.tabs-container {
  margin-bottom: 32px;
}

.tabs-header {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #999;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.tab-btn:hover { color: var(--plum, #481827); }
.tab-btn.active { color: var(--plum, #481827); border-bottom-color: var(--dusty-coral, #D893A1); }
.tab-btn svg { stroke-width: 2.5; }
.tab-content { animation: fadeIn 0.3s ease; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 12px 16px;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  background: white;
  transition: border 0.2s;
}

.search-bar:focus-within { border-color: var(--dusty-coral, #D893A1); }
.search-icon { color: #999; flex-shrink: 0; }
.search-input { flex: 1; border: none; background: transparent; font-size: 0.95rem; outline: none; color: #333; }
.search-input::placeholder { color: #bbb; }

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.category-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid var(--dusty-coral, #D893A1);
  background: transparent;
  color: var(--dusty-coral, #D893A1);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-chip:hover { background: rgba(216, 147, 161, 0.08); }
.category-chip.active { background: var(--plum, #481827); color: white; border-color: var(--plum, #481827); box-shadow: 0 4px 12px rgba(72, 24, 39, 0.3); }

.tipo-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tipo-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid var(--plum, #481827);
  background: transparent;
  color: var(--plum, #481827);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tipo-chip:hover { background: rgba(72, 24, 39, 0.05); }
.tipo-chip.active { background: var(--plum, #481827); color: white; box-shadow: 0 4px 12px rgba(72, 24, 39, 0.3); }

.btn-sorprendeme {
  background: linear-gradient(135deg, var(--dusty-coral, #D893A1) 0%, #e8a8b8 100%);
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(216, 147, 161, 0.25);
}

.btn-sorprendeme:hover {
  background: linear-gradient(135deg, #e8a8b8 0%, var(--dusty-coral, #D893A1) 100%);
  transform: translateY(-2px);
}

/* Grid de platos 
.platos-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}*/
.platos-carousel-wrapper {
  position: relative;
  margin: 20px 0;
}

.platos-carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.platos-carousel {
  flex: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
}

.platos-carousel::-webkit-scrollbar { display: none; }

.platos-carousel-track {
  display: flex;
  gap: 24px;
  padding: 5px;
}

.plato-card {
  flex: 0 0 280px;
  scroll-snap-align: start;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.plato-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.empty-platos {
  padding: 60px 20px;
  text-align: center;
  color: var(--dusty-coral);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.restaurante-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #faf8f6;
  border-bottom: 1px solid #f0ede7;
}

.rest-mini-img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
.rest-mini-placeholder { width: 24px; height: 24px; border-radius: 50%; background: var(--plum); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; }
.rest-mini-nombre { font-size: 0.8rem; font-weight: 700; color: var(--plum); }

.plato-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.plato-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }

.plato-img {
  position: relative;
  height: 160px;
  background: #f5f0eb;
  overflow: hidden;
}

.plato-img img { width: 100%; height: 100%; object-fit: cover; }
.plato-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }

.plato-tipo-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(72, 24, 39, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.plato-info { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.plato-info h3 { margin: 0; font-size: 1rem; color: var(--plum, #481827); font-weight: 700; }
.plato-desc { margin: 0; font-size: 0.83rem; color: #888; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.plato-detalles { display: flex; flex-direction: column; gap: 3px; font-size: 0.8rem; color: #666; }
.plato-precio { font-size: 1rem; font-weight: 800; color: #C0392B; }

.no-results {
  grid-column: 1 / -1;
  padding: 60px 20px;
  text-align: center;
  color: var(--dusty-coral, #D893A1);
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.no-results p { font-size: 1.1rem; margin: 0; }

.btn-clear {
  padding: 8px 16px;
  background: linear-gradient(135deg, #8A9A8B 0%, #7D8F81 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear:hover { background: linear-gradient(135deg, #7D8F81 0%, #657869 100%); transform: translateY(-2px); }

.loading-state { padding: 40px; text-align: center; color: var(--dusty-coral, #D893A1); font-size: 1rem; }

/* ===== SORTEO CARTA ===== */
.sorteo-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.sorteo-card-wrapper {
  perspective: 1000px;
}

.sorteo-card {
  width: 320px;
  height: 420px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.sorteo-card.flipped {
  transform: rotateY(180deg);
}

.sorteo-card-front,
.sorteo-card-back {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.sorteo-card-front {
  background: linear-gradient(135deg, #481827, #6B1B3C);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sorteo-front-content {
  text-align: center;
  color: white;
}

.sorteo-spinner {
  font-size: 4rem;
  animation: spinEmoji 0.6s linear infinite;
  display: block;
  margin-bottom: 16px;
}

.sorteo-loading-text {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 16px;
}

.sorteo-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.sorteo-dots span {
  width: 10px;
  height: 10px;
  background: rgba(255,255,255,0.6);
  border-radius: 50%;
  animation: dotBounce 0.8s ease-in-out infinite;
}

.sorteo-dots span:nth-child(2) { animation-delay: 0.15s; }
.sorteo-dots span:nth-child(3) { animation-delay: 0.3s; }

.sorteo-card-back {
  background: white;
  transform: rotateY(180deg);
  overflow: hidden;
}

.sorteo-result {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.sorteo-close {
  position: absolute;
  top: 12px; right: 12px;
  background: none; border: none;
  font-size: 1.8rem; color: #999;
  cursor: pointer; line-height: 1;
}

.sorteo-result-img {
  width: 100%;
  height: 160px;
  overflow: hidden;
  flex-shrink: 0;
}

.sorteo-result-img img {
  width: 100%; height: 100%;
  object-fit: cover;
}

.sorteo-img-placeholder {
  width: 100%; height: 100%;
  background: #f5f0eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.sorteo-label {
  margin: 16px 0 4px;
  font-size: 0.8rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sorteo-nombre {
  margin: 0 0 6px;
  font-size: 1.4rem;
  font-weight: 800;
  color: #481827;
  padding: 0 20px;
}

.sorteo-restaurante {
  margin: 0 0 8px;
  font-size: 0.85rem;
  color: #888;
}

.sorteo-precio {
  font-size: 1.1rem;
  font-weight: 800;
  color: #C0392B;
  margin-bottom: 16px;
}

.sorteo-btn-ver {
  margin: 0 20px;
  width: calc(100% - 40px);
  padding: 12px;
  background: linear-gradient(135deg, #481827, #6B1B3C);
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sorteo-btn-ver:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(72,24,39,0.3);
}

@keyframes spinEmoji {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes dotBounce {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-8px); opacity: 1; }
}

.sorteo-fade-enter-active, .sorteo-fade-leave-active { transition: opacity 0.3s ease; }
.sorteo-fade-enter-from, .sorteo-fade-leave-to { opacity: 0; }

.sorteo-btn-repetir {
  margin: 8px 20px 0;
  width: calc(100% - 40px);
  padding: 12px;
  background: transparent;
  color: #481827;
  border: 2px solid #481827;
  border-radius: 40px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sorteo-btn-repetir:hover {
  background: rgba(72,24,39,0.06);
  transform: translateY(-2px);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

@media (max-width: 1024px) {
  .platos-grid { grid-template-columns: repeat(2, 1fr); }
  .restaurant-carousel-card { flex: 0 0 300px; }
}

@media (max-width: 640px) {
  .page-header h1 { font-size: 1.5rem; }
  .platos-grid { grid-template-columns: 1fr; }
  .tabs-header { gap: 8px; }
  .tab-btn { padding: 12px 16px; font-size: 0.85rem; }
  .banner-nav-btn { width: 32px; height: 32px; }
  .prev-btn { left: 8px; }
  .next-btn { right: 8px; }
  .dot-line { width: 16px; }
  .dot-line.active { width: 28px; }
  .banner-btn { padding: 6px 16px; font-size: 0.7rem; }
  .restaurant-carousel-card { flex: 0 0 280px; }
  .carousel-arrow { width: 36px; height: 36px; font-size: 1.5rem; }
}
</style>