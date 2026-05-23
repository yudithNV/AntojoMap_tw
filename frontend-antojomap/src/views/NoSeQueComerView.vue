<template>
  <div class="no-se-page">
    <Navbar />

    <div class="hero-section">
      <div class="hero-badge">
        <Zap :size="18" stroke-width="2" />
        <span>¡SIN INDECISIONES!</span>
      </div>
      <h1 class="page-title">No sé <span class="highlight">qué comer</span></h1>
      <p class="page-subtitle">
        Cuando nadie se decide, deja que la Ruleta del Antojo elija por ti.
      </p>
      <p class="page-description">
        Selecciona tus antojos favoritos y descubre una opción para comer hoy.
      </p>
    </div>

    <div class="content-wrapper">
      <div class="controls-panel">
        <div class="intro-section">
          <div class="intro-icon">
            <Utensils :size="28" stroke-width="1.5" />
          </div>
          <p class="intro-title">Elige tus antojos</p>
          <p class="intro-text">
            Selecciona una o varias categorías y la ruleta decidirá entre tus favoritas.
          </p>

          <div class="steps-box">
            <div class="steps-header">
              <Sparkles :size="18" stroke-width="1.5" />
              <p class="steps-title">¿Cómo funciona?</p>
            </div>
            <div class="steps-list">
              <span class="step">🎯 1. Elige categorías</span>
              <span class="step">🎲 2. Gira la ruleta</span>
              <span class="step">✨ 3. Disfruta tu elección</span>
            </div>
          </div>
        </div>

        <div class="filters-section">
          <div class="filters-header">
            <h3 class="filters-title">Categorías</h3>
            <span class="filters-count" v-if="selectedCategories.length > 0">
              {{ selectedCategories.length }} seleccionadas
            </span>
          </div>
          <div class="filter-chips">
            <button 
              v-for="item in items" 
              :key="item.name"
              class="chip category-chip"
              :class="{ active: selectedCategories.includes(item.name) }"
              @click="toggleCategory(item.name)"
            >
              <component :is="item.icon" :size="16" />
              {{ item.name }}
            </button>
          </div>

          <div class="filter-actions" v-if="items.length > 0">
            <button 
              class="action-button"
              :class="{ disabled: selectedCategories.length === 0 }"
              @click="selectAll"
            >
              <Check :size="14" /> Todas
            </button>
            <button 
              v-if="selectedCategories.length > 0"
              class="action-button clear"
              @click="clearSelection"
            >
              <X :size="14" /> Limpiar
            </button>
          </div>
        </div>
      </div>

      <div class="wheel-panel">
        <div class="wheel-wrapper">
          <WheelSpinner :filteredCategories="filteredCategoriesForWheel" />
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">🍜</span>
          <span>AntojoMap</span>
        </div>
        <p>&copy; 2026 AntojoMap - Tu guía gastronómica local</p>
        <div class="footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
          <a href="#">Blog</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import WheelSpinner from '../components/WheelSpinner.vue'
import { 
  Pizza, Hamburger, Fish, IceCream, Salad, Utensils, 
  Drumstick, Soup, Leaf, Shell, Zap, Sparkles, Check, X 
} from 'lucide-vue-next'
import { restaurantesService } from '@/services/menu.service.js'

const items = ref([])
const selectedCategories = ref([])

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
  const categorias = await restaurantesService.getCategorias()
  items.value = categorias.map(c => ({
    name: c.nombre,
    icon: iconMap[c.nombre] || Utensils
  }))
})

// Función para agregar/quitar categoría
const toggleCategory = (categoryName) => {
  const index = selectedCategories.value.indexOf(categoryName)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categoryName)
  }
}

// Seleccionar todas las categorías
const selectAll = () => {
  selectedCategories.value = items.value.map(item => item.name)
}

// Limpiar selección
const clearSelection = () => {
  selectedCategories.value = []
}

// Categorías filtradas para la ruleta
const filteredCategoriesForWheel = computed(() => {
  if (selectedCategories.value.length === 0) {
    return items.value
  }
  return items.value.filter(item => selectedCategories.value.includes(item.name))
})
</script>

<style scoped>
/* ===== PALETA DE COLORES ===== */
/* Chocolate: #643016 */
/* Alert Tan: #974F2C */
/* Dark Tan: #9F6A4A */
/* Fallow: #CB9870 */
/* ============================ */

.no-se-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #FDF8F2 0%, #F5EDE4 100%);
  display: flex;
  flex-direction: column;
}

.hero-section {
  padding: 50px 20px 40px;
  background: linear-gradient(145deg, #CB9870 0%, rgba(151, 79, 44, 0.08) 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 150%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  pointer-events: none;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100,48,22,0.2), transparent);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(100, 48, 22, 0.12);
  backdrop-filter: blur(10px);
  color: #643016;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(100, 48, 22, 0.15);
}

.page-title {
  font-size: 3rem;
  color: #643016;
  margin: 0;
  font-weight: 800;
  letter-spacing: -1px;
}

.highlight {
  color: #974F2C;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #974F2C, #CB9870);
  border-radius: 3px;
  animation: expandWidth 0.6s ease-out 0.3s both;
}

.page-subtitle {
  margin: 18px auto 0;
  max-width: 620px;
  color: #5a2a14;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.5;
}

.page-description {
  margin: 8px auto 0;
  max-width: 620px;
  color: #9F6A4A;
  font-size: 1rem;
  line-height: 1.6;
}

.content-wrapper {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.intro-section {
  background: white;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(100, 48, 22, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.intro-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(100, 48, 22, 0.1);
}

.intro-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #643016, #974F2C);
  border-radius: 24px;
  color: white;
  margin-bottom: 20px;
}

.intro-title {
  font-size: 1.3rem;
  color: #643016;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.intro-text {
  font-size: 0.95rem;
  color: #9F6A4A;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.steps-box {
  background: linear-gradient(145deg, #FDF8F2, #F5EDE4);
  border-radius: 20px;
  padding: 20px;
}

.steps-header {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
  color: #643016;
}

.steps-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #643016;
}

.steps-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.step {
  padding: 8px 16px;
  border-radius: 40px;
  background: white;
  color: #974F2C;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.step:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 48, 22, 0.1);
}

.filters-section {
  background: white;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(100, 48, 22, 0.08);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters-title {
  font-size: 1rem;
  color: #643016;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filters-count {
  font-size: 0.75rem;
  color: #974F2C;
  background: rgba(151, 79, 44, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.chip {
  padding: 10px 18px;
  border-radius: 40px;
  border: 1.5px solid #CB9870;
  background-color: white;
  color: #643016;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.chip:hover {
  transform: translateY(-2px);
  border-color: #974F2C;
  background-color: rgba(151, 79, 44, 0.05);
}

.chip.active {
  background: linear-gradient(135deg, #643016, #974F2C);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 14px rgba(100, 48, 22, 0.25);
}

.category-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.filter-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  padding: 10px 20px;
  border-radius: 40px;
  border: none;
  background: linear-gradient(135deg, #643016, #974F2C);
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.action-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(100, 48, 22, 0.25);
}

.action-button:active:not(.disabled) {
  transform: translateY(0);
}

.action-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.clear {
  background: transparent;
  color: #643016;
  border: 1.5px solid #643016;
}

.action-button.clear:hover {
  background: rgba(100, 48, 22, 0.05);
  transform: translateY(-2px);
}

.wheel-panel {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.wheel-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.footer {
  background: linear-gradient(135deg, #643016, #4a2412);
  color: #CB9870;
  padding: 32px 20px;
  text-align: center;
  margin-top: auto;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(203,152,112,0.3), transparent);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #CB9870;
}

.footer-logo {
  font-size: 1.6rem;
}

.footer-content p {
  margin: 0 0 20px 0;
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.8;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-links a {
  color: #CB9870;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.footer-links a:hover {
  opacity: 1;
  color: #ffffff;
  transform: translateY(-2px);
}

/* ===== ANIMACIONES ===== */
@keyframes expandWidth {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 968px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 20px;
  }

  .page-title {
    font-size: 2.3rem;
  }

  .hero-section {
    padding: 40px 20px 30px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .intro-section, .filters-section {
    padding: 20px;
  }

  .filter-chips {
    gap: 10px;
  }

  .chip {
    padding: 8px 14px;
    font-size: 0.8rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 12px;
  }

  .steps-list {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.6rem;
  }

  .hero-badge {
    font-size: 0.7rem;
  }

  .filters-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .filter-actions {
    flex-direction: column;
  }

  .action-button {
    justify-content: center;
  }
}
</style>