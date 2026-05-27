<template>
  <div class="wheel-container">
    <div
      class="wheel"
      :style="{
        transform: `rotate(${rotation}deg)`,
        background: wheelGradient
      }"
    >
      <div v-for="(item, index) in itemsToUse" :key="index" class="wheel-section" :style="{ transform: `rotate(${(360 / itemsToUse.length) * index + (360 / itemsToUse.length) / 2}deg)` }">
        <div class="section-icon">
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
        <button class="result-x" @click="closeResult" aria-label="Cerrar resultado">
          ×
        </button>
        <div class="result-icon">
          <component v-if="selectedItem" :is="selectedItem.icon" :size="48" color="#A33333" />
        </div>
        <p class="result-label">Hoy toca:</p>
        <h3 class="result-title">{{ selectedItem ? selectedItem.name : 'Sorpresa' }}</h3>
        <div class="result-actions">
          <button class="result-button primary" @click="goToRestaurants">Ver restaurantes</button>
          <button class="result-button secondary" @click="spinAgain">Girar otra vez</button>
        </div>
      </div>
    </div>

    <div v-if="isSpinning" class="spinning-feedback">
      <p class="spinning-text">Girando...</p>
      <p class="spinning-subtext">Buscando tu antojo...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Pizza, Hamburger, Fish, IceCream, Salad, Utensils, Drumstick, Soup, Leaf, Shell } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { api } from '@/services/api.js'

const props = defineProps({
  filteredCategories: {
    type: Array,
    default: null
  }
})

const router = useRouter()
const rotation = ref(0)
const isSpinning = ref(false)
const selectedItem = ref(null)
const showResult = ref(false)
const items = ref([])

// 🔥 DATOS PREDETERMINADOS - aseguran que la ruleta se vea ANTES de cargar la API
const defaultItems = [
  { name: 'Pizza', icon: Pizza },
  { name: 'Hamburguesas', icon: Hamburger },
  { name: 'Sushi', icon: Fish },
  { name: 'Tacos', icon: Utensils },
  { name: 'Pollo', icon: Drumstick },
  { name: 'Postres', icon: IceCream }
]

// Mapeo nombre → icono
const iconMap = {
  'Pizza': Pizza,
  'Hamburguesas': Hamburger,
  'Sushi': Fish,
  'Tacos': Utensils,
  'Pollo': Drumstick,
  'Pasta': Soup,
  'Ensaladas': Salad,
  'Postres': IceCream,
  'Vegano': Leaf,
  'Mariscos': Shell,
}

// 🔥 CARGA DE DATOS OPTIMIZADA - no bloquea el renderizado
onMounted(async () => {
  // Primero mostramos datos por defecto (instantáneo)
  items.value = defaultItems
  
  // Luego cargamos datos reales de la API en segundo plano
  try {
    const categorias = await api.get('/restaurantes/categorias')
    if (categorias && categorias.length > 0) {
      items.value = categorias.map(c => ({
        name: c.nombre,
        icon: iconMap[c.nombre] || Utensils
      }))
    }
  } catch (e) {
    console.warn('Error cargando categorías, usando datos por defecto', e)
  }
})

// Categorías a usar en la ruleta (filtradas o todas)
const itemsToUse = computed(() => {
  if (props.filteredCategories && props.filteredCategories.length > 0) {
    return props.filteredCategories
  }
  return items.value.length ? items.value : defaultItems
})

// 🔥 GRADIENTE OPTIMIZADO - se calcula de forma reactiva pero eficiente
const wheelColors = [
  '#8A1A36', '#A33333', '#C64445', '#7B1C32', '#B63A36',
  '#8F2038', '#C84A4A', '#6F1D2E', '#AA3434', '#D04A3F'
]

const wheelGradient = computed(() => {
  const itemsLen = itemsToUse.value.length
  if (!itemsLen) {
    return 'conic-gradient(#8A1A36 0deg 360deg)'
  }

  const sectionAngle = 360 / itemsLen
  const sections = itemsToUse.value.map((item, index) => {
    const start = index * sectionAngle
    const end = (index + 1) * sectionAngle
    const color = wheelColors[index % wheelColors.length]
    return `${color} ${start}deg ${end}deg`
  })

  return `conic-gradient(from 0deg, ${sections.join(', ')})`
})

// 🔥 LÓGICA DE GIRO OPTIMIZADA
const spinWheel = () => {
  if (isSpinning.value || !itemsToUse.value.length) return

  isSpinning.value = true

  const sectionAngle = 360 / itemsToUse.value.length
  const targetIndex = Math.floor(Math.random() * itemsToUse.value.length)

  const currentRotation = ((rotation.value % 360) + 360) % 360
  const itemCenterAngle = targetIndex * sectionAngle + sectionAngle / 2
  const desiredRotation = (-itemCenterAngle + 360) % 360
  const extraTurns = 1440
  const deltaRotation = extraTurns + ((desiredRotation - currentRotation + 360) % 360)

  rotation.value += deltaRotation

  setTimeout(() => {
    isSpinning.value = false
    selectedItem.value = itemsToUse.value[targetIndex]
    showResult.value = true
  }, 1900)
}

const closeResult = () => {
  showResult.value = false
}

const goToRestaurants = () => {
  if (!selectedItem.value) return
  
  const hasToken = localStorage.getItem('token')
  const categoryName = selectedItem.value.name
  
  if (hasToken) {
    router.push({ path: '/user/feed', query: { categoria: categoryName } })
  } else {
    localStorage.setItem('pending_category', categoryName)
    router.push('/login')
  }
  closeResult()
}

const spinAgain = () => {
  closeResult()
  spinWheel()
}
</script>

<style scoped>
/* Todos tus estilos existentes se mantienen igual */
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
  padding-top: 30px;
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
  width: min(380px, 100%);
  background: rgba(255, 251, 242, 0.98);
  border: 1px solid rgba(163, 51, 51, 0.18);
  border-radius: 22px;
  padding: 36px 28px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(107, 33, 33, 0.18);
  animation: popIn 0.34s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}
.result-x {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #A33333;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-x:hover {
  background: rgba(163, 51, 51, 0.1);
}

.result-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.result-label {
  margin: 0 0 8px;
  color: #6b2121;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-title {
  margin: 0 0 28px;
  font-size: 2.2rem;
  color: #A33333;
  font-weight: 800;
  line-height: 1.2;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-button {
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  font-family: inherit;
}

.result-button.primary {
  background: #A33333;
  color: #fff;
}

.result-button.primary:hover {
  background: #C64445;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(163, 51, 51, 0.25);
}

.result-button.primary:active {
  transform: scale(0.96);
}

.result-button.secondary {
  background: rgba(163, 51, 51, 0.1);
  color: #A33333;
  border: 1px solid rgba(163, 51, 51, 0.2);
}

.result-button.secondary:hover {
  background: rgba(163, 51, 51, 0.15);
  border-color: rgba(163, 51, 51, 0.3);
}

.result-button.secondary:active {
  transform: scale(0.96);
}

.spinning-feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 55;
  text-align: center;
  animation: fadeIn 0.4s ease-out;
}

.spinning-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #A33333;
  margin: 0 0 8px 0;
  animation: pulse 1.5s ease-in-out infinite;
}

.spinning-subtext {
  font-size: 0.9rem;
  color: #6b2121;
  margin: 0;
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
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