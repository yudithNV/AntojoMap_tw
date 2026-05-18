<template>
  <div>
    <BlockedRestaurantModal ref="blockedModal" />
    
    <DashboardLayout>
      <div class="dashboard-header">
        <h1>Dashboard del Restaurante</h1>
        <p class="subtitle">Bienvenido a tu panel de control</p>
      </div>

      <div class="dashboard-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <Package :size="32" stroke-width="2" />
          </div>
          <div class="stat-content">
            <h3>Órdenes Hoy</h3>
            <p class="stat-number">24</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Star :size="32" stroke-width="2" />
          </div>
          <div class="stat-content">
            <h3>Calificación Promedio</h3>
            <p class="stat-number">4.8</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <DollarSign :size="32" stroke-width="2" />
          </div>
          <div class="stat-content">
            <h3>Ingresos Hoy</h3>
            <p class="stat-number">$1,250</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Users :size="32" stroke-width="2" />
          </div>
          <div class="stat-content">
            <h3>Clientes Nuevos</h3>
            <p class="stat-number">8</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import BlockedRestaurantModal from '../../components/BlockedRestaurantModal.vue'
import { Package, Star, DollarSign, Users } from 'lucide-vue-next'

const blockedModal = ref(null)

onMounted(() => {
  if (blockedModal.value) {
    blockedModal.value.checkStatus()
  }
})
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h1 {
  color: var(--plum);
  font-size: 2.2rem;
  margin: 0 0 10px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 1rem;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(171, 72, 45, 0.1);
  border-radius: 12px;
  color: var(--color-blood-orange);
}

.stat-content h3 {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.stat-number {
  color: var(--plum);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}
</style>
