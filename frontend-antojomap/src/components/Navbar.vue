<template>
  <header ref="navbar" class="navbar">
    <div class="navbar__container">
      <!-- Logo con distorsión elegante al hover -->
      <router-link to="/" class="brand" @mouseenter="animateBrandIn" @mouseleave="animateBrandOut">
        <div class="brand__icon">
          <UtensilsCrossed :size="28" stroke-width="1.5" />
          <div class="brand__icon-glow"></div>
        </div>
        <span class="brand__text">Antojo<span class="brand__text-accent">Map</span></span>
      </router-link>

      <!-- Enlaces con stagger animation (aparecen uno tras otro) -->
      <div class="nav__links">
        <router-link 
          v-for="(link, index) in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav__link"
          :class="{ 'nav__link--active': isActive(link.path) }"
          :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
          @mouseenter="e => animateUnderline(e, true)"
          @mouseleave="e => animateUnderline(e, false)"
        >
          <span class="nav__link-text">{{ link.name }}</span>
          <span class="nav__link-indicator"></span>
        </router-link>
      </div>

      <!-- Botones de acción -->
      <div class="nav__actions">
        <router-link 
          to="/register" 
          class="action action--outline"
          :class="{ 'action--active': isActive('/register') }"
          @mouseenter="e => animateAction(e, true)"
          @mouseleave="e => animateAction(e, false)"
        >
          <span>Registrarse</span>
        </router-link>
        
        <router-link 
          to="/login" 
          class="action action--primary"
          :class="{ 'action--active': isActive('/login') }"
          @mouseenter="e => animateAction(e, true)"
          @mouseleave="e => animateAction(e, false)"
        >
          <span>Ingresar</span>
          <span class="action__sparkle">✨</span>
        </router-link>
      </div>
    </div>

    <!-- Línea decorativa inferior -->
    <div class="navbar__border"></div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { UtensilsCrossed } from 'lucide-vue-next'

const route = useRoute()
const navbar = ref(null)

const navLinks = [
  { path: '/', name: 'Inicio' },
  { path: '/negocios', name: 'Negocios' },
  { path: '/no-se-que-comer', name: 'No sé qué comer' }
]

const isActive = (path) => route.path === path

// Animaciones orgánicas con transiciones avanzadas
const animateUnderline = (event, isEntering) => {
  const indicator = event.currentTarget.querySelector('.nav__link-indicator')
  if (indicator) {
    if (isEntering) {
      indicator.style.transform = 'scaleX(1)'
      indicator.style.opacity = '1'
    } else {
      indicator.style.transform = 'scaleX(0)'
      indicator.style.opacity = '0'
    }
  }
}

const animateAction = (event, isEntering) => {
  const action = event.currentTarget
  if (isEntering) {
    action.style.transform = 'translateY(-2px) scale(1.02)'
    action.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  } else {
    action.style.transform = 'translateY(0) scale(1)'
  }
}

const animateBrandIn = (event) => {
  const brand = event.currentTarget
  const icon = brand.querySelector('.brand__icon')
  const glow = brand.querySelector('.brand__icon-glow')
  brand.style.transform = 'scale(1.02)'
  if (glow) {
    glow.style.opacity = '0.6'
    glow.style.transform = 'scale(1.2)'
  }
  if (icon) {
    icon.style.filter = 'drop-shadow(0 0 8px rgba(107, 27, 60, 0.6))'
  }
}

const animateBrandOut = (event) => {
  const brand = event.currentTarget
  const icon = brand.querySelector('.brand__icon')
  const glow = brand.querySelector('.brand__icon-glow')
  brand.style.transform = 'scale(1)'
  if (glow) {
    glow.style.opacity = '0'
    glow.style.transform = 'scale(1)'
  }
  if (icon) {
    icon.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
  }
}

// Scroll effect con glassmorphism dinámico
const handleScroll = () => {
  if (!navbar.value) return
  const scrolled = window.scrollY > 30
  navbar.value.classList.toggle('navbar--scrolled', scrolled)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  if (navbar.value) {
    navbar.value.classList.add('navbar--initialized')
  }
  return () => window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ========== FUENTES PREMIUM ========== */
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:wght@400;500;600;700;800&display=swap');

/* ========== VARIABLES - CAMBIADAS A VINO MÁS VIBRANTE ========== */
.navbar {
  --wine-start: #6B1B3C;
  --wine-end: #4a122a;
  --wine-vibrant: #8B1E3F;
  --wine-bright: #A82E54;
  --wine-light: #C43A64;
  --cream-white: #FFF8F0;
  --gold-accent: #E8D5B5;
  --glass-bg: rgba(107, 27, 60, 0.85);
  --glass-border: rgba(200, 60, 100, 0.25);
  
  position: fixed;
  top: 24px;
  left: 24px;
  right: 24px;
  z-index: 1000;
  border-radius: 24px;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Estado inicial - Glassmorphism puro con vino más vibrante */
.navbar {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--glass-border);
}

/* Estado con scroll - más opaco */
.navbar--scrolled {
  top: 0;
  left: 0;
  right: 0;
  border-radius: 0;
  background: linear-gradient(135deg, rgba(107, 27, 60, 0.95) 0%, rgba(74, 18, 42, 0.98) 100%);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

/* Animación de entrada - Stagger se aplica a los hijos */
.navbar--initialized .nav__link {
  animation: slideUpFade 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
}

@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Contenedor principal */
.navbar__container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  padding: 16px 28px;
}

/* Línea decorativa inferior - AHORA EN VINO BRIGHT */
.navbar__border {
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--wine-bright), var(--wine-light), var(--wine-bright), transparent);
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.navbar:hover .navbar__border {
  opacity: 0.7;
}

/* ========== BRAND / LOGO ========== */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.brand__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-accent);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: filter 0.3s ease;
}

.brand__icon-glow {
  position: absolute;
  inset: -4px;
  background: radial-gradient(circle, var(--wine-bright), transparent);
  border-radius: 50%;
  opacity: 0;
  transform: scale(1);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.brand__text {
  font-family: 'Playfair Display', serif;
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--cream-white) 0%, var(--gold-accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand__text-accent {
  background: linear-gradient(135deg, var(--wine-bright) 0%, var(--wine-light) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ========== NAV LINKS ========== */
.nav__links {
  display: flex;
  gap: 8px;
  background: rgba(255, 248, 240, 0.06);
  backdrop-filter: blur(4px);
  padding: 6px;
  border-radius: 60px;
  flex: 1;
  justify-content: center;
}

.nav__link {
  position: relative;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--cream-white);
  padding: 10px 24px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, background 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

/* Indicador decorativo - AHORA EN VINO BRIGHT */
.nav__link-indicator {
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 70%;
  height: 2px;
  background: linear-gradient(90deg, var(--wine-bright), var(--wine-light));
  border-radius: 2px;
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
}

.nav__link:hover {
  color: var(--gold-accent);
  background: rgba(168, 46, 84, 0.25);
}

.nav__link:hover .nav__link-indicator {
  transform: translateX(-50%) scaleX(1);
  opacity: 1;
}

/* Estado activo */
.nav__link--active {
  background: rgba(168, 46, 84, 0.35);
  color: var(--gold-accent);
  font-weight: 600;
}

.nav__link--active .nav__link-indicator {
  transform: translateX(-50%) scaleX(1);
  opacity: 1;
  background: linear-gradient(90deg, var(--wine-bright), var(--gold-accent));
}

.nav__link-text {
  position: relative;
  z-index: 1;
}

/* ========== ACTIONS - BOTONES CON VINO ========== */
.nav__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  padding: 10px 24px;
  border-radius: 40px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
  position: relative;
  overflow: hidden;
}

/* Botón outline - BORDE VINO */
.action--outline {
  background: rgba(168, 46, 84, 0.15);
  backdrop-filter: blur(4px);
  color: var(--gold-accent);
  border: 1px solid var(--wine-bright);
}

.action--outline:hover {
  background: rgba(168, 46, 84, 0.35);
  border-color: var(--wine-light);
  color: var(--cream-white);
}

.action--outline.action--active {
  background: var(--wine-bright);
  border-color: var(--wine-bright);
  color: var(--cream-white);
}

/* Botón primario - FONDO VINO */
.action--primary {
  background: linear-gradient(135deg, var(--wine-bright) 0%, var(--wine-start) 100%);
  color: var(--cream-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
}

.action--primary::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action--primary:hover::before {
  opacity: 1;
}

.action--primary:hover {
  background: linear-gradient(135deg, var(--wine-light) 0%, var(--wine-bright) 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(168, 46, 84, 0.4);
}

.action__sparkle {
  font-size: 0.9rem;
  transition: transform 0.2s ease;
}

.action--primary:hover .action__sparkle {
  transform: rotate(15deg) scale(1.1);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 920px) {
  .navbar {
    left: 16px;
    right: 16px;
    top: 16px;
  }
  
  .navbar__container {
    padding: 12px 20px;
  }
  
  .nav__link {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .action {
    padding: 8px 18px;
    font-size: 0.85rem;
  }
  
  .brand__text {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    border-radius: 20px;
  }
  
  .navbar__container {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .nav__links {
    order: 3;
    width: 100%;
    gap: 4px;
    padding: 4px;
  }
  
  .nav__link {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .nav__link-indicator {
    bottom: 4px;
    width: 50%;
  }
  
  .action {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    left: 12px;
    right: 12px;
    top: 12px;
  }
  
  .navbar__container {
    padding: 10px 16px;
  }
  
  .brand__text {
    font-size: 1.1rem;
  }
  
  .brand__icon svg {
    width: 22px;
    height: 22px;
  }
  
  .nav__link {
    padding: 5px 10px;
    font-size: 0.7rem;
  }
  
  .action {
    padding: 5px 12px;
    font-size: 0.7rem;
  }
  
  .action__sparkle {
    font-size: 0.7rem;
  }
}
</style>