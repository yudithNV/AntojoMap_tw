<template>
  <DashboardLayout>
    <div class="mapa-container">
      <div class="panel-izquierdo">
        <div class="panel-header">
          <h2>Resultados cerca de ti</h2>
          <router-link to="/user/feed" class="ver-todos">VER TODOS</router-link>
        </div>

        <div class="categorias-filter">
          <button 
            class="categoria-chip" 
            :class="{ active: categoriaSeleccionada === null }"
            @click="categoriaSeleccionada = null"
          >
            Todos
          </button>
          <button 
            v-for="cat in categoriasDisponibles" 
            :key="cat"
            class="categoria-chip" 
            :class="{ active: categoriaSeleccionada === cat }"
            @click="categoriaSeleccionada = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="restaurantes-list">
          <div 
            v-for="restaurante in restaurantesFiltrados" 
            :key="restaurante.id"
            class="restaurante-card"
            :class="{ active: restauranteSeleccionado?.id === restaurante.id }"
            @click="seleccionarRestaurante(restaurante)"
            ref="cardElements"
          >
            <div class="card-foto">
              <img 
                v-if="restaurante.foto_portada" 
                :src="restaurante.foto_portada" 
                :alt="restaurante.nombre"
                class="foto-img"
              />
              <div v-else class="foto-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3z"/>
                </svg>
              </div>
            </div>

            <div class="card-info">
              <div>
                <h3>{{ restaurante.nombre }}</h3>
                <p class="distancia">📍 {{ restaurante.distancia.toFixed(1) }} km</p>
                <div class="rating">
                  <span class="star">⭐</span>
                  <span class="rating-text">{{ restaurante.rating || 'N/A' }}</span>
                </div>
              </div>
              <button class="btn-detalle" @click.stop="irAlMenu(restaurante.id)">
                Ver Detalle →
              </button>
            </div>
          </div>

          <div v-if="restaurantesFiltrados.length === 0" class="empty-state">
            <p>No hay restaurantes disponibles en esta categoría.</p>
          </div>
        </div>
      </div>

      <div class="panel-derecho">
        <div ref="mapContainer" class="mapa"></div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, markRaw, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/DashboardLayout.vue'
import { useRestaurantesStore } from '@/stores/restaurantes.store.js'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const restaurantesStore = useRestaurantesStore()

// Configurar icono por defecto
const DefaultIcon = L.icon({ 
  iconUrl, 
  shadowUrl: iconShadow, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41] 
})
L.Marker.prototype.options.icon = DefaultIcon

// Estado
const mapContainer = ref(null)
const map = ref(null)
const userLocation = ref(null)
const categoriaSeleccionada = ref(null)
const restauranteSeleccionado = ref(null)
const cardElements = ref([])
const markers = ref({})
const userMarker = ref(null)
const mapaInicializado = ref(false)
let watchPositionId = null

// Coordenadas por defecto (La Paz, Bolivia)
const DEFAULT_LAT = -16.5000
const DEFAULT_LNG = -68.1193
const DEFAULT_ZOOM = 13

// Calcular distancia
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Restaurantes con distancia
const restaurantesConDistancia = computed(() => {
  const userLat = userLocation.value?.lat || DEFAULT_LAT
  const userLng = userLocation.value?.lng || DEFAULT_LNG

  return restaurantesStore.restaurantes
    .filter(r => r.latitud && r.longitud && r.latitud !== null && r.longitud !== null)
    .map(r => ({
      ...r,
      distancia: haversineDistance(userLat, userLng, r.latitud, r.longitud),
      rating: r.rating || 4.5
    }))
    .sort((a, b) => a.distancia - b.distancia)
})

const categoriasDisponibles = computed(() => {
  const categorias = new Set()
  restaurantesConDistancia.value.forEach(r => {
    if (r.category) categorias.add(r.category)
  })
  return Array.from(categorias).sort()
})

const restaurantesFiltrados = computed(() => {
  if (categoriaSeleccionada.value === null) {
    return restaurantesConDistancia.value
  }
  return restaurantesConDistancia.value.filter(
    r => r.category === categoriaSeleccionada.value
  )
})

// Iconos
const crearIconoRestaurante = () => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: #481827;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        cursor: pointer;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">🍴</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

const crearIconoUsuario = () => {
  return L.divIcon({
    className: '', 
    html: `
      <div style="
        width: 18px;
        height: 18px;
        background: #4A90D9;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 2px rgba(74,144,217,0.4);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -14]
  })
}

// 🚀 OPTIMIZACIÓN: Cargar mapa INMEDIATAMENTE sin esperar geolocalización
const inicializarMapa = async () => {
  if (mapaInicializado.value) return
  
  await nextTick()
  if (!mapContainer.value) return

  // Usar coordenadas por defecto primero, luego se actualizará
  const centerLat = DEFAULT_LAT
  const centerLng = DEFAULT_LNG

  // ✅ OPTIMIZACIÓN: MarkRaw para evitar reactividad
  const leafletMap = L.map(mapContainer.value, {
    preferCanvas: true,
    zoomControl: true,
    fadeAnimation: true,
    zoomAnimation: true,
    markerZoomAnimation: false
  }).setView([centerLat, centerLng], DEFAULT_ZOOM)
  
  map.value = markRaw(leafletMap)

  // ✅ OPTIMIZACIÓN: Tile layer con mejor rendimiento
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
    maxZoom: 19,
    subdomains: 'abcd',
    updateWhenIdle: false,
    keepBuffer: 2,
    updateWhenZooming: false,
    unloadInvisibleTiles: true
  }).addTo(map.value)

  mapaInicializado.value = true
  console.log('🗺️ Mapa inicializado en', Date.now())
}

// Agregar marcadores SIN bloquear el mapa
const agregarMarcador = (restaurante) => {
  if (!map.value) return
  
  const marker = L.marker([restaurante.latitud, restaurante.longitud], {
    icon: crearIconoRestaurante(),
    interactive: true
  })
  marker.addTo(map.value)
  marker.bindPopup(`
    <div style="min-width: 160px;">
      <strong>${restaurante.nombre}</strong><br/>
      <small>${restaurante.category || ''}</small><br/>
      <small>📍 ${restaurante.distancia.toFixed(1)} km</small><br/>
      <button onclick="window.location.href='/user/menu/${restaurante.id}'" 
        style="
          background: #D893A1;
          color: white;
          border: none;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 6px;
          width: 100%;
          font-size: 12px;
        ">
        Ver menú
      </button>
    </div>
  `)

  marker.on('click', () => {
    seleccionarRestaurante(restaurante)
  })

  markers.value[restaurante.id] = markRaw(marker)
}

// Actualizar pins - Solo agregar nuevos, no recrear todos
const actualizarPinsRestaurantes = () => {
  if (!map.value) return

  const currentIds = new Set(Object.keys(markers.value))
  const newIds = new Set(restaurantesFiltrados.value.map(r => r.id))

  // Eliminar marcadores que ya no están en el filtro
  for (const id of currentIds) {
    if (!newIds.has(parseInt(id))) {
      markers.value[id]?.remove()
      delete markers.value[id]
    }
  }

  // Agregar solo los nuevos marcadores
  for (const restaurante of restaurantesFiltrados.value) {
    if (!markers.value[restaurante.id]) {
      agregarMarcador(restaurante)
    }
  }
}

// Actualizar ubicación del usuario en el mapa
const actualizarUbicacionUsuario = () => {
  if (!map.value || !userLocation.value) return

  if (userMarker.value) {
    userMarker.value.setLatLng([userLocation.value.lat, userLocation.value.lng])
  } else {
    const marker = L.marker([userLocation.value.lat, userLocation.value.lng], {
      icon: crearIconoUsuario()
    })
    marker.addTo(map.value)
    marker.bindPopup('<strong>Tu ubicación</strong>')
    userMarker.value = markRaw(marker)
  }
  
  // Centrar mapa en ubicación del usuario SOLO si no hay restaurante seleccionado
  if (!restauranteSeleccionado.value) {
    map.value.setView([userLocation.value.lat, userLocation.value.lng], 15)
  }
}

// Seleccionar restaurante
const seleccionarRestaurante = (restaurante) => {
  restauranteSeleccionado.value = restaurante

  if (map.value) {
    map.value.setView([restaurante.latitud, restaurante.longitud], 16)
    if (markers.value[restaurante.id]) {
      markers.value[restaurante.id].openPopup()
    }
  }

  nextTick(() => {
    const index = restaurantesFiltrados.value.findIndex(r => r.id === restaurante.id)
    if (cardElements.value[index]) {
      cardElements.value[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

const irAlMenu = (restauranteId) => {
  router.push(`/user/menu/${restauranteId}`)
}

// 🚀 OPTIMIZACIÓN: Geolocalización en paralelo, no bloqueante
const solicitarGeolocalizacion = () => {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      actualizarUbicacionUsuario()
      console.log('📍 Ubicación obtenida en', Date.now())
    },
    (error) => {
      console.warn('⚠️ Error de geolocalización:', error.message)
      userLocation.value = null
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
  )
}

// 🚀 OPTIMIZACIÓN: Cargar TODO en paralelo, no en serie
onMounted(async () => {
  const startTime = Date.now()
  console.log('🚀 Iniciando carga...', startTime)
  
  // Cargar restaurantes en segundo plano
  restaurantesStore.cargarRestaurantes()
  
  // Inicializar mapa INMEDIATAMENTE (no espera nada)
  await inicializarMapa()
  
  console.log('✅ Mapa cargado en', Date.now() - startTime, 'ms')
  
  // Una vez que los restaurantes estén listos, agregar marcadores
  const checkRestaurantes = setInterval(() => {
    if (restaurantesStore.restaurantes.length > 0 && map.value) {
      clearInterval(checkRestaurantes)
      // Agregar marcadores de forma diferida
      setTimeout(() => {
        actualizarPinsRestaurantes()
        console.log('📍 Marcadores agregados en', Date.now() - startTime, 'ms')
      }, 100)
    }
  }, 100)
  
  // Geolocalización en paralelo (no bloquea)
  setTimeout(() => {
    solicitarGeolocalizacion()
  }, 500)
})

// Watch para actualizar marcadores cuando cambia el filtro
watch(restaurantesFiltrados, () => {
  actualizarPinsRestaurantes()
}, { deep: true })

// Limpiar al desmontar
onUnmounted(() => {
  if (watchPositionId) {
    navigator.geolocation?.clearWatch(watchPositionId)
  }
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
/* Tus estilos existentes (sin cambios) */
:deep(.leaflet-pane),
:deep(.leaflet-tile),
:deep(.leaflet-marker-icon),
:deep(.leaflet-tile-pane),
:deep(.leaflet-overlay-pane),
:deep(.leaflet-shadow-pane),
:deep(.leaflet-marker-pane),
:deep(.leaflet-popup-pane),
:deep(.leaflet-map-pane canvas),
:deep(.leaflet-map-pane svg) {
  z-index: 1 !important;
}

:deep(.leaflet-control) {
  z-index: 2 !important;
}

.mapa-container {
  display: flex;
  gap: 24px;
  height: calc(100vh - 80px);
  background: #faf8f6;
  padding: 0 24px;
}

.panel-izquierdo {
  flex: 1;
  min-width: 320px;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.panel-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #ede8e2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--plum, #481827);
  font-weight: 800;
}

.ver-todos {
  color: var(--dusty-coral, #D893A1);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s;
}

.ver-todos:hover {
  color: #c17a8b;
}

.categorias-filter {
  display: flex;
  gap: 10px;
  padding: 16px 24px;
  overflow-x: auto;
  border-bottom: 1px solid #ede8e2;
  align-items: center;
  background: white;
}

.categoria-chip {
  padding: 8px 18px;
  border-radius: 40px;
  border: 1.5px solid var(--dusty-coral, #D893A1);
  background: transparent;
  color: var(--dusty-coral, #D893A1);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.categoria-chip:hover {
  background: rgba(216, 147, 161, 0.08);
  transform: translateY(-1px);
}

.categoria-chip.active {
  background: var(--plum, #481827);
  color: white;
  border-color: var(--plum, #481827);
  box-shadow: 0 2px 8px rgba(72, 24, 39, 0.2);
}

.restaurantes-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.restaurante-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
}

.restaurante-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.restaurante-card.active {
  border-color: var(--plum, #481827);
  background: rgba(72, 24, 39, 0.02);
  box-shadow: 0 8px 24px rgba(72, 24, 39, 0.1);
}

.card-foto {
  width: 96px;
  height: 96px;
  border-radius: 20px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f5ede6, #e8dfd6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #481827, #6b253c);
  color: rgba(255, 255, 255, 0.6);
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 10px;
}

.card-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.15rem;
  color: var(--plum, #481827);
  font-weight: 800;
  line-height: 1.3;
}

.distancia {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  color: #6b6b6b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.star {
  font-size: 0.95rem;
}

.rating-text {
  color: #999;
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-detalle {
  background: transparent;
  border: none;
  color: var(--dusty-coral, #D893A1);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
}

.btn-detalle:hover {
  color: var(--plum, #481827);
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px 24px;
  color: #999;
  font-size: 0.95rem;
  background: white;
  border-radius: 20px;
}

.panel-derecho {
  flex: 1.2;
  min-width: 400px;
  position: relative;
  background: #e8e2da;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.mapa {
  width: 100%;
  height: 100%;
}

@media (max-width: 1024px) {
  .mapa-container {
    padding: 0 16px;
    gap: 16px;
  }
  .panel-derecho {
    min-width: 300px;
  }
}

@media (max-width: 768px) {
  .mapa-container {
    flex-direction: column;
    height: auto;
    padding: 0 16px;
    gap: 16px;
  }
  .panel-izquierdo {
    min-width: auto;
    max-height: 50vh;
  }
  .panel-derecho {
    min-width: auto;
    height: 350px;
  }
  .restaurante-card {
    padding: 16px;
    gap: 14px;
  }
  .card-foto {
    width: 70px;
    height: 70px;
  }
  .card-info h3 {
    font-size: 1rem;
  }
  .panel-header {
    padding: 16px 20px;
  }
  .categorias-filter {
    padding: 12px 20px;
  }
  .restaurantes-list {
    padding: 16px;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .card-foto {
    width: 60px;
    height: 60px;
  }
  .card-info h3 {
    font-size: 0.9rem;
  }
  .distancia {
    font-size: 0.7rem;
  }
  .btn-detalle {
    font-size: 0.7rem;
  }
}
</style>