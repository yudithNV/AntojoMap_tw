import { createRouter, createWebHistory } from 'vue-router'
// Por ahora, solo una ruta básica
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue') // Apunta a tu App por ahora para que no falle
    }
  ]
})

export default router