<template>
  <div class="dashboard-layout">
    <Sidebar :open="sidebarOpen" :collapsed="collapsed" @close="sidebarOpen = false" @toggle="toggleSidebar" />
    <div v-if="sidebarOpen && isMobile" class="overlay" @click="sidebarOpen = false" />

    <main class="main-content" :class="{ 'collapsed': collapsed }">
      <button class="hamburger" @click="toggleSidebar" v-if="isMobile">
        <Menu :size="24" />
      </button>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Menu } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'

const sidebarOpen = ref(false)
const collapsed = ref(false)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value <= 768)

const toggleSidebar = () => {
  if (isMobile.value) {
    sidebarOpen.value = !sidebarOpen.value
  } else {
    collapsed.value = !collapsed.value
  }
}

const onResize = () => { windowWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 32px;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 68px;
}
.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--plum);
  margin-bottom: 16px;
  padding: 4px;
  display: block;
}
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: 20px;
  }
  .overlay { display: block; }
}
</style>