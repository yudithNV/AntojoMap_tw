<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from './components/Navbar.vue'

const route = useRoute()

// Rutas públicas donde se muestra el Navbar
const publicRoutes = ['/', '/login', '/register', '/negocios']

// Verifica si la ruta actual es pública
const showNavbar = computed(() => {
  return publicRoutes.includes(route.path)
})
</script>

<template>
  <div class="app-container">
    <Navbar v-if="showNavbar" />
    <RouterView />
  </div>
</template>

<style>
@import './assets/main.css';

.app-container {
  min-height: 100vh;
  background-color: var(--color-white);
}
</style>