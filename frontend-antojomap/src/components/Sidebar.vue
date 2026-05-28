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
      <!-- 🔥 BOTÓN SALIR MODIFICADO - ABRE MODAL 🔥 -->
      <button class="logout-btn" @click="openLogoutModal" :title="props.collapsed ? 'Salir' : ''">
        <span v-if="!props.collapsed">Salir</span>
        <LogOut v-else :size="20" stroke-width="2.5" />
      </button>
    </div>

    <!-- 🔥 MODAL DE CONFIRMACIÓN DE SALIDA 🔥 -->
    <Transition name="modal-fade-scale">
      <div v-if="showLogoutModal" class="modal-overlay" @click.self="closeLogoutModal">
        <div class="modal-container">
          <div class="modal-content">
            <div class="modal-icon-wrapper">
              <div class="modal-icon-circle">
                <LogOut :size="32" stroke-width="1.5" class="modal-icon" />
              </div>
            </div>
            <h3 class="modal-title">¿De verdad quieres salir?</h3>
            <p class="modal-message">
              Tendrás que volver a ingresar tus credenciales para ver los menús.
            </p>
            <div class="modal-actions">
              <button class="modal-btn modal-btn-cancel" @click="closeLogoutModal">
                Cancelar
              </button>
              <button class="modal-btn modal-btn-confirm" @click="confirmLogout" :disabled="isLoggingOut">
                {{ isLoggingOut ? 'Saliendo...' : 'Sí, salir' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, ClipboardList, Users, Store, BarChart3,
  Menu, Heart, Search, User, UtensilsCrossed, LogOut
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

// ========== ESTADO DEL MODAL ==========
const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

// ========== USUARIO ==========
const userRole = computed(() => authStore.rol || 'user')
const userEmail = computed(() => authStore.email)
const userName = computed(() => authStore.nombre)

// ========== MENÚ ==========
const menuItems = computed(() => {
  const menus = {
    admin: [
      { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 2, label: 'Solicitudes', icon: ClipboardList, path: '/admin/requests' },
      { id: 3, label: 'Usuarios', icon: Users, path: '/admin/users' },
      { id: 4, label: 'Restaurantes', icon: Store, path: '/admin/restaurants' },
      //{ id: 5, label: 'Reportes', icon: BarChart3, path: '/admin/reports' }
    ],
    restaurant: [
      { id: 1, label: 'Resumen', icon: LayoutDashboard, path: '/restaurant/dashboard' },
      { id: 2, label: 'Menú', icon: Menu, path: '/restaurant/menu' },
      { id: 3, label: 'Perfil', icon: User, path: '/restaurant/profile' },
      { id: 4, label: 'Feedbacks', icon: Heart, path: '/restaurant/feedbacks' }
    ],
    user: [
      { id: 1, label: 'Explorar', icon: Search, path: '/user/feed' },
      { id: 2, label: 'Mapa', icon: Store, path: '/user/mapa' },
      { id: 3, label: 'Favoritos', icon: Heart, path: '/user/favorites' },
      { id: 4, label: 'Perfil', icon: User, path: '/user/profile' }
    ]
  }
  return menus[userRole.value] || menus.user
})

const isActive = (path) => route.path === path

// ========== 🔥 FUNCIONES DEL MODAL 🔥 ==========
const openLogoutModal = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const confirmLogout = async () => {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    favoritosStore.reset()
    restaurantesStore.reset()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  } finally {
    isLoggingOut.value = false
    showLogoutModal.value = false
  }
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
  background-color: rgba(107, 37, 60, 0.06);
  opacity: 1; 
}

.nav-item.active {
  background: linear-gradient(135deg, #7a2b45, #5c1f32);
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

/* ===== 🔥 MODAL DE CONFIRMACIÓN 🔥 ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999 !important;
}

.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #fffbf5 0%, #fff5ea 100%);
  border-radius: 28px;
  padding: 36px 32px;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(163, 51, 51, 0.15);
}

.modal-icon-wrapper {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.modal-icon-circle {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #A33333, #6B2121);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 0.4s ease-out;
}

.modal-icon {
  color: white;
}

.modal-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #4a1f1f;
  margin-bottom: 12px;
  font-family: 'Poppins', sans-serif;
}

.modal-message {
  font-size: 0.95rem;
  color: #6b2121;
  margin-bottom: 28px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.modal-btn {
  padding: 12px 28px;
  border-radius: 40px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.modal-btn-cancel {
  background: transparent;
  border: 2px solid #ddd;
  color: #666;
}

.modal-btn-cancel:hover {
  background: #f5f5f5;
  border-color: #999;
}

.modal-btn-confirm {
  background: linear-gradient(135deg, #A33333, #6B2121);
  color: white;
  box-shadow: 0 4px 12px rgba(163, 51, 51, 0.3);
}

.modal-btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(163, 51, 51, 0.4);
}

.modal-btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-fade-scale-enter-active,
.modal-fade-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-scale-enter-from,
.modal-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-fade-scale-enter-to,
.modal-fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 240px !important;
  }
  .sidebar.sidebar-open { transform: translateX(0); }
  
  .modal-content {
    padding: 28px 24px;
    margin: 16px;
  }
  
  .modal-title {
    font-size: 1.3rem;
  }
  
  .modal-btn {
    padding: 10px 20px;
  }
}
</style>