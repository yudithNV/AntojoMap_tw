<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Explorar</h1>
      <p class="subtitle">Descubre nuevos restaurantes y platos deliciosos</p>
    </div>

    <div class="restaurants-grid">
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        linkTo="/user/menu"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../components/DashboardLayout.vue'
import RestaurantCard from '../../components/RestaurantCard.vue'

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
.restaurants-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 10px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0;
}

.content-placeholder {
  background: white;
  padding: 60px 20px;
  border-radius: 15px;
  text-align: center;
  color: var(--dusty-coral);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.content-placeholder p {
  font-size: 1.1rem;
  margin: 0;
  color: var(--dusty-coral);
}

.content-placeholder svg {
  color: var(--color-blood-orange);
}
</style>
