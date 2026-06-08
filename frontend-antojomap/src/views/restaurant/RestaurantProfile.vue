<template>
  <DashboardLayout>
    
    <div class="profile-header-bg"></div>
    <div class="page-header">
      <h1>Perfil del Restaurante</h1>
      <p class="subtitle">Editá la información de tu restaurante</p>
    </div>

    <div class="profile-wrapper">
      <!-- Columna izquierda: vista previa -->
      <div class="profile-left">
        <div class="cover-preview">
          <img v-if="form.foto_portada" :src="form.foto_portada" class="cover-img" @error="form.foto_portada = ''" />
          <div v-else class="cover-placeholder">
            <UtensilsCrossed :size="48" stroke-width="1.5" />
          </div>
        </div>
        <div class="preview-info">
          <h2 class="preview-name">{{ form.nombre || 'Nombre del restaurante' }}</h2>
          <p class="preview-email">{{ userEmail }}</p>
          <p v-if="form.descripcion" class="preview-desc">{{ form.descripcion }}</p>
          <div v-if="categoriaActual" class="preview-row">
            <Tag :size="14" /> {{ categoriaActual }}
          </div>
          <div v-if="form.direccion" class="preview-row">
            <MapPin :size="14" /> {{ form.direccion }}
          </div>
          <div v-if="form.telefono" class="preview-row">
            <Phone :size="14" /> {{ form.telefono }}
          </div>
        </div>

        <!-- ELIMINADO el div de mensaje de éxito -->

        <!-- Botón Guardar cambios -->
        <button
          class="btn-guardar"
          :class="{ 'btn-disabled': !hasChanges || guardando }"
          :disabled="!hasChanges || guardando"
          @click="openSaveModal"
        >
          <span v-if="!guardando" style="display:flex; align-items:center; gap:6px; justify-content:center;">
            <Save :size="16" /> Guardar cambios
          </span>
          <span v-else>Guardando...</span>
        </button>
      </div>

      <!-- Columna derecha: formulario aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-->
      <div class="profile-right">

        <!-- Información básica -->
        <div class="form-card">
          <h3 class="card-title">Información básica</h3>

          <div class="form-group">
            <label class="form-label">Email de cuenta</label>
            <div class="email-display">{{ userEmail }}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Nombre del restaurante</label>
            <input v-model="form.nombre" type="text" class="form-input" placeholder="Ej: La Parrilla del Barrio" @input="checkChanges" />
          </div>

          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-input form-textarea" rows="4"
              placeholder="Cuéntanos sobre tu restaurante..." @input="checkChanges" />
            <p class="char-count">{{ form.descripcion?.length || 0 }} caracteres</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Dirección</label>
              <div class="input-search-container">
                <input 
                  v-model="form.direccion" 
                  type="text" 
                  class="form-input" 
                  placeholder="Calle Principal 123" 
                  @input="checkChanges" 
                />
                <button class="btn-buscar-mapa" @click="buscarEnMapa" :disabled="!form.direccion || buscandoDireccion">
                  <span style="display:flex; align-items:center; gap:6px;">
                    <Search :size="14" /> {{ buscandoDireccion ? 'Buscando...' : 'Buscar en mapa' }}
                  </span>
                </button>
              </div>
              <p v-if="errorDireccion" class="error-message">{{ errorDireccion }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input v-model="form.telefono" type="tel" class="form-input" placeholder="+591 12345678" @input="checkChanges" />
            </div>
          </div>
          <!-- Mapa -->
        <div class="form-card">
          <h3 class="card-title">Ubicación en el mapa</h3>
          <p class="section-hint">Hacé clic en el mapa para marcar tu ubicación o arrastra el pin</p>
          <div id="mapa-edicion" class="map-container"></div>
          <div v-if="form.latitud && form.longitud" class="coordinates">
            <span class="coord-label">Lat: {{ form.latitud.toFixed(4) }} | Lng: {{ form.longitud.toFixed(4) }}</span>
          </div>
        </div>
          
          <div class="form-group">
            <label class="form-label">Foto de portada</label>
            <ImageUploader v-model="form.foto_portada" @update:modelValue="checkChanges" />
          </div>
        </div>

        <!-- Categoría -->
        <div class="form-card">
          <h3 class="card-title">Categoría</h3>
          <p class="section-hint">Seleccioná la categoría que mejor describe tu restaurante</p>

          <div class="categorias-grid">
            <button
              v-for="cat in categorias"
              :key="cat.id"
              class="cat-btn"
              :class="{ active: selectedCategoriasIds.includes(cat.id) }"
              @click="selectCategoria(cat)"
            >
              {{ cat.nombre }}
            </button>
            <div v-if="categorias.length === 0" class="empty-categories">
              Cargando categorías o base de datos vacía...
            </div>
          </div>

          <div v-if="selectedCategoriasIds.length > 0" class="selected-cats">
            <span class="cats-label">Seleccionadas:</span> {{ categoriaActual }}
          </div>

          <div v-if="mensajeCategoria" :class="['alert', mensajeCategoriaType]" style="margin-top: 16px;">
            {{ mensajeCategoria }}
          </div>

          <button class="btn-save-cat" @click="guardarCategoria" :disabled="guardandoCategoria">
            <span style="display:flex; align-items:center; gap:6px;">
              <Check :size="14" /> {{ guardandoCategoria ? 'Guardando...' : 'Guardar categorías' }}
            </span>
          </button>
        </div>

        <!-- Horarios -->
        <div class="form-card">
          <h3 class="card-title">Horarios de atención</h3>
          <p class="section-hint">Configurá tus horarios por día de la semana</p>

          <div class="horarios-list">
            <div v-for="dia in diasSemana" :key="dia.value" class="horario-row">
              <div class="dia-info">
                <label class="dia-check">
                  <input type="checkbox" v-model="horariosDias[dia.value].activo" @change="horariosChanged = true" />
                  <span class="dia-nombre">{{ dia.label }}</span>
                </label>
              </div>
              <div class="horas" :class="{ disabled: !horariosDias[dia.value].activo }">
                <input
                  type="time"
                  v-model="horariosDias[dia.value].apertura"
                  class="time-input"
                  :disabled="!horariosDias[dia.value].activo"
                  @change="horariosChanged = true"
                />
                <span class="time-sep">–</span>
                <input
                  type="time"
                  v-model="horariosDias[dia.value].cierre"
                  class="time-input"
                  :disabled="!horariosDias[dia.value].activo"
                  @change="horariosChanged = true"
                />
              </div>
            </div>
          </div>

          <div v-if="mensajeHorario" :class="['alert', mensajeHorarioType]" style="margin-top: 16px;">
            {{ mensajeHorario }}
          </div>

          <button
            v-if="horariosChanged"
            class="btn-save-cat"
            @click="guardarHorarios"
            :disabled="guardandoHorarios"
          >
            {{ guardandoHorarios ? 'Guardando...' : '✓ Guardar horarios' }}
          </button>
        </div>

      </div>
    </div>

    <!-- ===== MODAL DE CONFIRMACIÓN ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showSaveProfileModal" class="modal-overlay" @click.self="closeSaveModal">
          <div class="modal-card">
            <div class="modal-icon">
              <div class="icon-circle-save">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              </div>
            </div>
            <h2 class="modal-title">¿Guardar los cambios del perfil?</h2>
            <p class="modal-message">
              La información de tu establecimiento se actualizará y los usuarios verán los nuevos datos en la aplicación.
            </p>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="closeSaveModal">
                No, cancelar
              </button>
              <button class="modal-btn confirm-save" @click="confirmSave">
                Sí, guardar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== TOAST FLOTANTE DE ÉXITO ===== -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="showSuccessToast" class="success-toast">
          <div class="toast-content">
            <div class="toast-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="toast-message">
              <strong>¡Cambios guardados exitosamente!</strong>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import DashboardLayout from '../../components/DashboardLayout.vue'
import ImageUploader from '../../components/ImageUploader.vue'
import { UtensilsCrossed, MapPin, Phone, Tag, Save, Search, Check } from 'lucide-vue-next'
import { api } from '@/services/api.js'
import { horariosService } from '@/services/restaurante.service.js'
import { restaurantesService } from '@/services/menu.service.js'

const userEmail = ref(localStorage.getItem('user_email') || '')
const restauranteId = ref(localStorage.getItem('restaurante_id') || '')
const guardando = ref(false)
const hasChanges = ref(false)

// ===== MODAL DE CONFIRMACIÓN =====
const showSaveProfileModal = ref(false)

// ===== TOAST DE ÉXITO =====
const showSuccessToast = ref(false)
let toastTimeout = null

const showToast = () => {
  showSuccessToast.value = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const openSaveModal = () => {
  if (!hasChanges.value) return
  showSaveProfileModal.value = true
}

const closeSaveModal = () => {
  showSaveProfileModal.value = false
}

const confirmSave = async () => {
  showSaveProfileModal.value = false
  await guardar()
}

// Categorías
const categorias = ref([])
const selectedCategoriasIds = ref([])
const originalCategoriasIds = ref([])
const categoriaActual = ref('')
const guardandoCategoria = ref(false)
const mensajeCategoria = ref('')
const mensajeCategoriaType = ref('')

// Horarios
const horariosChanged = ref(false)
const guardandoHorarios = ref(false)
const mensajeHorario = ref('')
const mensajeHorarioType = ref('')

const diasSemana = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
]

const horariosDias = ref({
  0: { activo: false, apertura: '08:00', cierre: '22:00' },
  1: { activo: false, apertura: '08:00', cierre: '22:00' },
  2: { activo: false, apertura: '08:00', cierre: '22:00' },
  3: { activo: false, apertura: '08:00', cierre: '22:00' },
  4: { activo: false, apertura: '08:00', cierre: '22:00' },
  5: { activo: false, apertura: '08:00', cierre: '22:00' },
  6: { activo: false, apertura: '08:00', cierre: '22:00' },
})

const initialForm = {
  nombre: '', descripcion: '', direccion: '',
  telefono: '', latitud: null, longitud: null, foto_portada: ''
}
const form = ref({ ...initialForm })
let marker = null
let mapa = null

// Estados para búsqueda de dirección
const buscandoDireccion = ref(false)
const errorDireccion = ref('')
let debounceTimer = null

const checkChanges = () => {
  hasChanges.value = JSON.stringify(form.value) !== JSON.stringify(initialForm)
}

// Función para buscar dirección con Nominatim
const buscarEnMapa = async () => {
  if (!form.value.direccion || !form.value.direccion.trim()) return

  buscandoDireccion.value = true
  errorDireccion.value = ''

  try {
    const query = form.value.direccion + ', La Paz, Bolivia'
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AntojoMap/1.0' }
    })
    const results = await response.json()

    if (results && results.length > 0) {
      const { lat, lon } = results[0]
      form.value.latitud = parseFloat(lat)
      form.value.longitud = parseFloat(lon)
      hasChanges.value = true

      // Actualizar el mapa
      if (mapa) {
        mapa.setView([form.value.latitud, form.value.longitud], 15)
        if (marker) {
          marker.setLatLng([form.value.latitud, form.value.longitud])
        } else {
          crearMarker(form.value.latitud, form.value.longitud)
        }
      }
    } else {
      errorDireccion.value = 'No se encontró la dirección, intenta ser más específico'
    }
  } catch (e) {
    console.error('Error al buscar dirección:', e)
    errorDireccion.value = 'Error al buscar la dirección. Intenta de nuevo.'
  } finally {
    buscandoDireccion.value = false
  }
}

// Función para crear marker personalizado
const crearMarker = (lat, lng) => {
  const iconoRestaurante = L.divIcon({
    className: '',
    html: `
      <div style="
        background: #481827;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        🍴
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })

  marker = L.marker([lat, lng], { 
    icon: iconoRestaurante,
    draggable: true 
  }).addTo(mapa)

  marker.on('dragend', () => {
    const latlng = marker.getLatLng()
    form.value.latitud = latlng.lat
    form.value.longitud = latlng.lng
    hasChanges.value = true
  })
}


const selectCategoria = (cat) => {
  const idx = selectedCategoriasIds.value.indexOf(cat.id)
  if (idx > -1) {
    selectedCategoriasIds.value.splice(idx, 1)
  } else {
    selectedCategoriasIds.value.push(cat.id)
  }
  categoriaActual.value = categorias.value
    .filter(c => selectedCategoriasIds.value.includes(c.id))
    .map(c => c.nombre)
    .join(', ') || '(Sin categorías)'
}

const guardarCategoria = async () => {
  guardandoCategoria.value = true
  mensajeCategoria.value = ''
  try {
    await horariosService.actualizarCategorias(restauranteId.value, selectedCategoriasIds.value)
    originalCategoriasIds.value = [...selectedCategoriasIds.value]
    mensajeCategoria.value = '✅ Categorías guardadas'
    mensajeCategoriaType.value = 'alert-success'
    setTimeout(() => { mensajeCategoria.value = '' }, 3000)
  } catch (e) {
    mensajeCategoria.value = '❌ Error al guardar categorías'
    mensajeCategoriaType.value = 'alert-error'
  } finally {
    guardandoCategoria.value = false
  }
}

const guardarHorarios = async () => {
  guardandoHorarios.value = true
  mensajeHorario.value = ''
  try {
    const horarios = diasSemana
      .filter(d => horariosDias.value[d.value].activo)
      .map(d => ({
        dia_semana: d.value,
        apertura: horariosDias.value[d.value].apertura,
        cierre: horariosDias.value[d.value].cierre
      }))
    await horariosService.guardarHorarios(restauranteId.value, horarios)
    horariosChanged.value = false
    mensajeHorario.value = '✅ Horarios guardados'
    mensajeHorarioType.value = 'alert-success'
    setTimeout(() => { mensajeHorario.value = '' }, 3000)
  } catch (e) {
    mensajeHorario.value = '❌ Error al guardar horarios'
    mensajeHorarioType.value = 'alert-error'
  } finally {
    guardandoHorarios.value = false
  }
}

onMounted(async () => {
  if (!restauranteId.value) {
    return
  }

  try {
    const data = await api.get(`/restaurantes/${restauranteId.value}`)
    form.value = {
      nombre: data.nombre || '',
      descripcion: data.descripcion || '',
      direccion: data.direccion || '',
      telefono: data.telefono || '',
      latitud: data.latitud,
      longitud: data.longitud,
      foto_portada: data.foto_portada || ''
    }
    Object.assign(initialForm, form.value)

    const catActuales = data.restaurante_categorias || []
    if (catActuales.length > 0) {
      selectedCategoriasIds.value = catActuales.map(rc => rc.categorias_restaurante.id)
      originalCategoriasIds.value = [...selectedCategoriasIds.value]
      categoriaActual.value = catActuales.map(rc => rc.categorias_restaurante.nombre).join(', ')
    }
  } catch (e) {
    console.error('Error al cargar datos:', e)
  }

  try {
    const data = await restaurantesService.getCategorias()
    categorias.value = Array.isArray(data) ? data : (data?.categorias || [])
  } catch (e) {
    console.error('Error cargando categorías:', e)
  }

  try {
    const data = await horariosService.getHorarios(restauranteId.value)
    ;(data || []).forEach(h => {
      horariosDias.value[h.dia_semana] = {
        activo: true,
        apertura: h.apertura?.slice(0, 5) || '08:00',
        cierre: h.cierre?.slice(0, 5) || '22:00'
      }
    })
  } catch (e) {}

  try {
    const centro = form.value.latitud ? [form.value.latitud, form.value.longitud] : [-16.5, -68.15]
    mapa = L.map('mapa-edicion').setView(centro, 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      attribution: '© OpenStreetMap' 
    }).addTo(mapa)
    
    if (form.value.latitud && form.value.longitud) {
      crearMarker(form.value.latitud, form.value.longitud)
    }
    
    mapa.on('click', (e) => {
      form.value.latitud = e.latlng.lat
      form.value.longitud = e.latlng.lng
      hasChanges.value = true
      if (marker) {
        marker.setLatLng(e.latlng)
      } else {
        crearMarker(form.value.latitud, form.value.longitud)
      }
    })
  } catch (errorMapa) {
    console.error("Error al inicializar el mapa de Leaflet:", errorMapa)
  }
})

// Función de guardado SIN mensaje interno (solo Toast)
const guardar = async () => {
  if (!hasChanges.value) return
  guardando.value = true
  try {
    await api.put(`/restaurantes/${restauranteId.value}`, form.value)
    Object.assign(initialForm, form.value)
    hasChanges.value = false
    // Mostrar Toast flotante en lugar del mensaje interno
    showToast()
  } catch (e) {
    console.error('Error al guardar:', e)
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>

.page-header { 
  margin-bottom: 0; 
  padding-top: 80px; 
  padding-left: 24px;
  padding-right: 24px;
  position: relative; 
  z-index: 2;
}
.page-header h1 { color: white; font-size: 2.2rem; margin: 0 0 8px 0; font-weight: 700; }
.subtitle { color: rgba(255,255,255,0.85); font-size: 1rem; margin: 0; }
/* Header decorativo */
.page-header::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 220px;
  background: linear-gradient(135deg, #481827 0%, #6B1B3C 100%);
  z-index: -1;
}
.profile-wrapper {
  padding: 0 24px;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  align-items: start;
  margin-top: 24px;
  height: calc(100vh - 200px); /* 👈 */
}

.profile-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto; /* 👈 */
  max-height: calc(100vh - 200px); /* 👈 */
  padding-right: 8px;
}

.profile-left {
  border-radius: 32px;
  overflow: visible; /* 👈 cambia hidden por visible */
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  align-self: start;
  background: white;
}

.profile-right::-webkit-scrollbar {
  width: 6px;
}
.profile-right::-webkit-scrollbar-track {
  background: transparent;
}
.profile-right::-webkit-scrollbar-thumb {
  background: #e0d0d5;
  border-radius: 10px;
}
.profile-right::-webkit-scrollbar-thumb:hover {
  background: #c0a0a8;
}





.cover-preview {
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #481827, #8b3a52);
  border-radius: 32px 32px 0 0; 
  overflow: hidden;
}
.cover-img { width: 100%; height: 100%; object-fit: cover; }
.cover-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5);
}

.preview-info { padding: 20px; border-bottom: 1px solid #f5f5f5; }
.preview-name { font-size: 1.1rem; font-weight: 700; color: #481827; margin: 0 0 4px 0; }
.preview-email { font-size: 0.82rem; color: #999; margin: 0 0 10px 0; }
.preview-desc {
  font-size: 0.85rem; color: #666; margin: 0 0 10px 0; line-height: 1.5;
  display: -webkit-box; line-clamp: 3; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.preview-row { display: flex; align-items: center; gap: 6px; font-size: 0.83rem; color: #888; margin-top: 6px; }

.btn-guardar {
  display: block; width: calc(100% - 40px);
  margin: 16px 20px 20px; padding: 14px;
  background: linear-gradient(135deg, #481827, #6B1B3C); color: white;
  border: none; border-radius: 50px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s; text-align: center;
}
.btn-guardar:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(72,24,39,0.3); }
.btn-disabled, .btn-guardar:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }



.form-card { background: white; border-radius: 32px; padding: 28px; box-shadow: 0 12px 35px rgba(0,0,0,0.08); }

.card-title {
  font-size: 1.1rem; font-weight: 700; color: #481827;
  margin: 0 0 8px 0; padding-bottom: 12px; border-bottom: 2px solid #f5f0eb;
}
.section-hint { font-size: 0.88rem; color: #999; margin: 0 0 20px 0; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 20px; }
.form-group:last-child { margin-bottom: 0; }

.form-label {
  display: block; font-size: 0.82rem; font-weight: 700;
  color: #555; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;
}

.form-input {
  width: 100%; padding: 14px 18px;
  border: 1.5px solid #e8e8e8; border-radius: 16px;
  font-size: 0.95rem; color: #333; font-family: inherit;
  transition: all 0.2s; box-sizing: border-box;
}
.form-input:focus { outline: none; border-color: #481827; box-shadow: 0 0 0 3px rgba(72,24,39,0.1); }
.form-textarea { resize: vertical; min-height: 110px; }
.char-count { font-size: 0.75rem; color: #aaa; margin-top: 4px; text-align: right; }
.email-display { padding: 14px 18px; background: #f5f5f5; border-radius: 16px; color: #888; font-size: 0.95rem; }

.categorias-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.cat-btn {
  padding: 8px 18px; border-radius: 20px;
  border: 1.5px solid #e0e0e0; background: white;
  color: #555; font-size: 0.88rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}
.cat-btn:hover { border-color: #481827; color: #481827; }
.cat-btn.active { background: #481827; color: white; border-color: #481827; }
.empty-categories { font-size: 0.88rem; color: #999; font-style: italic; padding: 20px; text-align: center; width: 100%; }
.selected-cats { margin-top: 12px; padding: 10px 14px; background: #f0f0f0; border-radius: 12px; font-size: 0.88rem; }
.cats-label { font-weight: 600; color: #555; }

.btn-save-cat {
  margin-top: 16px; padding: 12px 24px;
  background: linear-gradient(135deg, #481827, #6B1B3C); color: white;
  border: none; border-radius: 50px;
  font-weight: 700; font-size: 0.9rem;
  cursor: pointer; transition: all 0.2s;
}
.btn-save-cat:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(72,24,39,0.3); }
.btn-save-cat:disabled { opacity: 0.6; cursor: not-allowed; }

.horarios-list { display: flex; flex-direction: column; gap: 12px; }
.horario-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
  padding: 12px 16px; background: #faf8f6; border-radius: 16px;
}
.dia-check { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.dia-nombre { font-weight: 600; color: #333; font-size: 0.9rem; width: 90px; }
.horas { display: flex; align-items: center; gap: 8px; transition: opacity 0.2s; }
.horas.disabled { opacity: 0.35; pointer-events: none; }
.time-input {
  padding: 7px 10px; border: 1.5px solid #e0e0e0;
  border-radius: 10px; font-size: 0.88rem;
  font-family: inherit; color: #333; transition: border-color 0.2s;
}
.time-input:focus { outline: none; border-color: #481827; }
.time-sep { color: #aaa; font-weight: 600; }

.map-container { width: 100%; height: 280px; border-radius: 16px; overflow: hidden; margin-bottom: 14px; }
.coordinates { font-size: 0.8rem; color: #999; padding: 10px 0; font-family: monospace; }

.input-search-container { display: flex; gap: 8px; align-items: stretch; }
.input-search-container .form-input { flex: 1; margin-bottom: 0; }

.btn-buscar-mapa {
  padding: 11px 16px;
  background: #481827; color: white;
  border: none; border-radius: 16px;
  font-size: 0.85rem; font-weight: 700;
  cursor: pointer; white-space: nowrap;
  transition: all 0.2s; font-family: inherit;
}
.btn-buscar-mapa:hover:not(:disabled) { background: #6b2540; transform: translateY(-1px); }
.btn-buscar-mapa:disabled { opacity: 0.5; cursor: not-allowed; }
.error-message { color: #e74c3c; font-size: 0.8rem; margin-top: 6px; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.modal-card {
  background: white; border-radius: 32px;
  padding: 1.75rem; max-width: 420px; width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  text-align: center;
}
.modal-icon { display: flex; justify-content: center; margin-bottom: 1rem; }
.icon-circle-save {
  background-color: #fff3e6; border-radius: 9999px; padding: 0.75rem;
  color: #8B2E34; display: inline-flex; align-items: center; justify-content: center;
}
.modal-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem; }
.modal-message { font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; line-height: 1.5; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: center; }
.modal-btn {
  padding: 0.6rem 1.5rem; border-radius: 9999px;
  font-weight: 600; font-size: 0.875rem; cursor: pointer;
  transition: all 0.2s; border: none;
}
.modal-btn.cancel { background-color: #f3f4f6; color: #4b5563; }
.modal-btn.cancel:hover { background-color: #e5e7eb; }
.modal-btn.confirm-save { background: linear-gradient(135deg, #481827, #6B1B3C); color: white; }
.modal-btn.confirm-save:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(72,24,39,0.3); }

/* Toast */
.success-toast {
  position: fixed; top: 24px; right: 24px; z-index: 1100;
  background: linear-gradient(135deg, #10B981, #059669);
  border-radius: 20px; padding: 16px 24px;
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.15); min-width: 260px;
}
.toast-content { display: flex; align-items: center; gap: 14px; }
.toast-icon {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  background: rgba(255,255,255,0.2); border-radius: 50%; color: white;
}
.toast-message strong { font-size: 0.875rem; font-weight: 700; color: white; display: block; }

/* Profile Header */
.profile-header-bg {
  display: none;
}



.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-active .modal-card, .modal-fade-leave-active .modal-card { transition: transform 0.25s ease, opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-card, .modal-fade-leave-to .modal-card { transform: scale(0.95); opacity: 0; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(100%); }

@media (max-width: 900px) {
  .profile-wrapper { grid-template-columns: 1fr; }
  .profile-left { position: static; }
  .form-row { grid-template-columns: 1fr; }
  .horario-row { flex-direction: column; align-items: flex-start; }
  .success-toast { top: 16px; right: 16px; left: 16px; min-width: auto; }
}

@media (max-width: 768px) {
  .page-header {
    z-index: 0;
  }

  .page-header::before {
    position: absolute;
    pointer-events: none;
  }
}
</style>