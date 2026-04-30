<template>
  <div class="restaurant-card">
    <div class="card-image-container">
      <img :src="restaurant.image" :alt="restaurant.name" class="card-image">
      <div class="card-badge">{{ restaurant.badge }}</div>
      <div class="card-rating">{{ restaurant.rating }}</div>
    </div>
    
    <div class="card-content">
      <h3 class="restaurant-name">{{ restaurant.name }}</h3>
      <p class="restaurant-category">{{ restaurant.category }}</p>
      
      <div class="card-footer">
        <div class="delivery-info">
          <span class="delivery-time">⏱️ {{ restaurant.deliveryTime }}</span>
          <button class="btn-menu">Ver Menú</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: {
    type: Object,
    required: true,
    validator: (obj) => {
      return obj.name && obj.image && obj.category && obj.rating && obj.deliveryTime
    }
  }
})
</script>

<style scoped>
.restaurant-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--blush) 0%, var(--dusty-coral) 100%);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.restaurant-card:hover .card-image {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--blood-orange);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.card-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--blood-orange);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: bold;
}

.card-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.restaurant-name {
  font-size: 1.1rem;
  color: var(--plum);
  margin: 0 0 5px 0;
  font-weight: 700;
}

.restaurant-category {
  font-size: 0.85rem;
  color: var(--dusty-coral);
  margin: 0 0 15px 0;
  font-weight: 500;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.delivery-time {
  font-size: 0.85rem;
  color: var(--dusty-coral);
  font-weight: 600;
}

.btn-menu {
  background-color: var(--blood-orange);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-start;
}

.btn-menu:hover {
  background-color: var(--dusty-coral);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .card-image-container {
    height: 150px;
  }
  
  .restaurant-name {
    font-size: 1rem;
  }
}
</style>
