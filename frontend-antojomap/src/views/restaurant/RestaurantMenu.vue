<template>
  <DashboardLayout>
    <div class="menu-container">
      <!-- Encabezado -->
      <header class="menu-header">
        <div class="header-text">
          <h1>Platos del Día</h1>
          <span class="items-count">{{ plates.length }} items</span>
        </div>
        <button class="add-plate-btn" @click="router.push({ name: 'restaurant-menu-add' })">
          <Plus :size="20" stroke-width="3" /> Agregar Plato
        </button>
      </header>

      <!-- Grid de Platos -->
      <div class="plates-grid">
        <div v-for="plate in plates" :key="plate.id" class="plate-card">
          <div class="plate-image">
            <img :src="plate.image" :alt="plate.name">
          </div>
          <div class="plate-info">
            <h3>{{ plate.name }}</h3>
            <p class="price">${{ plate.price }}</p>
            <div class="plate-actions">
              <button class="edit-btn" @click="editPlate(plate.id)">
                <Pencil :size="16" /> Editar
              </button>
              <button class="delete-btn">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import restaurantMenuStore from '../../stores/restaurantMenuStore.js'

const router = useRouter()
const plates = restaurantMenuStore.plates

const editPlate = (id) => {
  router.push({ name: 'restaurant-menu-edit', params: { id } })
}
</script>

<style scoped>
.menu-container {
  padding: 20px;
  max-width: 1200px;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header-text h1 {
  color: var(--plum); /* Usando tus variables */
  font-size: 2.2rem;
  margin: 0;
  font-weight: 800;
}

.items-count {
  color: #888;
  font-size: 1rem;
}

.add-plate-btn {
  background-color: #f2a359; /* Naranja del diseño original */
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(242, 163, 89, 0.3);
  transition: all 0.3s ease;
}

.add-plate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 163, 89, 0.4);
}

.plates-grid {
  display: grid;
  /* Definimos un tamaño fijo máximo de 300px para que no se vean gigantes */
  grid-template-columns: repeat(auto-fill, minmax(280px, 300px)); 
  gap: 24px;
  justify-content: start; /* Alinea las tarjetas a la izquierda[cite: 1] */
}

.plate-card {
  background: white;
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #F0EDE7;
}

.plate-card:hover {
  transform: translateY(-5px);
}

.plate-image img {
  width: 100%;
  height: 160px; /* Altura un poco más pequeña y controlada[cite: 1] */
  object-fit: cover;
  border-radius: 14px;
}

.plate-info h3 {
  margin: 12px 0 4px;
  font-size: 1.1rem;
  color: var(--plum); /* Tu color ciruela[cite: 1] */
}

.price {
  color: #f2a359;
  font-weight: 700;
  margin-bottom: 12px;
}

.plate-actions {
  display: flex;
  gap: 12px;
}

.edit-btn {
  flex: 1;
  background-color: #f1f4f9;
  border: none;
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #555;
  font-weight: 600;
  cursor: pointer;
}

.delete-btn {
  background-color: #fff1f1;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  color: #ff5c5c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #ff5c5c;
  color: white;
}
</style>