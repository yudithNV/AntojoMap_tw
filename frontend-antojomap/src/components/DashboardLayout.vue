<template>
  <div class="dashboard-layout">
    <Sidebar />
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.main-content {
  flex: 1;
  margin-left: 220px;
  padding: 32px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .main-content {
    margin-left: 0;
    padding: 20px;
  }
}
</style>

