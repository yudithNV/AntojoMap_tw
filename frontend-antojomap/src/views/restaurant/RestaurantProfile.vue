<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Perfil del Restaurante</h1>
      <p class="subtitle">Actualiza la información de tu restaurante</p>
    </div>

    <div class="content-placeholder">
      <User :size="48" stroke-width="1.5" />
      <p>Formulario de perfil en construcción</p>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../components/DashboardLayout.vue'
import { User } from 'lucide-vue-next'
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
