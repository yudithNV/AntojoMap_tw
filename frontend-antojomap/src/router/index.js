import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import BusinessPage from '../views/BusinessPage.vue'

// Admin Views
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminRequests from '../views/admin/AdminRequests.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminRestaurants from '../views/admin/AdminRestaurants.vue'
import AdminReports from '../views/admin/AdminReports.vue'

// Restaurant Views
import RestaurantDashboard from '../views/restaurant/RestaurantDashboard.vue'
import RestaurantMenu from '../views/restaurant/RestaurantMenu.vue'
import RestaurantProfile from '../views/restaurant/RestaurantProfile.vue'
import RestaurantFeedbacks from '../views/restaurant/RestaurantFeedbacks.vue'

// User Views
import UserFeed from '../views/user/UserFeed.vue'
import UserFavorites from '../views/user/UserFavorites.vue'
import UserProfile from '../views/user/UserProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/negocios',
      name: 'business',
      component: BusinessPage
    },
    // Admin Routes
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/requests',
      name: 'admin-requests',
      component: AdminRequests,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsers,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/restaurants',
      name: 'admin-restaurants',
      component: AdminRestaurants,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/reports',
      name: 'admin-reports',
      component: AdminReports,
      meta: { requiresAuth: true, role: 'admin' }
    },
    // Restaurant Routes
    {
      path: '/restaurant/dashboard',
      name: 'restaurant-dashboard',
      component: RestaurantDashboard,
      meta: { requiresAuth: true, role: 'restaurant' }
    },
    {
      path: '/restaurant/menu',
      name: 'restaurant-menu',
      component: RestaurantMenu,
      meta: { requiresAuth: true, role: 'restaurant' }
    },
    {
      path: '/restaurant/profile',
      name: 'restaurant-profile',
      component: RestaurantProfile,
      meta: { requiresAuth: true, role: 'restaurant' }
    },
    {
      path: '/restaurant/feedbacks',
      name: 'restaurant-feedbacks',
      component: RestaurantFeedbacks,
      meta: { requiresAuth: true, role: 'restaurant' }
    },
    // User Routes
    {
      path: '/user/feed',
      name: 'user-feed',
      component: UserFeed,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/user/favorites',
      name: 'user-favorites',
      component: UserFavorites,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/user/profile',
      name: 'user-profile',
      component: UserProfile,
      meta: { requiresAuth: true, role: 'user' }
    }
  ]
})

// Navigation Guard para proteger rutas
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('user_role')
  
  if (to.meta.requiresAuth) {
    if (!userRole) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router