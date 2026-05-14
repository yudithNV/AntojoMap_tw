<template>
  <DashboardLayout>
    <div class="container">
      <div class="profile-header">
        <h1 class="profile-title">Perfil del Restaurante</h1>
        <p class="profile-subtitle">Edita la información de tu restaurante</p>
      </div>

      <div class="profile-card">
        <!-- Email (Read-only) -->
        <div class="form-section">
          <label class="form-label">Email de cuenta</label>
          <div class="email-display">{{ userEmail }}</div>
        </div>

        <!-- Nombre -->
        <div class="form-group">
          <label class="form-label">Nombre del restaurante</label>
          <input 
            v-model="form.nombre" 
            type="text"
            class="form-input"
            placeholder="Ej: La Parrilla del Barrio"
            @blur="checkChanges"
          />
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label class="form-label">Descripción</label>
          <textarea 
            v-model="form.descripcion" 
            class="form-input form-textarea"
            rows="4"
            placeholder="Cuéntanos sobre tu restaurante, especialidades, historia..."
            @blur="checkChanges"
          />
          <p class="char-count">{{ form.descripcion?.length || 0 }} caracteres</p>
        </div>

        <!-- Dirección -->
        <div class="form-group">
          <label class="form-label">Dirección</label>
          <input 
            v-model="form.direccion" 
            type="text"
            class="form-input"
            placeholder="Ej: Calle Principal 123, La Paz"
            @blur="checkChanges"
          />
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label class="form-label">Teléfono de contacto</label>
          <input 
            v-model="form.telefono" 
            type="tel"
            class="form-input"
            placeholder="Ej: +591 12345678"
            @blur="checkChanges"
          />
        </div>

        <!-- Ubicación en mapa -->
        <div class="location-section">
          <label class="form-label">Ubicación en el mapa</label>
          <p class="location-hint">Haz clic en el mapa para marcar tu ubicación</p>
          <div id="mapa-edicion" class="map-container"></div>
          
          <div v-if="form.latitud" class="coordinates">
            <span class="coord-label">Coordenadas:</span>
            <span class="coord-value">{{ form.latitud.toFixed(4) }}, {{ form.longitud.toFixed(4) }}</span>
          </div>
        </div>

        <!-- Mensajes -->
        <div v-if="mensaje" :class="['alert', mensajeType]">
          {{ mensaje }}
        </div>

        <!-- Botón Guardar -->
        <div class="button-group">
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
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { api } from '@/services/api.js'

const userEmail = ref(localStorage.getItem('user_email') || '')
const restauranteId = ref(localStorage.getItem('restaurante_id') || '')
const guardando = ref(false)
const mensaje = ref('')
const mensajeType = ref('')
const hasChanges = ref(false)

const initialForm = {
  nombre: '',
  descripcion: '',
  direccion: '',
  telefono: '',
  latitud: null,
  longitud: null
}

const form = ref({ ...initialForm })
let marker = null

const checkChanges = () => {
  hasChanges.value = JSON.stringify(form.value) !== JSON.stringify(initialForm)
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
      longitud: data.longitud
    }
    Object.assign(initialForm, form.value)
  } catch (e) {
    mensaje.value = 'Error al cargar datos: ' + e.message
    mensajeType.value = 'alert-error'
  }

  // Inicializar mapa
  const centro = form.value.latitud
    ? [form.value.latitud, form.value.longitud]
    : [-16.5, -68.15]

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

    if (marker) {
      marker.setLatLng(e.latlng)
    } else {
      marker = L.marker(e.latlng).addTo(mapa)
    }
  })
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
    setTimeout(() => {
      mensaje.value = ''
    }, 3000)
  } catch (e) {
    mensaje.value = '❌ Error al guardar: ' + e.message
    mensajeType.value = 'alert-error'
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
:root {
  --primary-red: #c0392b;
  --primary-red-dark: #a93226;
  --primary-red-light: #e74c3c;
  --gray-light: #f5f5f5;
  --gray-medium: #e8e8e8;
  --gray-dark: #6c757d;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --border-radius: 12px;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.profile-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.profile-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 40px;
  box-shadow: var(--shadow-medium);
}

.form-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 28px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--gray-medium);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-primary);
  background: white;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1);
}

.form-input::placeholder {
  color: var(--text-secondary);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.char-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
  text-align: right;
}

.email-display {
  padding: 12px 16px;
  background: var(--gray-light);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.location-section {
  margin-bottom: 30px;
  border-top: 1px solid var(--gray-medium);
  padding-top: 30px;
}

.location-hint {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  margin-bottom: 16px;
  overflow: hidden;
}

.coordinates {
  background: var(--gray-light);
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.coord-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.coord-value {
  font-family: 'Courier New', monospace;
  color: var(--primary-red);
  font-weight: 600;
}

.alert {
  padding: 14px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  border-top: 1px solid var(--gray-medium);
  padding-top: 30px;
}

.btn-guardar {
  flex: 1;
  padding: 14px 24px;
  background: var(--primary-red);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-guardar:hover:not(:disabled) {
  background: var(--primary-red-dark);
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

.btn-guardar:active:not(:disabled) {
  transform: translateY(0);
}

.btn-disabled,
.btn-guardar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #bdc3c7;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 12px;
  }

  .profile-card {
    padding: 24px;
  }

  .profile-title {
    font-size: 2rem;
  }

  .map-container {
    height: 250px;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-input {
    padding: 10px 12px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 8px;
  }

  .profile-card {
    padding: 16px;
  }

  .profile-title {
    font-size: 1.5rem;
  }

  .map-container {
    height: 200px;
  }

  .coordinates {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>