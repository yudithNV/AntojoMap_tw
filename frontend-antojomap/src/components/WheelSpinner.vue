<template>
  <div class="wheel-container">
    <div class="wheel" :style="{ transform: `rotate(${rotation}deg)` }">
      <div v-for="(item, index) in items" :key="index" class="wheel-section" :style="{ transform: `rotate(${(360 / items.length) * index}deg)` }">
        <div class="section-icon" :style="{ transform: `rotate(${(360 / items.length) / 2}deg)` }">
          <!-- Renderizamos el componente del icono -->
          <component :is="item.icon" :size="32" color="white" />
        </div>
      </div>
      <div class="wheel-center">
        <button class="go-button" :class="{ spinning: isSpinning }" @click="spinWheel" :disabled="isSpinning">GO!</button>
      </div>
    </div>
    <div class="pointer"></div>

    <div v-if="showResult" class="result-modal">
      <div class="result-card">
        <p class="result-label">¡La ruleta se detuvo en:</p>
        <h3 class="result-title">{{ selectedItem ? selectedItem.name : 'Sorpresa' }}</h3>
        <button class="result-close" @click="closeResult">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Importamos los iconos que necesitamos
import { Pizza, Ham, Fish, IceCream, Salad, Utensils } from 'lucide-vue-next'

const rotation = ref(0)
const isSpinning = ref(false)
const selectedItem = ref(null)
const showResult = ref(false)

// Reemplazamos los strings de emojis por los componentes importados
const items = [
  { name: 'Tacos', icon: Utensils },
  { name: 'Burgers', icon: Ham },
  { name: 'Sushi', icon: Fish },
  { name: 'Pizza', icon: Pizza },
  { name: 'Postres', icon: IceCream },
  { name: 'Veggie', icon: Salad },
]

const spinWheel = () => {
  if (isSpinning.value) return
  isSpinning.value = true
  const sectionAngle = 360 / items.length
  const targetIndex = Math.floor(Math.random() * items.length)
  const randomTurns = 1440
  const targetRotation = randomTurns + targetIndex * sectionAngle
  rotation.value += targetRotation

  setTimeout(() => {
    isSpinning.value = false
    selectedItem.value = items[targetIndex]
    showResult.value = true
  }, 1600)
}

const closeResult = () => {
  showResult.value = false
}
</script>

<style scoped>
.wheel-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  padding: 0 12px;
}

.pointer {
  position: absolute;
  top: -20px;
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-top: 30px solid #A33333;
  z-index: 20;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.24));
  transition: transform 0.2s ease, filter 0.2s ease;
}

.pointer::after {
  content: '';
  position: absolute;
  top: -38px;
  left: -8px;
  width: 16px;
  height: 16px;
  background-color: #A33333;
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.22);
}

.wheel {
  width: 430px;
  height: 430px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #8A1A36 0deg 60deg,
    #A33333 60deg 120deg,
    #C64445 120deg 180deg,
    #7B1C32 180deg 240deg,
    #A33333 240deg 300deg,
    #8A1A36 300deg 360deg
  );
  border: 6px solid rgba(107, 33, 33, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 0 22px 40px -12px rgba(0, 0, 0, 0.28), inset 0 2px 6px rgba(255, 255, 255, 0.18);
}

.wheel:hover {
  box-shadow: 0 28px 45px -16px rgba(107, 33, 33, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.2);
  transform: scale(1.01);
}

.wheel-section {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 28px;
}

.section-icon {
  font-size: 2.2rem;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.28));
  transition: transform 0.2s ease, filter 0.2s ease;
  color: #fff;
  font-weight: 700;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.15);
}

.section-icon:hover {
  transform: translateY(-2px);
}

.wheel-center {
  width: 140px;
  height: 140px;
  background-color: #FFFBF2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2), inset 0 2px 6px rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(163, 51, 51, 0.26);
}

.go-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #A33333;
  color: #FFFBF2;
  border: none;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 10px 26px rgba(163, 51, 51, 0.35);
  font-family: inherit;
  text-transform: uppercase;
}

.go-button.spinning,
.go-button.spinning {
  animation: buttonPulse 0.85s ease-in-out infinite;
  background-color: #bf3641;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 18px 42px rgba(163, 51, 51, 0.55);
}

.go-button:hover:not(:disabled) {
  transform: scale(1.07);
  background-color: #C64445;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 14px 34px rgba(163, 51, 51, 0.45);
}

.go-button:active:not(:disabled) {
  transform: scale(0.96);
  transition: transform 0.08s linear;
  box-shadow: 0 6px 16px rgba(163, 51, 51, 0.35);
}

.go-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: scale(0.98);
  background-color: #8A1A36;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}

@keyframes buttonPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 18px 42px rgba(163, 51, 51, 0.55);
  }
  50% {
    transform: scale(1.08);
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 22px 52px rgba(163, 51, 51, 0.65);
  }
}

.result-modal {
  position: fixed;
  inset: 0;
  background: rgba(19, 2, 10, 0.46);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.result-card {
  width: min(360px, 100%);
  background: rgba(255, 251, 242, 0.98);
  border: 1px solid rgba(163, 51, 51, 0.18);
  border-radius: 22px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(107, 33, 33, 0.18);
  animation: popIn 0.34s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.result-label {
  margin: 0 0 12px;
  color: #6b2121;
  font-size: 0.95rem;
  font-weight: 600;
}

.result-title {
  margin: 0 0 24px;
  font-size: 2rem;
  color: #A33333;
  font-weight: 800;
}

.result-close {
  padding: 12px 18px;
  border-radius: 999px;
  border: none;
  background: #A33333;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: transform 0.25s ease, filter 0.25s ease;
}

.result-close:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 640px) {
  .wheel {
    width: 320px;
    height: 320px;
  }

  .wheel-center {
    width: 90px;
    height: 90px;
  }

  .go-button {
    width: 82px;
    height: 82px;
    font-size: 1.2rem;
  }

  .section-icon {
    font-size: 1.5rem;
    padding-top: 5px;
  }

  .pointer {
    top: -12px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 20px solid #A33333;
  }

  .pointer::after {
    top: -26px;
    left: -5px;
    width: 10px;
    height: 10px;
  }
}
</style>