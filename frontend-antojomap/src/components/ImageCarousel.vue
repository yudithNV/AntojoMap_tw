<template>
  <div class="carousel-container" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
    <!-- Diapositivas -->
    <div class="relative overflow-hidden rounded-2xl shadow-2xl">
      <div 
        class="flex transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="(item, idx) in slides" 
          :key="item.id" 
          class="w-full flex-shrink-0"
        >
          <!-- Split-screen layout -->
          <div class="flex flex-col md:flex-row min-h-[450px] md:min-h-[480px] bg-gradient-to-r from-[#8B2A4E] to-[#6B1B3C]">
            <!-- Lado izquierdo - Imagen del plato -->
            <div class="md:w-1/2 relative overflow-hidden">
              <img 
                :src="item.imagenPlato" 
                :alt="item.platoEstrella"
                class="w-full h-[250px] md:h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-[#75162D]">
                🌟 Plato Estrella
              </div>
            </div>
            
            <!-- Lado derecho - Información del restaurante -->
            <div class="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <!-- Logo/Fachada pequeña -->
              <div class="flex items-center gap-3 mb-4">
                <img 
                  :src="item.imagenRestaurante" 
                  :alt="item.nombreRestaurante"
                  class="w-12 h-12 rounded-full object-cover border-2 border-[#E8D5B5] shadow-lg"
                />
                <div>
                  <span class="text-sm text-[#E8D5B5] font-semibold uppercase tracking-wide">Restaurante</span>
                  <h3 class="text-xl font-bold text-white">{{ item.nombreRestaurante }}</h3>
                </div>
              </div>
              
              <!-- Nombre del plato -->
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {{ item.platoEstrella }}
              </h2>
              
              <!-- Categoría -->
              <div class="flex items-center gap-2 mb-4">
                <span class="bg-[#E8D5B5]/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-[#E8D5B5]">
                  🍽️ {{ item.categoria }}
                </span>
              </div>
              
              <!-- Precio -->
              <div class="mb-6">
                <span class="text-4xl font-bold text-[#FFE66D]">Bs {{ item.precio }}</span>
                <span class="text-white/70 ml-2">por persona</span>
              </div>
              
              <!-- Botón Ver Menú -->
              <button 
                @click="verMenu(item.id)"
                class="bg-[#E8D5B5] text-[#4a122a] px-6 py-3 rounded-full font-bold hover:bg-[#F0E5D0] transition-all transform hover:scale-105 shadow-lg w-full md:w-auto"
              >
                Ver Menú Completo →
              </button>
              
              <!-- Badge adicional -->
              <div class="mt-4 text-white/60 text-sm flex items-center gap-2">
                <span class="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                Abierto ahora
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botones de navegación (solo visible en hover) -->
      <button 
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        :class="{ 'opacity-100': isHovering }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <button 
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        :class="{ 'opacity-100': isHovering }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
    
    <!-- Indicadores (dots) -->
    <div class="flex justify-center gap-2 mt-6">
      <button 
        v-for="(_, idx) in slides" 
        :key="idx"
        @click="goToSlide(idx)"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="currentIndex === idx ? 'bg-[#E8D5B5] w-6' : 'bg-white/50 hover:bg-white/70'"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Datos de ejemplo (restaurantes y sus platos estrella)
const slides = ref([
  {
    id: 1,
    nombreRestaurante: 'The Burger Joint',
    imagenRestaurante: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=80&h=80&fit=crop',
    platoEstrella: 'Clásica Burger',
    imagenPlato: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
    precio: '35',
    categoria: 'Hamburguesas • Americana'
  },
  {
    id: 2,
    nombreRestaurante: 'Sakura Sushi',
    imagenRestaurante: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=80&h=80&fit=crop',
    platoEstrella: 'Sushi Mix Deluxe',
    imagenPlato: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=450&fit=crop',
    precio: '85',
    categoria: 'Sushi • Japonesa'
  },
  {
    id: 3,
    nombreRestaurante: 'Bella Pizza',
    imagenRestaurante: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&fit=crop',
    platoEstrella: 'Pizza Margherita',
    imagenPlato: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=450&fit=crop',
    precio: '55',
    categoria: 'Pizza • Italiana'
  },
  {
    id: 4,
    nombreRestaurante: 'Taco Loco',
    imagenRestaurante: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=80&h=80&fit=crop',
    platoEstrella: 'Tacos al Pastor',
    imagenPlato: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=450&fit=crop',
    precio: '28',
    categoria: 'Mexicana • Tacos'
  }
])

const currentIndex = ref(0)
const isHovering = ref(false)
let autoPlayInterval = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const startAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}

const pauseAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const verMenu = (id) => {
  router.push(`/user/menu/${id}`)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.group {
  position: relative;
}

/* Transición suave para los botones */
button {
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Hover effect en el contenedor */
.carousel-container:hover .opacity-0 {
  opacity: 1 !important;
}
</style>