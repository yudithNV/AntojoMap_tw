<template>
  <section class="categories-section">
    <div class="section-header">
      <h2>Categorías Populares</h2>
      <p>¿Qué te apetece hoy? Elige una base para tu búsqueda</p>
    </div>
    
    <div class="categories-grid">
      <button v-for="category in categories" :key="category.id" class="category-pill">
        <component :is="category.icon" :size="20" stroke-width="2" class="pill-icon" />
        <span class="pill-text">{{ category.name }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { Pizza, Ham, Fish, IceCream, Salad, Leaf } from 'lucide-vue-next'

const categories = [
  { id: 1, name: 'Tacos', icon: Ham },
  { id: 2, name: 'Burgers', icon: Ham },
  { id: 3, name: 'Sushi', icon: Fish },
  { id: 4, name: 'Pizza', icon: Pizza },
  { id: 5, name: 'Postres', icon: IceCream },
  { id: 6, name: 'Veggie', icon: Leaf },
]
</script>

<style scoped>
.categories-section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--color-white);
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 2rem;
  color: var(--color-plum);
  margin: 0 0 12px 0;
  font-weight: 700;
}

.section-header p {
  color: var(--color-gray-500);
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: 1px solid var(--color-gray-200);
  border-radius: 25px;
  background-color: var(--color-white);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-gray-700);
  font-family: var(--font-family);
}

.category-pill:hover {
  border-color: var(--color-blood-orange);
  background-color: rgba(171, 72, 45, 0.04);
  color: var(--color-blood-orange);
  box-shadow: var(--shadow-sm);
}

.category-pill:active {
  transform: scale(0.98);
}

.pill-icon {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blood-orange);
}

.pill-text {
  font-weight: 500;
}

@media (max-width: 768px) {
  .categories-section {
    padding: 40px 20px;
  }

  .section-header h2 {
    font-size: 1.6rem;
  }

  .categories-grid {
    gap: 12px;
  }

  .category-pill {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
}
</style>

