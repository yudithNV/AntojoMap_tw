<template>
  <div v-if="showModal" class="modal-overlay" @click.self="cerrar">
    <div class="modal-container">
      <!-- Header con X -->
      <button class="btn-close" @click="cerrar" aria-label="Cerrar">
        ×
      </button>

      <!-- Contenedor principal -->
      <div class="modal-content">
        <!-- Sección de filtros y botón girar (cuando no hay resultado) -->
        <div v-if="!selectedPlato" class="filtros-section">
          <h2 class="modal-title">🎲 ¡Sorpréndete con un plato!</h2>
          
          <!-- Chips de tipo -->
          <div class="tipo-chips">
            <button 
              class="chip" 
              :class="{ active: tipoSeleccionado === '' }"
              @click="tipoSeleccionado = ''; cargarPlatos()"
            >
              🍽️ Todos
            </button>
            <button 
              class="chip" 
              :class="{ active: tipoSeleccionado === 'plato_suelto' }"
              @click="tipoSeleccionado = 'plato_suelto'; cargarPlatos()"
            >
              🥘 Platos
            </button>
            <button 
              class="chip" 
              :class="{ active: tipoSeleccionado === 'almuerzo_completo' }"
              @click="tipoSeleccionado = 'almuerzo_completo'; cargarPlatos()"
            >
              🥗 Almuerzos
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="cargandoPlatos" class="loading-state">
            <p>Cargando platos...</p>
          </div>

          <!-- Botón Girar -->
          <button 
            v-else 
            class="btn-girar" 
            @click="girar"
            :disabled="platosDisponibles.length === 0"
          >
            🎲 Girar
          </button>

          <!-- Mensaje si no hay platos -->
          <p v-if="!cargandoPlatos && platosDisponibles.length === 0" class="no-platos">
            No encontramos platos con ese filtro.
          </p>
        </div>

        <!-- Carta de resultado -->
        <div v-else class="resultado-section">
          <div class="plato-card">
            <!-- Imagen del plato -->
            <div class="plato-img">
              <img v-if="selectedPlato.foto_url" :src="selectedPlato.foto_url" :alt="selectedPlato.nombre" />
              <div v-else class="plato-img-placeholder">🍽️</div>
              <span class="tipo-badge">{{ selectedPlato.tipo === 'plato_suelto' ? '🥘 Plato' : '🥗 Almuerzo' }}</span>
            </div>

            <!-- Info del plato -->
            <div class="plato-info">
              <h3>{{ selectedPlato.nombre }}</h3>
              
              <!-- Precio destacado -->
              <div class="precio-box">Bs {{ selectedPlato.precio }}</div>

              <!-- Descripción -->
              <p v-if="selectedPlato.descripcion" class="descripcion">
                {{ selectedPlato.descripcion }}
              </p>

              <!-- Componentes si es almuerzo -->
              <div v-if="selectedPlato.tipo === 'almuerzo_completo'" class="componentes">
                <div v-if="selectedPlato.entrada_nombre" class="componente-item">
                  <span class="componente-icon">🍴</span>
                  <span>{{ selectedPlato.entrada_nombre }}</span>
                </div>
                <div v-if="selectedPlato.principal_nombre" class="componente-item">
                  <span class="componente-icon">🍗</span>
                  <span>{{ selectedPlato.principal_nombre }}</span>
                </div>
                <div v-if="selectedPlato.postre_nombre" class="componente-item">
                  <span class="componente-icon">🍰</span>
                  <span>{{ selectedPlato.postre_nombre }}</span>
                </div>
              </div>

              <!-- Restaurante -->
              <p class="restaurante-nombre">
                📍 {{ selectedPlato.restaurantes?.nombre }}
              </p>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="acciones">
            <button class="btn-accion primary" @click="irAlRestaurante">
              Ver restaurante
            </button>
            <button class="btn-accion secondary" @click="girarOtraVez">
              Otra vez 🎲
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { almuerzosService } from '@/services/menu.service.js'

const router = useRouter()

const emit = defineEmits(['close'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Estado
const showModal = ref(props.isOpen)
const tipoSeleccionado = ref('')
const platosDisponibles = ref([])
const selectedPlato = ref(null)
const cargandoPlatos = ref(false)

// Cargar platos cuando se abre el modal
watch(() => props.isOpen, (newVal) => {
  showModal.value = newVal
  if (newVal) {
    cargarPlatos()
  }
})

const cargarPlatos = async () => {
  cargandoPlatos.value = true
  try {
    const data = await almuerzosService.buscarPlatos('', tipoSeleccionado.value)
    platosDisponibles.value = data || []
  } catch (e) {
    console.error('Error cargando platos:', e)
    platosDisponibles.value = []
  } finally {
    cargandoPlatos.value = false
  }
}

const girar = () => {
  if (platosDisponibles.value.length === 0) return

  const randomIndex = Math.floor(Math.random() * platosDisponibles.value.length)
  selectedPlato.value = platosDisponibles.value[randomIndex]
}

const girarOtraVez = () => {
  selectedPlato.value = null
  girar()
}

const irAlRestaurante = () => {
  if (selectedPlato.value) {
    router.push(`/user/menu/${selectedPlato.value.restaurante_id}`)
    cerrar()
  }
}

const cerrar = () => {
  showModal.value = false
  selectedPlato.value = null
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #481827;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
}

.btn-close:hover {
  background: rgba(72, 24, 39, 0.1);
}

.modal-content {
  padding: 40px 32px;
}

.modal-title {
  margin: 0 0 28px 0;
  font-size: 1.5rem;
  color: var(--plum, #481827);
  font-weight: 800;
  text-align: center;
}

/* FILTROS SECTION */
.filtros-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.tipo-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid var(--plum, #481827);
  background: transparent;
  color: var(--plum, #481827);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.chip:hover {
  background: rgba(72, 24, 39, 0.05);
}

.chip.active {
  background: var(--plum, #481827);
  color: white;
  box-shadow: 0 4px 12px rgba(72, 24, 39, 0.3);
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: var(--dusty-coral, #D893A1);
}

.loading-state p {
  margin: 0;
  font-size: 0.95rem;
}

.btn-girar {
  padding: 14px 32px;
  background: linear-gradient(135deg, #481827 0%, #6b2540 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 16px rgba(72, 24, 39, 0.25);
  font-family: inherit;
}

.btn-girar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(72, 24, 39, 0.35);
}

.btn-girar:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-girar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-platos {
  text-align: center;
  color: var(--dusty-coral, #D893A1);
  margin: 0;
  font-size: 0.95rem;
}

/* RESULTADO SECTION */
.resultado-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plato-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  animation: cardSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.plato-img {
  position: relative;
  height: 200px;
  background: #f5f0eb;
  overflow: hidden;
}

.plato-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plato-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.tipo-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(72, 24, 39, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.plato-info {
  padding: 20px;
}

.plato-info h3 {
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  color: var(--plum, #481827);
  font-weight: 700;
}

.precio-box {
  display: inline-block;
  background: #fff3e0;
  color: #C0392B;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.descripcion {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.componentes {
  margin: 12px 0;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.componente-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #333;
}

.componente-icon {
  font-size: 1.1rem;
}

.restaurante-nombre {
  margin: 12px 0 0 0;
  font-size: 0.9rem;
  color: #999;
  font-weight: 500;
}

.acciones {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.btn-accion {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-accion.primary {
  background: var(--dusty-coral, #D893A1);
  color: white;
  box-shadow: 0 4px 12px rgba(216, 147, 161, 0.25);
}

.btn-accion.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(216, 147, 161, 0.35);
}

.btn-accion.primary:active {
  transform: scale(0.98);
}

.btn-accion.secondary {
  background: #f0f0f0;
  color: var(--plum, #481827);
  border: 1.5px solid #ddd;
}

.btn-accion.secondary:hover {
  background: #f9f9f9;
  border-color: var(--plum, #481827);
}

.btn-accion.secondary:active {
  transform: scale(0.98);
}

@media (max-width: 600px) {
  .modal-container {
    max-width: 100%;
    border-radius: 16px;
  }

  .modal-content {
    padding: 32px 20px;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .plato-card {
    border-radius: 12px;
  }

  .plato-img {
    height: 180px;
  }

  .plato-info {
    padding: 16px;
  }

  .tipo-chips {
    gap: 8px;
  }

  .chip {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
}
</style>
