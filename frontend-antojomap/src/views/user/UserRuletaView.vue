<template>
  <DashboardLayout>
    <div class="content-wrapper">
      <!-- Panel izquierdo: controles -->
      <div class="controls-panel">
        <div class="intro-section">
          <button class="back-button" @click="$router.go(-1)">← Volver</button>
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
              <component :is="item.icon" :size="16" />
              {{ item.name }}
            </button>
          </div>

          <div class="filter-actions" v-if="items.length > 0">
            <button class="action-button" @click="selectAll">Todas</button>
            <button
              v-if="selectedCategories.length > 0"
              class="action-button clear"
              @click="clearSelection"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Panel derecho: ruleta -->
      <div class="wheel-panel">
        <div class="wheel-wrapper">
          <WheelSpinner :filteredCategories="filteredCategoriesForWheel" />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import WheelSpinner from '@/components/WheelSpinner.vue'
import { Pizza, Hamburger, Fish, IceCream, Salad, Utensils, Drumstick, Soup, Leaf, Shell } from 'lucide-vue-next'
import { restaurantesService } from '@/services/menu.service.js'

const items = ref([])
const selectedCategories = ref([])

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

const toggleCategory = (categoryName) => {
  const index = selectedCategories.value.indexOf(categoryName)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categoryName)
  }
}

const selectAll = () => {
  selectedCategories.value = items.value.map(item => item.name)
}

const clearSelection = () => {
  selectedCategories.value = []
}

const filteredCategoriesForWheel = computed(() => {
  if (selectedCategories.value.length === 0) return items.value
  return items.value.filter(item => selectedCategories.value.includes(item.name))
})
</script>

<style scoped>
/* Fondo oscuro en el main content del layout */
:deep(.main-content) {
  background: radial-gradient(ellipse at top right, #7a1a3e 0%, #4a122a 45%, #2d0a1a 100%);
  min-height: 100vh;
}

/* ===== LAYOUT PRINCIPAL ===== */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  min-height: calc(100vh - 80px);
}

/* ===== PANEL IZQUIERDO ===== */
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Botón volver */
.back-button {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.6);
}

/* ✅ FIX: textos en blanco para que se lean sobre fondo oscuro */
.intro-title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.intro-text {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Steps box */
.steps-box {
  background: rgba(255, 255, 255, 0.08);
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

.steps-title {
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.steps-list {
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.9rem;
}

/* ===== FILTROS ===== */
.filters-section {
  display: flex;
  flex-direction: column;
}

.filters-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Chips */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 7px 14px;
  border-radius: 50px;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.chip:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.chip.active {
  background: rgba(255, 255, 255, 0.95);
  color: #4a122a;
  border-color: transparent;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

/* Botones de acción */
.filter-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
}

.action-button {
  padding: 9px 20px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.action-button.clear {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.15);
}

.action-button.clear:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
}

/* ===== PANEL RULETA ===== */
.wheel-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  /* ✅ FIX: tamaño contenido para que la ruleta no se corte */
  width: 100%;
  overflow: visible;
}

.wheel-wrapper {
  width: 100%;
  max-width: 420px;
  /* Permitir que la ruleta se redimensione sola */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ===== RESPONSIVE ===== */

/* Tablet */
@media (max-width: 900px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    padding: 1.5rem 1rem;
    gap: 2rem;
    min-height: auto;
  }

  .wheel-panel {
    /* Limitar la altura del panel para que no empuje el contenido */
    max-height: 380px;
  }

  .wheel-wrapper {
    max-width: min(320px, 80vw);
  }

  .intro-title {
    font-size: 1.6rem;
  }

  .controls-panel {
    gap: 1.25rem;
  }
}

/* Móvil pequeño */
@media (max-width: 480px) {
  .content-wrapper {
    padding: 1rem 0.75rem 6rem 0.75rem;
    gap: 1.5rem;
  }

  .wheel-wrapper {
    max-width: min(280px, 85vw);
  }

  .intro-title {
    font-size: 1.4rem;
  }

  .chip {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .steps-box {
    padding: 1rem 1.25rem;
  }
}
</style>