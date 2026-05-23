<template>
  <DashboardLayout>
    <div class="page-header">
      <h1>Mi perfil</h1>
      <p class="subtitle">Tu información personal en AntojoMap</p>
    </div>

    <div class="profile-wrapper">
      <!-- Avatar + nombre -->
      <div class="profile-left">
        <div class="avatar">
          <img v-if="perfil.foto_perfil" :src="perfil.foto_perfil" alt="foto" class="avatar-img" />
          <User v-else :size="48" stroke-width="1.5" />
        </div>
        <h2 class="profile-name">{{ perfil.nombre }}</h2>
        <p class="profile-email">{{ perfil.email }}</p>
        <p v-if="perfil.bio" class="profile-bio">{{ perfil.bio }}</p>

        <button class="btn-edit" @click="abrirEditor">
          <Pen :size="16" :stroke-width="2" class="btn-icon" /> 
          Editar perfil
        </button>
      </div>

      <!-- Info -->
      <div class="profile-right">
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Nombre</span>
            <span class="info-value">{{ perfil.nombre }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ perfil.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Bio</span>
            <span class="info-value">{{ perfil.bio || 'Sin bio' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Miembro desde</span>
            <span class="info-value">{{ formatFecha(perfil.creado_en) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="editando" class="modal-overlay" @click.self="editando = false">
      <div class="modal">
        <h2>Editar perfil</h2>

        <label>Nombre</label>
        <input v-model="form.nombre" type="text" class="input" />

        <label>URL de foto de perfil</label>
        <input v-model="form.foto_perfil" type="text" class="input" placeholder="https://..." />

        <label>Bio</label>
        <textarea v-model="form.bio" class="input textarea" placeholder="Cuéntanos algo sobre ti..." />

        <div class="modal-actions">
          <button class="btn-cancel" @click="editando = false">Cancelar</button>
          <button class="btn-save" @click="guardarCambios" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { User, Pen } from 'lucide-vue-next'
import { usuariosService } from '../../services/usuarios.service.js'
import { useAuthStore } from '../../stores/auth.store.js'
const authStore = useAuthStore()

const perfil = ref({ nombre: '', email: '', bio: '', foto_perfil: '', creado_en: '' })
const editando = ref(false)
const guardando = ref(false)
const error = ref('')
const form = ref({ nombre: '', foto_perfil: '', bio: '' })

// Precarga con datos del store al instante
perfil.value = {
  nombre: authStore.nombre,
  email: authStore.email,
  foto_perfil: authStore.foto,
  bio: authStore.bio,
  creado_en: ''
}

const cargarPerfil = async () => {
  try {
    const data = await usuariosService.getMiPerfil()
    perfil.value = data
  } catch (e) {
    console.error('Error cargando perfil:', e)
  }
}

const abrirEditor = () => {
  form.value = {
    nombre: perfil.value.nombre,
    foto_perfil: perfil.value.foto_perfil || '',
    bio: perfil.value.bio || ''
  }
  error.value = ''
  editando.value = true
}

const guardarCambios = async () => {
  try {
    guardando.value = true
    error.value = ''
    const data = await usuariosService.editarPerfil(form.value)
    perfil.value = { ...perfil.value, ...data }
    authStore.actualizarPerfil(data)  // ← esto actualiza sidebar al instante
    editando.value = false
  } catch (e) {
    error.value = 'Error al guardar, intenta de nuevo.'
  } finally {
    guardando.value = false
  }
}

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  await cargarPerfil() // actualiza con datos frescos del back
})
</script>

<style scoped>
.page-header { margin-bottom: 30px; }
.page-header h1 { color: var(--plum); font-size: 2rem; margin: 0 0 8px 0; }
.subtitle { color: var(--dusty-coral); font-size: 0.95rem; margin: 0; }

.profile-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

.profile-left {
  background: white;
  border-radius: 15px;
  padding: 32px 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blush), var(--dusty-coral));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.profile-name { font-size: 1.2rem; color: var(--plum); margin: 0; font-weight: 700; }
.profile-email { font-size: 0.85rem; color: #888; margin: 0; }
.profile-bio { font-size: 0.85rem; color: #666; margin: 0; font-style: italic; }

.btn-edit {
  margin-top: 8px;
  width: 100%;
  padding: 10px;
  border: 2px solid var(--plum);
  background: transparent;
  color: var(--plum);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-icon {
  display: inline-block;
}
.btn-edit:hover {
  /* Cambiamos el fondo sólido vino por el degradado rosa/coral */
  background: linear-gradient(135deg, var(--blush), var(--dusty-coral));
  
  /* Cambiamos el texto a oscuro para que resalte sobre el rosa */
  color: var(--plum);
  
  /* Quitamos el borde o lo igualamos para que no se vea raro con el degradado */
  border-color: transparent;
}

.profile-right { display: flex; flex-direction: column; gap: 20px; }

.info-card {
  background: white;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}
.info-row:last-child { border-bottom: none; }
.info-label { font-weight: 600; color: #666; font-size: 0.9rem; }
.info-value { color: var(--plum); font-size: 0.95rem; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 15px;
  padding: 32px;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal h2 { margin: 0 0 8px; color: var(--plum); }

label { font-size: 0.88rem; font-weight: 600; color: #666; }

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border 0.2s;
}
.input:focus { border-color: var(--plum); }
.textarea { resize: vertical; min-height: 90px; }

.modal-actions { display: flex; gap: 12px; margin-top: 8px; }

.btn-cancel {
  flex: 1; padding: 10px; border: 1.5px solid #ddd;
  background: transparent; border-radius: 8px;
  font-weight: 600; cursor: pointer; color: #666;
}

.btn-save {
  flex: 1; padding: 10px; border: none;
  background: var(--plum); color: white;
  border-radius: 8px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-save:hover { background: #6b2540; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.error-msg { color: #c0392b; font-size: 0.85rem; margin: 0; }

@media (max-width: 768px) {
  .profile-wrapper { grid-template-columns: 1fr; }
}
</style>