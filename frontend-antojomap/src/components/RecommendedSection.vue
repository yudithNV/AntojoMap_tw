<template>
  <section class="recommended-section">
    <div class="section-header">
      <h2>Recomendado para ti</h2>
      <p>Basado en tus gustos y ubicaciones populares</p>
    </div>
    
    <div class="restaurants-grid">
      <RestaurantCard v-for="restaurant in restaurants" :key="restaurant.id" :restaurant="restaurant" linkTo="/login" />
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
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&h=300',
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
  /* 🔥 FONDO VINO CLARO - COINCIDENTE CON LANDING PAGE 🔥 */
  background: linear-gradient(135deg, #8B2A4E 0%, #6B1B3C 100%);
}

.section-header {
  max-width: 1200px;
  margin: 0 auto 50px;
  text-align: left;
}

.section-header h2 {
  font-size: 2.2rem;
  color: #FFF8F0;
  margin: 0 0 10px 0;
}

.section-header p {
  color: #E8D5B5;
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

/* Ajustes para las tarjetas internas (RestaurantCard) */
:deep(.restaurant-card) {
  background: rgba(255, 255, 255, 0.95);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

:deep(.restaurant-card:hover) {
  transform: translateY(-5px);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
}

:deep(.restaurant-card h3) {
  color: #4a122a;
}

:deep(.restaurant-card p) {
  color: #6b4a3a;
}

:deep(.restaurant-card .badge) {
  background: #75162D;
  color: #E8D5B5;
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