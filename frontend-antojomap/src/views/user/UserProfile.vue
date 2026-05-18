<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Mi perfil</h1>
      <p class="subtitle">Tu información personal en AntojoMap</p>
    </div>

    <div class="profile-wrapper">
      <!-- Avatar + nombre -->
      <div class="profile-left">
        <div class="avatar">
          <User :size="48" stroke-width="1.5" />
        </div>
        <h2 class="profile-name">{{ userName }}</h2>
        <p class="profile-email">{{ userEmail }}</p>
        
      </div>

      <!-- Info -->
      <div class="profile-right">
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Nombre</span>
            <span class="info-value">{{ userName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ userEmail }}</span>
          </div>
          
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { User } from 'lucide-vue-next'

const router = useRouter()

const userName = ref(localStorage.getItem('user_name') || 'Usuario')
const userEmail = ref(localStorage.getItem('user_email') || '')

const logout = () => {
  ['token', 'user_id', 'user_email', 'user_name', 'user_role', 'restaurante_id'].forEach(k => localStorage.removeItem(k))
  router.push('/')
}
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--dusty-coral);
  font-size: 0.95rem;
  margin: 0;
}

.profile-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

.profile-left {
  background: white;
  border-radius: 15px;
  padding: 32px 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blush), var(--dusty-coral));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profile-name {
  font-size: 1.2rem;
  color: var(--plum);
  margin: 0;
  font-weight: 700;
}

.profile-email {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.btn-logout {
  margin-top: 8px;
  width: 100%;
  padding: 10px;
  border: 2px solid #c0392b;
  background: transparent;
  color: #c0392b;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #c0392b;
  color: white;
}

.profile-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  color: var(--plum);
  font-size: 0.95rem;
}

.role-badge {
  background: rgba(255,107,0,0.1);
  color: var(--blood-orange);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.82rem;
}

@media (max-width: 768px) {
  .profile-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>