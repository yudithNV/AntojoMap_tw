<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Perfil del Restaurante</h1>
      <p class="subtitle">Información de acceso y datos del restaurante</p>
    </div>

    <div class="profile-card">
      <div class="profile-row">
        <span class="label">Email</span>
        <span class="value">{{ userEmail }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Nombre</span>
        <span class="value">{{ restaurantName }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Empresa</span>
        <span class="value">{{ restaurantCompany }}</span>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../components/DashboardLayout.vue'
import { ref } from 'vue'

const userEmail = ref(localStorage.getItem('user_email') || 'rest@test.com')
const restaurantName = ref(localStorage.getItem('restaurant_name') || 'La Casa del Antojo')
const restaurantCompany = ref(localStorage.getItem('restaurant_company') || 'AntojoMap Bistro')
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 10px 0;
}

.profile-card {
  background: white;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.profile-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #f1ece7;
}

.profile-row:last-child {
  border-bottom: none;
}

.label {
  color: #7d6a6a;
  font-weight: 700;
}

.value {
  color: var(--plum);
  font-weight: 600;
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
