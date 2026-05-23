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
import { useRouter } from 'vue-router'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
    validator: (obj) => {
      return obj.name && obj.image && obj.category && obj.rating && obj.deliveryTime
    }
  },
  linkTo: {
    type: String,
    default: '/login'
  }
})

const router = useRouter()
const goToMenu = () => router.push(props.linkTo)
</script>

<style scoped>
.restaurant-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
<<<<<<< Updated upstream
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
=======
  box-shadow: 0 4px 15px rgba(0,0,0,0.10);
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
>>>>>>> Stashed changes
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
<<<<<<< Updated upstream
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
=======
  height: 100%;
  animation: fadeInScale 0.5s ease-out backwards;
  position: relative;
}

.restaurant-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(255, 107, 0, 0), rgba(255, 107, 0, 0.05));
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.restaurant-card:hover::after {
  opacity: 1;
}

.restaurant-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
>>>>>>> Stashed changes
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
  transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.restaurant-card:hover .card-image {
  transform: scale(1.08);
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
<<<<<<< Updated upstream
  background-color: var(--blood-orange);
=======
  background: linear-gradient(135deg, #FF6B00, #E05F00);
>>>>>>> Stashed changes
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
<<<<<<< Updated upstream
  font-weight: bold;
=======
  font-weight: 700;
  animation: pulse 2s infinite;
>>>>>>> Stashed changes
}

.card-rating {
  position: absolute;
<<<<<<< Updated upstream
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--blood-orange);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: bold;
}

=======
  top: 8px;
  right: 8px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ccc;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.btn-heart:hover { 
  transform: scale(1.2); 
  color: #e05f00; 
}

.btn-heart.active { 
  color: #e05f00;
  animation: heartBeat 0.4s ease;
}

>>>>>>> Stashed changes
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
  transition: color 0.3s ease;
}

.restaurant-card:hover .restaurant-name {
  color: #FF6B00;
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
<<<<<<< Updated upstream
}

.btn-menu {
  background-color: var(--blood-orange);
=======
  color: var(--plum);
  background: #FFF3E6;
  padding: 4px 8px;
  border-radius: 20px;
}

.btn-menu {
  background: linear-gradient(135deg, #FF6B00, #E05F00);
>>>>>>> Stashed changes
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
<<<<<<< Updated upstream
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
=======
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  min-height: 40px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.btn-menu:hover::before {
  left: 100%;
}

.btn-menu:hover {
  transform: scale(1.05);
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.4);
}

/* ===== ANIMACIONES ===== */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .card-image-container { height: 170px; }
  .btn-menu { padding: 10px 12px; font-size: 0.88rem; }
>>>>>>> Stashed changes
}
</style>
