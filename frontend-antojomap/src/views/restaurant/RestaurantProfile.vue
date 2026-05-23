<template>
  <DashboardLayout>
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

        <div v-if="mensaje" :class="['alert', mensajeType]">{{ mensaje }}</div>

        <button
          class="btn-guardar"
          :class="{ 'btn-disabled': !hasChanges || guardando }"
          :disabled="!hasChanges || guardando"
          @click="guardar"
        >
          <span v-if="!guardando">💾 Guardar cambios</span>
          <span v-else>Guardando...</span>
        </button>
      </div>

      <!-- Columna derecha: formulario -->
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
              <input v-model="form.direccion" type="text" class="form-input" placeholder="Calle Principal 123" @input="checkChanges" />
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input v-model="form.telefono" type="tel" class="form-input" placeholder="+591 12345678" @input="checkChanges" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Foto de portada (URL)</label>
            <input v-model="form.foto_portada" type="url" class="form-input" placeholder="https://..." @input="checkChanges" />
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

          <button
            v-if="JSON.stringify(selectedCategoriasIds) !== JSON.stringify(originalCategoriasIds)"
            class="btn-save-cat"
            @click="guardarCategoria"
            :disabled="guardandoCategoria"
          >
            {{ guardandoCategoria ? 'Guardando...' : '✓ Guardar categorías' }}
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

        <!-- Mapa -->
        <div class="form-card">
          <h3 class="card-title">Ubicación en el mapa</h3>
          <p class="section-hint">Hacé clic en el mapa para marcar tu ubicación</p>
          <div id="mapa-edicion" class="map-container"></div>
          <div v-if="form.latitud" class="coordinates">
            <span class="coord-label">Coordenadas:</span>
            <span class="coord-value">{{ form.latitud.toFixed(4) }}, {{ form.longitud.toFixed(4) }}</span>
          </div>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { UtensilsCrossed, MapPin, Phone, Tag } from 'lucide-vue-next'
import { api } from '@/services/api.js'
import { horariosService } from '@/services/restaurante.service.js'
import { restaurantesService } from '@/services/menu.service.js'

const userEmail = ref(localStorage.getItem('user_email') || '')
const restauranteId = ref(localStorage.getItem('restaurante_id') || '')
const guardando = ref(false)
const mensaje = ref('')
const mensajeType = ref('')
const hasChanges = ref(false)

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

const checkChanges = () => {
  hasChanges.value = JSON.stringify(form.value) !== JSON.stringify(initialForm)
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
    mensaje.value = 'Error: No se pudo obtener el ID del restaurante.'
    mensajeType.value = 'alert-error'
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
    mensaje.value = 'Error al cargar datos: ' + e.message
    mensajeType.value = 'alert-error'
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
    const mapa = L.map('mapa-edicion').setView(centro, 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      attribution: '© OpenStreetMap' 
    }).addTo(mapa)
    
    if (form.value.latitud) {
      marker = L.marker([form.value.latitud, form.value.longitud]).addTo(mapa)
    }
    
    mapa.on('click', (e) => {
      form.value.latitud = e.latlng.lat
      form.value.longitud = e.latlng.lng
      hasChanges.value = true
      if (marker) marker.setLatLng(e.latlng)
      else marker = L.marker(e.latlng).addTo(mapa)
    })
  } catch (errorMapa) {
    console.error("Error al inicializar el mapa de Leaflet:", errorMapa)
  }
})

const guardar = async () => {
  if (!hasChanges.value) return
  guardando.value = true
  mensaje.value = ''
  try {
    await api.put(`/restaurantes/${restauranteId.value}`, form.value)
    mensaje.value = '✅ Cambios guardados exitosamente'
    mensajeType.value = 'alert-success'
    Object.assign(initialForm, form.value)
    hasChanges.value = false
    setTimeout(() => { mensaje.value = '' }, 3000)
  } catch (e) {
    mensaje.value = '❌ Error al guardar: ' + e.message
    mensajeType.value = 'alert-error'
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 30px; }
.page-header h1 { color: var(--plum); font-size: 2rem; margin: 0 0 8px 0; }
.subtitle { color: var(--dusty-coral); font-size: 0.95rem; margin: 0; }

.profile-wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  align-items: start;
}

.profile-left {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  /* position: sticky;  <-- Comenta o borra esta línea */
  /* top: 24px;         <-- Comenta o borra esta línea */
}

.cover-preview {
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, var(--plum, #481827), #8b3a52);
  overflow: hidden;
}
.cover-img { width: 100%; height: 100%; object-fit: cover; }
.cover-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5);
}

.preview-info { padding: 20px; border-bottom: 1px solid #f5f5f5; }
.preview-name { font-size: 1.1rem; font-weight: 700; color: var(--plum); margin: 0 0 4px 0; }
.preview-email { font-size: 0.82rem; color: #999; margin: 0 0 10px 0; }
.preview-desc {
  font-size: 0.85rem; color: #666; margin: 0 0 10px 0; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.preview-row { display: flex; align-items: center; gap: 6px; font-size: 0.83rem; color: #888; margin-top: 6px; }

.alert { margin: 16px 20px 0; padding: 12px 16px; border-radius: 8px; font-size: 0.88rem; font-weight: 500; }
.alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

.btn-guardar {
  display: block; width: calc(100% - 40px);
  margin: 16px 20px 20px; padding: 12px;
  background: var(--plum, #481827); color: white;
  border: none; border-radius: 10px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s; text-align: center;
}
.btn-guardar:hover:not(:disabled) { background: #6b2540; transform: translateY(-1px); }
.btn-disabled, .btn-guardar:disabled { opacity: 0.5; cursor: not-allowed; background: #bdc3c7; transform: none; }

.profile-right { display: flex; flex-direction: column; gap: 20px; }

.form-card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }

.card-title {
  font-size: 1.1rem; font-weight: 700; color: var(--plum);
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
  width: 100%; padding: 11px 14px;
  border: 1.5px solid #e8e8e8; border-radius: 8px;
  font-size: 0.95rem; color: #333; font-family: inherit;
  transition: border-color 0.2s; box-sizing: border-box;
}
.form-input:focus { outline: none; border-color: var(--plum, #481827); }
.form-textarea { resize: vertical; min-height: 110px; }
.char-count { font-size: 0.75rem; color: #aaa; margin-top: 4px; text-align: right; }
.email-display { padding: 11px 14px; background: #f5f5f5; border-radius: 8px; color: #888; font-size: 0.95rem; }

.categorias-grid { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.cat-btn {
  padding: 8px 18px; border-radius: 20px;
  border: 1.5px solid #e0e0e0; background: white;
  color: #555; font-size: 0.88rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}
.cat-btn:hover { border-color: var(--plum); color: var(--plum); }
.cat-btn.active { background: var(--plum, #481827); color: white; border-color: var(--plum, #481827); }
.empty-categories { font-size: 0.88rem; color: #999; font-style: italic; padding: 20px; text-align: center; width: 100%; }
.selected-cats { margin-top: 12px; padding: 10px 14px; background: #f0f0f0; border-radius: 8px; font-size: 0.88rem; }
.cats-label { font-weight: 600; color: #555; }

.btn-save-cat {
  margin-top: 16px; padding: 10px 24px;
  background: #FF6B00; color: white;
  border: none; border-radius: 8px;
  font-weight: 700; font-size: 0.9rem;
  cursor: pointer; transition: background 0.2s;
}
.btn-save-cat:hover:not(:disabled) { background: #e05f00; }
.btn-save-cat:disabled { opacity: 0.6; cursor: not-allowed; }

.horarios-list { display: flex; flex-direction: column; gap: 12px; }
.horario-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
  padding: 12px 16px; background: #faf8f6; border-radius: 10px;
}
.dia-check { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.dia-nombre { font-weight: 600; color: #333; font-size: 0.9rem; width: 90px; }
.horas { display: flex; align-items: center; gap: 8px; transition: opacity 0.2s; }
.horas.disabled { opacity: 0.35; pointer-events: none; }
.time-input {
  padding: 7px 10px; border: 1.5px solid #e0e0e0;
  border-radius: 8px; font-size: 0.88rem;
  font-family: inherit; color: #333; transition: border-color 0.2s;
}
.time-input:focus { outline: none; border-color: var(--plum); }
.time-sep { color: #aaa; font-weight: 600; }

.map-container { width: 100%; height: 280px; border-radius: 10px; overflow: hidden; margin-bottom: 14px; }
.coordinates { display: flex; gap: 10px; align-items: center; background: #f5f5f5; padding: 10px 14px; border-radius: 8px; }
.coord-label { font-size: 0.82rem; font-weight: 600; color: #555; }
.coord-value { font-family: monospace; color: var(--plum); font-weight: 600; font-size: 0.88rem; }

@media (max-width: 900px) {
  .profile-wrapper { grid-template-columns: 1fr; }
  .profile-left { position: static; }
  .form-row { grid-template-columns: 1fr; }
  .horario-row { flex-direction: column; align-items: flex-start; }
}
</style>