<template>
  <aside class="sidebar" :class="{ 'sidebar-open': props.open, 'collapsed': props.collapsed }">
    <div class="sidebar-header">
      <button class="collapse-btn" @click="emit('toggle')">
        <Menu :size="20" />
      </button>
      <router-link to="/" class="logo-link" v-if="!props.collapsed">
        <div class="logo-icon">
          <UtensilsCrossed :size="24" stroke-width="3" />
        </div>
        <span class="logo-text">AntojoMap</span>
      </router-link>
      <div class="logo-icon" v-else>
        <UtensilsCrossed :size="24" stroke-width="3" />
      </div>
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
          <span class="nav-label" v-if="!props.collapsed">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-icon">
          <User :size="20" stroke-width="2.5" />
        </div>
        <div class="user-details" v-if="!props.collapsed">
          <p class="user-role">{{ userName }}</p>
          <p class="user-email">{{ userEmail }}</p>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout" :title="props.collapsed ? 'Salir' : ''">
        <span v-if="!props.collapsed">Salir</span>
        <LogOut v-else :size="20" stroke-width="2.5" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, ClipboardList, Users, Store, BarChart3,
  Menu, Heart, Search, User, UtensilsCrossed, LogOut // 👈 Agrega este aquí
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth.store.js'
import { useFavoritosStore } from '../stores/favoritos.store.js'
import { useRestaurantesStore } from '../stores/restaurantes.store.js'
const authStore = useAuthStore()
const favoritosStore = useFavoritosStore()
const restaurantesStore = useRestaurantesStore()

const router = useRouter()
const route = useRoute()
const props = defineProps({
  open: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'toggle'])

const userRole = computed(() => authStore.rol || 'user')
const userEmail = computed(() => authStore.email)
const userName = computed(() => authStore.nombre)

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
  authStore.logout()
  favoritosStore.reset()
  restaurantesStore.reset()
  router.push('/')
}
</script>
<style scoped>
.sidebar {
  width: 240px;
  background-color: #FDFCFB;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 2px solid #F0EDE7;
  z-index: 100;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 68px;
}
.sidebar.collapsed .logout-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #F0EDE7;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

/* 🍷 Logo: Le subimos un toque el brillo usando un degradado con el tono más claro */
.logo-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6b253c, #481827);
  border-radius: 10px;
  color: #FDFCFB;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--plum, #481827);
  white-space: nowrap;
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
  color: var(--plum, #481827);
  opacity: 0.7;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px;
}

.nav-item:hover { 
  background-color: rgba(107, 37, 60, 0.06); /* Hover sutil un poco más vivo */
  opacity: 1; 
}

/* 🌟 AQUÍ ESTÁ EL CAMBIO CLAVE: Item activo menos oscuro y con más luz */
.nav-item.active {
  background: linear-gradient(135deg, #7a2b45, #5c1f32); /* Un vino cereza con más vida */
  color: #FDFCFB;
  opacity: 1;
  box-shadow: 0 4px 14px rgba(122, 43, 69, 0.25);
}

.nav-icon { flex-shrink: 0; }

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #F0EDE7;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.sidebar.collapsed .sidebar-footer {
  align-items: center;
  padding: 20px 12px;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--plum, #481827);
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  align-self: flex-start;
}

.collapse-btn:hover {
  background: rgba(107, 37, 60, 0.08);
}

.user-info { display: flex; align-items: center; gap: 12px; }

.user-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EBE2CF;
  border-radius: 50%;
  color: var(--plum, #481827);
}

.user-role { 
  font-size: 0.8rem; 
  font-weight: 800; 
  color: var(--dusty-coral, #C64445); 
  margin: 0; 
  text-transform: uppercase; 
}

.user-email { 
  font-size: 0.75rem; 
  color: var(--plum, #481827); 
  opacity: 0.6; 
  margin: 0; 
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: transparent;
  color: var(--dusty-coral, #C64445);
  border: 2px solid var(--dusty-coral, #C64445);
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-btn:hover { 
  background-color: var(--dusty-coral, #C64445); 
  color: white; 
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 240px !important;
  }
  .sidebar.sidebar-open { transform: translateX(0); }
}
</style>