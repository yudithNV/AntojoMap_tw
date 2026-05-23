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
<<<<<<< Updated upstream
        <p class="result-label">¡La ruleta se detuvo en:</p>
=======
        <button class="result-x" @click="closeResult" aria-label="Cerrar resultado">
          ×
        </button>
        <div class="result-icon">
          <component v-if="selectedItem" :is="selectedItem.icon" :size="48" color="#3F1D0E" />
        </div>
        <p class="result-label">Hoy toca:</p>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
// Reemplazamos los strings de emojis por los componentes importados
const items = [
  { name: 'Tacos', icon: Utensils },
  { name: 'Burgers', icon: Ham },
  { name: 'Sushi', icon: Fish },
  { name: 'Pizza', icon: Pizza },
  { name: 'Postres', icon: IceCream },
  { name: 'Veggie', icon: Salad },
]

=======
// Categorías por defecto (fallback si la API falla)
const defaultCategories = [
  { name: 'Pizza', icon: Pizza },
  { name: 'Hamburguesas', icon: Hamburger },
  { name: 'Sushi', icon: Fish },
  { name: 'Tacos', icon: Utensils },
  { name: 'Postres', icon: IceCream },
  { name: 'Ensaladas', icon: Salad }
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

onMounted(async () => {
  try {
    const categorias = await api.get('/restaurantes/categorias')
    if (categorias && categorias.length > 0) {
      items.value = categorias.map(c => ({
        name: c.nombre,
        icon: iconMap[c.nombre] || Utensils
      }))
    } else {
      items.value = defaultCategories
    }
  } catch (error) {
    console.error('Error cargando categorías para la ruleta:', error)
    items.value = defaultCategories
  }
})

// Categorías a usar en la ruleta (filtradas o todas)
const itemsToUse = computed(() => {
  if (props.filteredCategories && props.filteredCategories.length > 0) {
    return props.filteredCategories
  }
  if (items.value.length > 0) {
    return items.value
  }
  return defaultCategories
})

// ===== COLORES DE LA RULETA =====
// Caramel: #A2663C
// Cream: #E4CDB0
// ================================
const wheelColors = [
  '#A2663C',  // Caramel
  '#E4CDB0',  // Cream
  '#A2663C',  // Caramel
  '#E4CDB0',  // Cream
  '#A2663C',  // Caramel
  '#E4CDB0',  // Cream
  '#A2663C',  // Caramel
  '#E4CDB0'   // Cream
]

// Gradiente de la ruleta
const wheelGradient = computed(() => {
  const itemsLen = itemsToUse.value.length
  if (itemsLen === 0) {
    return 'conic-gradient(from 0deg, #A2663C 0deg 360deg)'
  }

  const sectionAngle = 360 / itemsLen
  let gradientStops = []
  
  for (let i = 0; i < itemsLen; i++) {
    const start = i * sectionAngle
    const end = (i + 1) * sectionAngle
    const color = wheelColors[i % wheelColors.length]
    gradientStops.push(`${color} ${start}deg ${end}deg`)
  }
  
  return `conic-gradient(from 0deg, ${gradientStops.join(', ')})`
})

// Lógica para girar la ruleta
>>>>>>> Stashed changes
const spinWheel = () => {
  if (isSpinning.value) return
  isSpinning.value = true
<<<<<<< Updated upstream
  const sectionAngle = 360 / items.length
  const targetIndex = Math.floor(Math.random() * items.length)
  const randomTurns = 1440
  const targetRotation = randomTurns + targetIndex * sectionAngle
  rotation.value += targetRotation
=======

  const sectionAngle = 360 / itemsToUse.value.length
  const targetIndex = Math.floor(Math.random() * itemsToUse.value.length)

  const currentRotation = ((rotation.value % 360) + 360) % 360
  
  // Centro del segmento ganador
  const itemCenterAngle = targetIndex * sectionAngle + sectionAngle / 2
  
  // Alinear el segmento ganador con la flecha superior
  const desiredRotation = (-itemCenterAngle + 360) % 360

  const extraTurns = 1440
  const deltaRotation = extraTurns + ((desiredRotation - currentRotation + 360) % 360)

  rotation.value += deltaRotation
>>>>>>> Stashed changes

  setTimeout(() => {
    isSpinning.value = false
    selectedItem.value = items[targetIndex]
    showResult.value = true
  }, 1600)
}

const closeResult = () => {
  showResult.value = false
}
<<<<<<< Updated upstream
=======

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

// Si no hay items después del montaje, forzar defaults
onMounted(() => {
  if (items.value.length === 0) {
    items.value = defaultCategories
  }
})
>>>>>>> Stashed changes
</script>

<style scoped>
/* ===== PALETA DE COLORES ===== */
/* Caramel: #A2663C - Color A de segmentos y CENTRO de la ruleta */
/* Cream: #E4CDB0 - Color B de segmentos y hover del GO */
/* Coffee: #3F1D0E - Flecha/pointer, borde de ruleta y texto principal */
/* Milk: #E6E2D7 - Fondos secundarios */
/* ============================= */

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
  border-top: 30px solid #3F1D0E;  /* Coffee */
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
  background-color: #3F1D0E;  /* Coffee */
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.22);
}

.wheel {
  width: 430px;
  height: 430px;
  border-radius: 50%;
<<<<<<< Updated upstream
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
=======
  border: 6px solid #A2663C;  /* Caramel */
>>>>>>> Stashed changes
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 0 22px 40px -12px rgba(0, 0, 0, 0.28), inset 0 2px 6px rgba(255, 255, 255, 0.18);
}

.wheel:hover {
  box-shadow: 0 28px 45px -16px rgba(63, 29, 14, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.2);
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
  background-color: #A2663C;  /* Caramel - CENTRO DE LA RULETA */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2), inset 0 2px 6px rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(63, 29, 14, 0.16);
}

.go-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #3F1D0E;  /* Coffee */
  color: #E6E2D7;  /* Milk */
  border: none;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
  font-family: inherit;
  text-transform: uppercase;
}

.go-button.spinning,
.go-button.spinning {
  animation: buttonPulse 0.85s ease-in-out infinite;
  background-color: #E4CDB0;  /* Cream */
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 18px 42px rgba(0, 0, 0, 0.35);
  color: #3F1D0E;
}

.go-button:hover:not(:disabled) {
  transform: scale(1.07);
  background-color: #E4CDB0;  /* Cream */
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 14px 34px rgba(0, 0, 0, 0.35);
  color: #3F1D0E;
}

.go-button:active:not(:disabled) {
  transform: scale(0.96);
  transition: transform 0.08s linear;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.go-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: scale(0.98);
  background-color: #E4CDB0;  /* Cream */
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  color: #3F1D0E;
}

@keyframes buttonPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 18px 42px rgba(0, 0, 0, 0.35);
  }
  50% {
    transform: scale(1.08);
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12), 0 22px 52px rgba(0, 0, 0, 0.45);
  }
}

.result-modal {
  position: fixed;
  inset: 0;
  background: rgba(63, 29, 14, 0.46);  /* Coffee transparente */
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.result-card {
<<<<<<< Updated upstream
  width: min(360px, 100%);
  background: rgba(255, 251, 242, 0.98);
  border: 1px solid rgba(163, 51, 51, 0.18);
=======
  width: min(380px, 100%);
  background: rgba(230, 226, 215, 0.98);  /* Milk */
  border: 1px solid rgba(63, 29, 14, 0.18);
>>>>>>> Stashed changes
  border-radius: 22px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(63, 29, 14, 0.18);
  animation: popIn 0.34s cubic-bezier(0.25, 0.8, 0.25, 1);
<<<<<<< Updated upstream
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
=======
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
  color: #3F1D0E;  /* Coffee */
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-x:hover {
  background: rgba(63, 29, 14, 0.1);
}

.result-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.result-label {
  margin: 0 0 8px;
  color: #A2663C;  /* Caramel */
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-title {
  margin: 0 0 28px;
  font-size: 2.2rem;
  color: #3F1D0E;  /* Coffee */
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
.result-close:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
=======
.result-button.primary {
  background: #3F1D0E;  /* Coffee */
  color: #E6E2D7;  /* Milk */
}

.result-button.primary:hover {
  background: #A2663C;  /* Caramel */
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(63, 29, 14, 0.25);
}

.result-button.primary:active {
  transform: scale(0.96);
}

.result-button.secondary {
  background: rgba(63, 29, 14, 0.1);
  color: #3F1D0E;  /* Coffee */
  border: 1px solid rgba(63, 29, 14, 0.2);
}

.result-button.secondary:hover {
  background: rgba(63, 29, 14, 0.15);
  border-color: rgba(63, 29, 14, 0.3);
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
  color: #3F1D0E;  /* Coffee */
  margin: 0 0 8px 0;
  animation: pulse 1.5s ease-in-out infinite;
}

.spinning-subtext {
  font-size: 0.9rem;
  color: #A2663C;  /* Caramel */
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
>>>>>>> Stashed changes
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
    border-top: 20px solid #3F1D0E;  /* Coffee */
  }

  .pointer::after {
    top: -26px;
    left: -5px;
    width: 10px;
    height: 10px;
  }
}
</style>