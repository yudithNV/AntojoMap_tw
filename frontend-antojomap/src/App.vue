<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink> | 
      <RouterLink to="/about">Acerca de</RouterLink>
    </nav>
  </header>

  <main>
    <h1>Bienvenido a AntojoMap 🍕</h1>
    <p>¡Aquí empezaremos a buscar comida!</p>
    
    <RouterView />
  </main>
</template>

<style scoped>
h1 {
  color: #42b883;
}
nav {
  padding: 20px 0;
}
</style>