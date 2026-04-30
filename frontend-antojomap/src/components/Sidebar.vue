<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <router-link to="/" class="logo-link">
        <div class="logo-icon">
          <UtensilsCrossed :size="24" stroke-width="3" />
        </div>
        <span class="logo-text">AntojoMap</span>
      </router-link>
    </div>

    <nav class="sidebar-nav">
      <template v-for="item in menuItems" :key="item.id">
        <router-link
          v-if="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          :title="item.label"
        >
          <component :is="item.icon" :size="20" stroke-width="2.5" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-icon">
          <User :size="20" stroke-width="2.5" />
        </div>
        <div class="user-details">
          <p class="user-role">{{ roleLabel }}</p>
          <p class="user-email">{{ userEmail }}</p>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        Salir
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Store, 
  BarChart3,
  Menu,
  Heart,
  Search,
  User,
  UtensilsCrossed
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// Simulación de datos (esto ya lo tienes en tu lógica)
const userRole = ref(localStorage.getItem('user_role') || 'restaurant') 
const userEmail = ref(localStorage.getItem('user_email') || 'rest@test.com')

const roleLabel = computed(() => {
  const labels = {
    admin: 'Administrador',
    restaurant: 'Restaurante',
    user: 'Usuario'
  }
  return labels[userRole.value] || 'Usuario'
})

const menuItems = computed(() => {
  const menus = {
    admin: [
      { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 2, label: 'Solicitudes', icon: ClipboardList, path: '/admin/requests' },
      { id: 3, label: 'Usuarios', icon: Users, path: '/admin/users' },
      { id: 4, label: 'Restaurantes', icon: Store, path: '/admin/restaurants' },
      { id: 5, label: 'Reportes', icon: BarChart3, path: '/admin/reports' }
    ],
    restaurant: [
      { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/restaurant/dashboard' },
      { id: 2, label: 'Menú', icon: Menu, path: '/restaurant/menu' },
      { id: 3, label: 'Perfil', icon: User, path: '/restaurant/profile' },
      { id: 4, label: 'Feedbacks', icon: Heart, path: '/restaurant/feedbacks' }
    ],
    user: [
      { id: 1, label: 'Explorar', icon: Search, path: '/user/feed' },
      { id: 2, label: 'Favoritos', icon: Heart, path: '/user/favorites' },
      { id: 3, label: 'Perfil', icon: User, path: '/user/profile' }
    ]
  }
  return menus[userRole.value] || menus.user
})

const isActive = (path) => route.path === path

const handleLogout = () => {
  localStorage.removeItem('user_role')
  localStorage.removeItem('user_email')
  router.push('/')
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #FDFCFB; /* Blanco Crema sólido */
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 2px solid #F0EDE7; /* Borde más visible para definir el área */
  z-index: 100;
}

.sidebar-header {
  padding: 32px 20px;
  border-bottom: 1px solid #F0EDE7;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8D161B; /* Ciruela Profundo */
  border-radius: 10px;
  color: #FDFCFB; /* Blanco Crema */
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: #8D161B; /* Texto del logo sólido */
  font-family: sans-serif; /* O la que uses para tu marca */
}

.sidebar-nav {
  flex: 1;
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #8D161B; /* Ciruela Profundo */
  opacity: 0.7;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(141, 22, 27, 0.05);
  opacity: 1;
}

.nav-item.active {
  background-color: #8D161B; /* El item activo ahora es Ciruela sólido */
  color: #FDFCFB; /* Texto en Crema */
  opacity: 1;
  box-shadow: 0 4px 12px rgba(141, 22, 27, 0.2);
}

.nav-icon {
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #F0EDE7;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EBE2CF;
  border-radius: 50%;
  color: #8D161B;
}

.user-role {
  font-size: 0.8rem;
  font-weight: 800;
  color: #C64445; /* Rojo Coral para el rol */
  margin: 0;
  text-transform: uppercase;
}

.user-email {
  font-size: 0.75rem;
  color: #8D161B;
  opacity: 0.6;
  margin: 0;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: transparent;
  color: #C64445; /* Rojo Coral */
  border: 2px solid #C64445;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #C64445;
  color: white;
}
</style>