<template>
  <div class="no-se-page">
    <Navbar />

    <div class="hero-section">
      <h1 class="page-title">No sé qué comer</h1>
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
          <p class="intro-title">Elige tus antojos</p>
          <p class="intro-text">
            Selecciona una o varias categorías y la ruleta decidirá entre tus favoritas.
          </p>

          <div class="steps-box">
            <p class="steps-title">¿Cómo funciona?</p>
            <div class="steps-list">
              <span>1. Elige categorías</span>
              <span>2. Gira la ruleta</span>
              <span>3. Disfruta tu elección</span>
            </div>
          </div>
        </div>

        <div class="filters-section">
          <h3 class="filters-title">Categorías</h3>
          <div class="filter-chips">
            <button 
              v-for="item in items" 
              :key="item.name"
              class="chip category-chip"
              :class="{ active: selectedCategories.includes(item.name) }"
              @click="toggleCategory(item.name)"
            >
              <component :is="item.icon" :size="18" />
              {{ item.name }}
            </button>
          </div>

          <div class="filter-actions" v-if="items.length > 0">
            <button 
              class="action-button"
              :class="{ disabled: selectedCategories.length === 0 }"
              @click="selectAll"
            >
              Todas
            </button>
            <button 
              v-if="selectedCategories.length > 0"
              class="action-button clear"
              @click="clearSelection"
            >
              Limpiar selección
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
        <p>&copy; 2026 AntojoMap - Encuentra tu comida favorita</p>
        <div class="footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import WheelSpinner from '../components/WheelSpinner.vue'
import { Pizza, Hamburger, Fish, IceCream, Salad, Utensils, Drumstick, Soup, Leaf, Shell } from 'lucide-vue-next'
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
// Si hay seleccionadas, usa esas; si no, usa todas
const filteredCategoriesForWheel = computed(() => {
  if (selectedCategories.value.length === 0) {
    return items.value
  }
  return items.value.filter(item => selectedCategories.value.includes(item.name))
})
</script>

<style scoped>
.no-se-page {
  min-height: 100vh;
  background-color: #FDFDFD;
  display: flex;
  flex-direction: column;
}

.hero-section {
  padding: 50px 20px 30px;
  background: linear-gradient(135deg, #FDFDFD 0%, rgba(255, 107, 0, 0.05) 100%);
  text-align: center;
  border-bottom: 1px solid rgba(255, 107, 0, 0.1);
}

.page-title {
  font-size: 2.8rem;
  color: #212121;
  margin: 0;
  font-weight: 700;
  font-family: var(--font-family-display);
}
.page-subtitle {
  margin: 18px auto 0;
  max-width: 620px;
  color: #481827;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.5;
}
.page-description {
  margin: 8px auto 0;
  max-width: 620px;
  color: #666;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.intro-title {
  font-size: 1.3rem;
  color: #212121;
  margin: 0;
  font-weight: 600;
  line-height: 1.5;
}

.intro-text {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.steps-box {
  margin-top: 12px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255, 107, 0, 0.06);
  border: 1px solid rgba(255, 107, 0, 0.14);
}

.steps-title {
  margin: 0 0 14px;
  color: #212121;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
}

.steps-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.steps-list span {
  padding: 8px 12px;
  border-radius: 999px;
  background: white;
  color: #A33333;
  font-size: 0.86rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(163, 51, 51, 0.08);
}

.filters-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filters-title {
  font-size: 0.95rem;
  color: #212121;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip {
  padding: 10px 18px;
  border-radius: 20px;
  border: 1.5px solid #FF6B00;
  background-color: transparent;
  color: #FF6B00;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.chip:hover {
  background-color: rgba(255, 107, 0, 0.08);
}

.chip.active {
  background-color: #FF6B00;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

.category-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.action-button {
  padding: 10px 16px;
  border-radius: 20px;
  border: 1px solid #A33333;
  background-color: #A33333;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-button:hover {
  background-color: #C64445;
  border-color: #C64445;
  box-shadow: 0 4px 12px rgba(163, 51, 51, 0.3);
}

.action-button:active {
  transform: scale(0.96);
}

.action-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.disabled:hover {
  background-color: #A33333;
  border-color: #A33333;
  box-shadow: none;
}

.action-button.clear {
  background-color: transparent;
  color: #A33333;
  border: 1.5px solid #A33333;
}

.action-button.clear:hover {
  background-color: rgba(163, 51, 51, 0.1);
}

.legend-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.legend-title {
  font-size: 0.95rem;
  color: #212121;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #F5F5F5;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.legend-item:hover {
  background-color: rgba(255, 107, 0, 0.08);
  transform: translateX(4px);
}

.legend-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.legend-name {
  font-size: 0.9rem;
  color: #212121;
  font-weight: 500;
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
  background-color: #212121;
  color: #FDFDFD;
  padding: 32px 20px;
  text-align: center;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content p {
  margin: 0 0 16px 0;
  font-size: 0.95rem;
  font-weight: 400;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.footer-links a {
  color: #FDFDFD;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #FF6B00;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .legend-grid {
    grid-template-columns: 1fr;
  }

  .footer-links {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
