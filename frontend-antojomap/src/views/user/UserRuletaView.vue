<template>
  <DashboardLayout>
    

    <div class="content-wrapper">
      <div class="controls-panel">
        <div class="intro-section">
            <button class="back-button" @click="$router.go(-1)">
            ← Volver
        </button>
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
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// He quitado el import de Navbar porque ya lo maneja el layout
import DashboardLayout from '@/components/DashboardLayout.vue' // Asegúrate de ajustar la ruta
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
  if (selectedCategories.value.length === 0) {
    return items.value
  }
  return items.value.filter(item => selectedCategories.value.includes(item.name))
})
</script>

<style scoped>
:deep(.main-content) {
  background: radial-gradient(ellipse at top right, #7a1a3e 0%, #4a122a 45%, #2d0a1a 100%);
  min-height: 100vh;
}
/* Contenedor principal con un poco de aire */
.content-wrapper {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center; /* cambia start → center */
  min-height: 80vh;   /* agrega esto */
}

/* Botón Volver con estilo minimalista */
.back-button {
  background: transparent;
  color: #6B1B3C;
  border: 1px solid #6B1B3C;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #6B1B3C;
  color: white;
}

/* Panel de controles */
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intro-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.intro-text {
  color: #666;
  margin-bottom: 1.5rem;
}

/* Caja de "Cómo funciona" */
.steps-box {
  background: rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}

.steps-title {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.steps-list {
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

/* Chips de categorías */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.chip {
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip.active {
  background: #6B1B3C;
  color: white;
  border-color: #6B1B3C;
}

/* Botones de acción */
.filter-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.action-button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #6B1B3C;
  color: white;
  cursor: pointer;
}

.action-button.clear {
  background: #eee;
  color: #333;
}

/* Ruleta */
.wheel-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  padding: 2rem;
  min-height: 400px;
  overflow: hidden; /* agrega esto */
}

/* Responsive para pantallas pequeñas */
@media (max-width: 900px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>