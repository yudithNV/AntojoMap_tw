<template>
  <div class="menu-container">
    <!-- Encabezado con título y botón -->
    <header class="menu-header">
      <div class="header-text">
        <h1>Platos del Día</h1>
        <span>3 items</span>
      </div>
      <button class="add-plate-btn">
        <Plus :size="20" /> Agregar Plato
      </button>
    </header>

    <!-- Grid de tarjetas -->
    <div class="plates-grid">
      <div v-for="plate in plates" :key="plate.id" class="plate-card">
        <div class="plate-image">
          <img :src="plate.image" :alt="plate.name">
        </div>
        <div class="plate-info">
          <h3>{{ plate.name }}</h3>
          <p class="price">${{ plate.price }}</p>
          <div class="plate-actions">
            <button class="edit-btn"><Pencil :size="16" /> Editar</button>
            <button class="delete-btn"><Trash2 :size="16" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

const plates = ref([
  { id: 1, name: 'Bowl de Quinoa', price: '12.50', image: 'url_imagen_1' },
  { id: 2, name: 'Hamburguesa Clásica', price: '15.00', image: 'url_imagen_2' },
  { id: 3, name: 'Pasta Alfredo', price: '14.00', image: 'url_imagen_3' }
])
</script>
<style scoped>
.menu-container {
  padding: 40px;
  background-color: #fdfcfb;
  min-height: 100vh;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-text h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin: 0;
}

.header-text span {
  color: #888;
  font-size: 0.9rem;
}

.add-plate-btn {
  background-color: #f2a359; /* El naranja de tu imagen */
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.plates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.plate-card {
  background: white;
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.plate-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 15px;
}

.plate-info h3 {
  margin: 15px 0 5px;
  font-size: 1.1rem;
  color: #333;
}

.price {
  color: #f2a359;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.plate-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  flex: 1;
  background-color: #f1f4f9;
  border: none;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #555;
  cursor: pointer;
}

.delete-btn {
  background-color: #fff1f1;
  border: none;
  padding: 8px;
  border-radius: 8px;
  color: #ff5c5c;
  cursor: pointer;
}
</style>