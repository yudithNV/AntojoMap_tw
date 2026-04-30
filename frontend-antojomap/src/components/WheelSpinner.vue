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
        <button class="go-button" @click="spinWheel" :disabled="isSpinning">GO!</button>
      </div>
    </div>
    <div class="pointer"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Importamos los iconos que necesitamos
import { Pizza, Ham, Fish, IceCream, Salad, Utensils } from 'lucide-vue-next'

const rotation = ref(0)
const isSpinning = ref(false)

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
  const randomSpin = Math.floor(Math.random() * 360) + 1440 // Más vueltas para que se vea pro
  rotation.value += randomSpin
  setTimeout(() => { isSpinning.value = false }, 1500)
}
</script>

<style scoped>
.wheel-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
}

.pointer {
  position: absolute;
  top: -15px;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 25px solid var(--blood-orange);
  z-index: 10;
}

.wheel {
  width: 450px;
  height: 450px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    var(--blood-orange) 0deg 60deg,
    var(--dusty-coral) 60deg 120deg,
    var(--moss-green) 120deg 180deg,
    var(--blush) 180deg 240deg,
    var(--blood-orange) 240deg 300deg,
    var(--dusty-coral) 300deg 360deg
  );
  border: 8px solid var(--plum);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.wheel-section {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
}

.section-icon {
  font-size: 2rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.wheel-center {
  width: 140px;
  height: 140px;
  background-color: var(--plum);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.go-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--blood-orange);
  color: white;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(171, 72, 45, 0.4);
}

.go-button:hover:not(:disabled) {
  background-color: var(--dusty-coral);
  transform: scale(1.1);
}

.go-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.go-button:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
