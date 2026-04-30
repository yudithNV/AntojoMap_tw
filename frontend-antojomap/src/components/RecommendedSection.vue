<template>
  <section class="recommended-section">
    <div class="section-header">
      <h2>Recomendado para ti</h2>
      <p>Basado en tus gustos y ubicaciones populares</p>
    </div>
    
    <div class="restaurants-grid">
      <RestaurantCard v-for="restaurant in restaurants" :key="restaurant.id" :restaurant="restaurant" />
    </div>
  </section>
</template>

<script setup>
import RestaurantCard from './RestaurantCard.vue'

const restaurants = [
  {
    id: 1,
    name: 'The Burger Joint',
    category: 'Hamburguesas • Comida Rápida',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    rating: '⭐ 4.8',
    deliveryTime: '20-30 min',
    badge: 'Promoción'
  },
  {
    id: 2,
    name: 'Sakura Sushi',
    category: 'Sushi • Japonesa',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245169?w=400&h=300&fit=crop',
    rating: '⭐ 4.6',
    deliveryTime: '35-45 min',
    badge: 'Nuevo'
  },
  {
    id: 3,
    name: 'Bella Pizza',
    category: 'Pizza • Italiana',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
    rating: '⭐ 4.9',
    deliveryTime: '15-25 min',
    badge: 'Popular'
  }
]
</script>

<style scoped>
.recommended-section {
  padding: 60px 20px;
  background-color: white;
}

.section-header {
  max-width: 1200px;
  margin: 0 auto 50px;
  text-align: left;
}

.section-header h2 {
  font-size: 2.2rem;
  color: var(--plum);
  margin: 0 0 10px 0;
}

.section-header p {
  color: var(--dusty-coral);
  font-size: 1rem;
  margin: 0;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .recommended-section {
    padding: 40px 20px;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  .restaurants-grid {
    grid-template-columns: 1fr;
  }
}
</style>
