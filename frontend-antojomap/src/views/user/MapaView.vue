<template>
  <DashboardLayout>
    <div class="mapa-container">
      <!-- Panel izquierdo con lista -->
      <div class="panel-izquierdo">
        <div class="panel-header">
          <h2>Resultados cerca de ti</h2>
          <router-link to="/user/feed" class="ver-todos">VER TODOS</router-link>
        </div>

        <!-- Chips de categoría -->
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

        <!-- Lista de restaurantes -->
        <div class="restaurantes-list">
          <div 
            v-for="restaurante in restaurantesFiltrados" 
            :key="restaurante.id"
            class="restaurante-card"
            :class="{ active: restauranteSeleccionado?.id === restaurante.id }"
            @click="seleccionarRestaurante(restaurante)"
            ref="cardElements"
          >
            <!-- Foto -->
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

            <!-- Info -->
            <div class="card-info">
              <h3>{{ restaurante.nombre }}</h3>
              <p class="distancia">
                📍 {{ restaurante.distancia.toFixed(1) }} km
              </p>
              <div class="rating">
                <span class="star">⭐</span>
                <span class="rating-text">{{ restaurante.rating || 'N/A' }}</span>
              </div>
              <button class="btn-detalle" @click.stop="irAlMenu(restaurante.id)">
                Ver Detalle
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="restaurantesFiltrados.length === 0" class="empty-state">
            <p>No hay restaurantes disponibles en esta categoría.</p>
          </div>
        </div>
      </div>

      <!-- Mapa derecho -->
      <div class="panel-derecho">
        <div ref="mapContainer" class="mapa"></div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/DashboardLayout.vue'
import { useRestaurantesStore } from '@/stores/restaurantes.store.js'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const restaurantesStore = useRestaurantesStore()

// Arreglar bug de Leaflet con Vite
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

// Coordenadas por defecto (La Paz, Bolivia)
const DEFAULT_LAT = -16.5000
const DEFAULT_LNG = -68.1193
const DEFAULT_ZOOM = 13

// Calcular distancia con fórmula Haversine
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en km
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

// Restaurantes con distancia calculada
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

// Categorías disponibles
const categoriasDisponibles = computed(() => {
  const categorias = new Set()
  restaurantesConDistancia.value.forEach(r => {
    if (r.category) categorias.add(r.category)
  })
  return Array.from(categorias).sort()
})

// Restaurantes filtrados por categoría
const restaurantesFiltrados = computed(() => {
  if (categoriaSeleccionada.value === null) {
    return restaurantesConDistancia.value
  }
  return restaurantesConDistancia.value.filter(
    r => r.category === categoriaSeleccionada.value
  )
})

// Crear icono personalizado para restaurante
const crearIconoRestaurante = () => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: #481827;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">🍴</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  })
}
// Crear icono personalizado para usuario
const crearIconoUsuario = () => {
  return L.divIcon({
    className: '', 
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #4A90D9;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 3px rgba(74,144,217,0.4);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14]
  })
}

// Inicializar mapa
const inicializarMapa = async () => {
  await nextTick()
  
  if (!mapContainer.value) return

  const centerLat = userLocation.value?.lat || DEFAULT_LAT
  const centerLng = userLocation.value?.lng || DEFAULT_LNG

  if (map.value) {
    map.value.remove()
  }

  map.value = L.map(mapContainer.value).setView([centerLat, centerLng], DEFAULT_ZOOM)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map.value)

  // Agregar pin del usuario
  if (userLocation.value) {
    userMarker.value = L.marker(
      [userLocation.value.lat, userLocation.value.lng],
      { icon: crearIconoUsuario() }
    )
      .addTo(map.value)
      .bindPopup('<div style="text-align: center;"><strong>Tu ubicación</strong></div>')
  }

  // Agregar pins de restaurantes
  actualizarPinsRestaurantes()
}

// Actualizar pins según filtro
const actualizarPinsRestaurantes = () => {
  if (!map.value) return

  // Limpiar markers anteriores
  Object.values(markers.value).forEach(marker => marker.remove())
  markers.value = {}

  // Agregar nuevos markers
  restaurantesFiltrados.value.forEach(restaurante => {
    const marker = L.marker([restaurante.latitud, restaurante.longitud], {
      icon: crearIconoRestaurante()
    })
      .addTo(map.value)
      .bindPopup(`
        <div style="min-width: 180px;">
          <strong>${restaurante.nombre}</strong><br/>
          <small>${restaurante.category}</small><br/>
          <small>📍 ${restaurante.distancia.toFixed(1)} km</small><br/>
          <button onclick="window.location.href='/user/menu/${restaurante.id}'" 
            style="
              background: #D893A1;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              cursor: pointer;
              margin-top: 8px;
              width: 100%;
              font-weight: 600;
            ">
            Ver menú
          </button>
        </div>
      `)

    marker.on('click', () => {
      seleccionarRestaurante(restaurante)
    })

    markers.value[restaurante.id] = marker
  })
}

// Seleccionar restaurante
const seleccionarRestaurante = (restaurante) => {
  restauranteSeleccionado.value = restaurante

  // Centrar mapa en restaurante
  if (map.value) {
    map.value.setView([restaurante.latitud, restaurante.longitud], 15)
    if (markers.value[restaurante.id]) {
      markers.value[restaurante.id].openPopup()
    }
  }

  // Scroll a la card
  nextTick(() => {
    const index = restaurantesFiltrados.value.findIndex(r => r.id === restaurante.id)
    if (cardElements.value[index]) {
      cardElements.value[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

// Navegar a menú
const irAlMenu = (restauranteId) => {
  router.push(`/user/menu/${restauranteId}`)
}

// Pedir geolocalización
const solicitarGeolocalizacion = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        resolve()

        // Seguir actualizando posición en tiempo real
        navigator.geolocation.watchPosition(
          (pos) => {
            userLocation.value = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            }
            // Mover el pin del usuario en el mapa
            if (userMarker.value) {
              userMarker.value.setLatLng([pos.coords.latitude, pos.coords.longitude])
            }
          },
          null,
          { enableHighAccuracy: true, maximumAge: 5000 }
        )
      },
      () => {
        userLocation.value = null
        resolve()
      }
    )
  })
}

// Ciclo de vida
onMounted(async () => {
  // Cargar restaurantes
  await restaurantesStore.cargarRestaurantes()

  // Pedir geolocalización
  await solicitarGeolocalizacion()

  // Inicializar mapa
  await inicializarMapa()
})

// Actualizar pins cuando cambia el filtro
watch(restaurantesFiltrados, () => {
  actualizarPinsRestaurantes()
})
</script>

<style scoped>
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
  height: calc(100vh - 80px);
  gap: 0;
  background: white;
}

.panel-izquierdo {
  width: 35%;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  overflow: hidden;
}

.panel-header {
  padding: 24px 20px 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--plum, #481827);
  font-weight: 700;
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
  gap: 8px;
  padding: 12px 20px;
  overflow-x: auto;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.categoria-chip {
  padding: 6px 14px;
  border-radius: 20px;
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
  background: rgba(216, 147, 161, 0.05);
}

.categoria-chip.active {
  background: var(--plum, #481827);
  color: white;
  border-color: var(--plum, #481827);
}

.restaurantes-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.restaurante-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border: 3px solid transparent;
  border-left: 3px solid transparent;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.restaurante-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.restaurante-card.active {
  border-left-color: var(--plum, #481827);
  background: rgba(72, 24, 39, 0.02);
}

.card-foto {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
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
  background: #4a122a;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.card-info h3 {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  color: var(--plum, #481827);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.distancia {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
}

.star {
  font-size: 1rem;
}

.rating-text {
  color: #999;
}

.btn-detalle {
  background: transparent;
  border: none;
  color: var(--dusty-coral, #D893A1);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;
}

.btn-detalle:hover {
  color: #c17a8b;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 0.9rem;
}

.panel-derecho {
  width: 65%;
  position: relative;
}

.mapa {
  width: 100%;
  height: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .mapa-container {
    flex-direction: column;
    height: auto;
  }

  .panel-izquierdo {
    width: 100%;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .panel-derecho {
    width: 100%;
    height: 300px;
  }

  .restaurante-card {
    gap: 10px;
    padding: 10px;
  }

  .card-foto {
    width: 70px;
    height: 70px;
  }

  .card-info h3 {
    font-size: 0.9rem;
  }

  .panel-header {
    padding: 16px;
  }

  .categorias-filter {
    padding: 10px 16px;
  }

  .restaurantes-list {
    padding: 10px;
    gap: 10px;
  }
}
</style>
