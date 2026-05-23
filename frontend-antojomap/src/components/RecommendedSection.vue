<template>
  <section class="recommended-section">
    <div class="section-header">
      <h2>Recomendado para ti</h2>
      <p>Basado en tus gustos y ubicaciones populares</p>
    </div>
    
    <div class="restaurants-grid">
      <RestaurantCard v-for="(restaurant, index) in restaurants" :key="restaurant.id" :restaurant="restaurant" linkTo="/login" :style="{ animationDelay: `${index * 0.1}s` }" />
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
    rating: '4.8',
    deliveryTime: '20-30 min',
    badge: 'Promoción'
  },
  {
    id: 2,
    name: 'Sakura Sushi',
    category: 'Sushi • Japonesa',
<<<<<<< Updated upstream
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245169?w=400&h=300&fit=crop',
    rating: '⭐ 4.6',
=======
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&h=300',
    rating: '4.6',
>>>>>>> Stashed changes
    deliveryTime: '35-45 min',
    badge: 'Nuevo'
  },
  {
    id: 3,
    name: 'Bella Pizza',
    category: 'Pizza • Italiana',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
    rating: '4.9',
    deliveryTime: '15-25 min',
    badge: 'Popular'
  }
]
</script>

<style scoped>
/* ===== PALETA DE COLORES ===== */
/* Chocolate: #643016 */
/* Alert Tan: #974F2C */
/* Dark Tan: #9F6A4A */
/* Fallow: #CB9870 */
/* ============================ */

.recommended-section {
  padding: 60px 20px;
  background: linear-gradient(145deg, #FFF9F2 0%, #FDF5EA 100%);
  border-radius: 40px;
  margin: 20px 0;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

.section-header {
  max-width: 1200px;
  margin: 0 auto 50px;
  text-align: left;
  position: relative;
  padding-left: 20px;
  border-left: 4px solid #974F2C;
}

.section-header h2 {
  font-size: 2.2rem;
  color: #643016;
  margin: 0 0 10px 0;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-header p {
  color: #9F6A4A;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 35px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .recommended-section {
    padding: 40px 20px;
    border-radius: 30px;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  .restaurants-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .section-header {
    padding-left: 15px;
  }
}
</style>