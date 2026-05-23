<template>
  <section class="categories-section">
    <div class="categories-wrapper">
      <div class="section-header">
        <span class="section-badge">🍽️ Sabores locales</span>
        <h2>Categorías <span class="highlight">Populares</span></h2>
        <p class="section-subtitle">Elige tu mood. Servimos todos los antojos.</p>
      </div>
      
      <div class="categories-grid">
        <button 
          v-for="(category, index) in categories" 
          :key="category.id" 
          class="category-card"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="handleCategoryClick(category.name)"
        >
          <div class="category-icon-wrapper">
            <component :is="category.icon" :size="28" stroke-width="1.8" class="category-icon" />
          </div>
          <span class="category-name">{{ category.name }}</span>
          <div class="category-glow"></div>
        </button>
      </div>
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
  { id: 5, name: 'Veggie', icon: Leaf },
  { id: 6, name: 'Postres', icon: IceCream },
]

const handleCategoryClick = (categoryName) => {
  console.log(`Categoría seleccionada: ${categoryName}`)
  if (navigator.vibrate) {
    navigator.vibrate(50)
  }
}
</script>

<style scoped>
.categories-section {
  padding: 60px 20px;
  display: flex;
  justify-content: center;
}

.categories-wrapper {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 40px;
  background: linear-gradient(145deg, rgba(139, 42, 78, 0.9) 0%, rgba(107, 27, 60, 0.95) 100%);
  backdrop-filter: blur(4px);
  border-radius: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(232, 213, 181, 0.15);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.categories-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/seamless-repeat-pattern-background-with-hand-drawn OFICIAL.svg');
  background-repeat: repeat;
  background-size: 150px;
  opacity: 0.06;
  pointer-events: none;
}

.categories-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(232, 213, 181, 0.5), transparent);
  pointer-events: none;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.section-badge {
  display: inline-block;
  background: rgba(232, 213, 181, 0.15);
  backdrop-filter: blur(8px);
  color: #E8D5B5;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(232, 213, 181, 0.25);
}

.section-header h2 {
  font-size: 2.2rem;
  color: #FFF8F0;
  margin: 0 0 12px 0;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.highlight {
  color: #E8D5B5;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #E8D5B5, #C4A77D);
  border-radius: 3px;
  animation: expandWidth 0.6s ease-out 0.3s both;
}

.section-subtitle {
  color: #E0D0C0;
  font-size: 1rem;
  margin-top: 8px;
  font-weight: 500;
}

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.category-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 28px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 28px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  min-width: 130px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: fadeInScale 0.5s ease-out backwards;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  transition: left 0.5s ease;
  z-index: 0;
}

.category-card:hover::before {
  left: 100%;
}

.category-card .category-glow {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  opacity: 0;
  transition: opacity 0.4s ease;
  background: radial-gradient(circle at center, rgba(139, 42, 78, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.category-card:hover .category-glow {
  opacity: 1;
}

.category-card:active {
  transform: scale(0.96);
  transition: transform 0.08s linear;
}

.category-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(145deg, #FDF8F2, #F5EDE4);
  border-radius: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  position: relative;
  z-index: 1;
}

.category-icon {
  color: #75162D;
  transition: all 0.35s ease;
}

.category-name {
  font-size: 1rem;
  font-weight: 700;
  color: #4a122a;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
  background: white;
}

.category-card:hover .category-icon-wrapper {
  background: linear-gradient(135deg, #75162D, #560B18);
  transform: scale(1.05);
}

.category-card:hover .category-icon {
  color: white;
  transform: scale(1.02);
}

.category-card:hover .category-name {
  color: #75162D;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes expandWidth {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

@media (max-width: 768px) {
  .categories-section { padding: 40px 16px; }
  .categories-wrapper { padding: 32px 24px; border-radius: 32px; }
  .section-header h2 { font-size: 1.8rem; }
  .category-card { padding: 18px 20px; min-width: 100px; }
  .category-icon-wrapper { width: 55px; height: 55px; }
  .category-name { font-size: 0.85rem; }
}

@media (max-width: 480px) {
  .categories-wrapper { padding: 24px 16px; border-radius: 24px; }
  .category-card { padding: 14px 16px; min-width: 85px; }
  .category-icon-wrapper { width: 45px; height: 45px; }
  .category-name { font-size: 0.75rem; }
}
</style>