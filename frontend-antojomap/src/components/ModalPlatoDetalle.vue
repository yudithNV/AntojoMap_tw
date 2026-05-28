<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <div class="modal-content">
            <!-- Botón cerrar -->
            <button class="modal-close" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <!-- Imagen del plato -->
            <div class="modal-image">
              <img 
                v-if="plato.foto_url" 
                :src="plato.foto_url" 
                :alt="plato.nombre"
              />
              <div v-else class="image-placeholder">
                <span class="placeholder-icon">🍽️</span>
              </div>
            </div>

            <!-- Contenido -->
            <div class="modal-body">
              <h2 class="plato-nombre">{{ plato.nombre }}</h2>
              
              <div class="plato-precio">
                <span class="precio-label">Precio:</span>
                <span class="precio-valor">Bs {{ plato.precio }}</span>
              </div>

              <div v-if="plato.descripcion" class="plato-descripcion">
                <h3>Descripción</h3>
                <p>{{ plato.descripcion }}</p>
              </div>

              <div v-if="plato.disponible === false" class="plato-no-disponible">
                ⚠️ No disponible actualmente
              </div>

              <button class="btn-pedir" @click="pedirPlato" :disabled="plato.disponible === false">
                Pedir este plato
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  plato: {
    type: Object,
    default: () => ({
      id: null,
      nombre: '',
      precio: '',
      descripcion: '',
      foto_url: '',
      disponible: true
    })
  }
})

const emit = defineEmits(['close', 'pedir'])

const close = () => {
  emit('close')
}

const pedirPlato = () => {
  emit('pedir', props.plato)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  max-width: 500px;
  width: 100%;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.05);
}

.modal-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5ede6, #e8dfd6);
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #481827, #6b253c);
}

.placeholder-icon {
  font-size: 4rem;
}

.modal-body {
  padding: 24px;
}

.plato-nombre {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--plum, #481827);
  margin: 0 0 16px 0;
}

.plato-precio {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0ede7;
}

.precio-label {
  font-size: 0.9rem;
  color: #666;
}

.precio-valor {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--dusty-coral, #D893A1);
}

.plato-descripcion h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--plum, #481827);
  margin: 0 0 8px 0;
}

.plato-descripcion p {
  color: #555;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.plato-no-disponible {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 12px;
  color: #991b1b;
  text-align: center;
  margin-bottom: 20px;
}

.btn-pedir {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #D893A1, #c17a8b);
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pedir:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(216, 147, 161, 0.4);
}

.btn-pedir:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>