<template>
  <DashboardLayout>
    <div class="edit-container">
      <div class="edit-card" v-if="isCreateMode || plate">
        <div class="section-header">
          <div>
            <h1>{{ isCreateMode ? 'Agregar Plato' : 'Editar Plato' }}</h1>
            <p>
              {{ isCreateMode ? 'Crea un nuevo plato para el menú.' : 'Modifica los detalles del plato seleccionado.' }}
            </p>
          </div>
          <button class="back-btn" @click="router.push('/restaurant/menu')">Volver al Menú</button>
        </div>

        <div class="edit-content">
          <div class="preview-card">
            <img :src="form.foto_url" :alt="form.nombre" />
            <div class="preview-info">
              <h2>{{ form.nombre || 'Nombre del plato' }}</h2>
              <p class="preview-price">Bs {{ form.precio || '0.00' }}</p>
              <p>{{ form.descripcion || 'Descripción del plato' }}</p>
            </div>
          </div>

          <form class="edit-form" @submit.prevent="savePlate">
            <label>
              Nombre del Plato
              <input v-model="form.nombre" :class="{ invalid: errors.nombre }" required />
              <span v-if="errors.nombre" class="field-error">{{ errors.nombre }}</span>
            </label>

            <label>
              Precio
              <input v-model="form.precio" :class="{ invalid: errors.precio }" type="number" step="0.01" min="0" required />
              <span v-if="errors.precio" class="field-error">{{ errors.precio }}</span>
            </label>

            <label>
              Imagen (URL)
              <input v-model="form.foto_url" :class="{ invalid: errors.foto_url }" type="url" required />
              <span v-if="errors.foto_url" class="field-error">{{ errors.foto_url }}</span>
            </label>

            <label>
              Descripción
              <textarea v-model="form.descripcion" :class="{ invalid: errors.descripcion }" rows="4" />
              <span v-if="errors.descripcion" class="field-error">{{ errors.descripcion }}</span>
            </label>

            <label>
              Categoría
              <input v-model="form.categoria" :class="{ invalid: errors.categoria }" placeholder="Ej: Entrada, Plato Principal, Postre" />
              <span v-if="errors.categoria" class="field-error">{{ errors.categoria }}</span>
            </label>

            <button type="submit" class="save-btn" :disabled="guardando">
              {{ guardando ? 'Guardando...' : (isCreateMode ? 'Agregar Plato' : 'Guardar Cambios') }}
            </button>
            <p v-if="errors.general" class="form-error">{{ errors.general }}</p>
          </form>
        </div>
      </div>

      <div class="empty-state" v-else>
        <p>No se encontró el plato solicitado.</p>
        <button class="back-btn" @click="router.push('/restaurant/menu')">Volver al Menú</button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, ref, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { menuService } from '../../services/menu.service.js'

const route = useRoute()
const router = useRouter()
const plateId = route.params.id ? Number(route.params.id) : null
const isCreateMode = computed(() => !route.params.id)
const restaurante_id = localStorage.getItem('restaurante_id')

const plate = ref(null)
const guardando = ref(false)
const form = ref({
  nombre: '',
  precio: '',
  foto_url: '',
  descripcion: '',
  categoria: ''
})
const errors = ref({})

const isValidUrl = (value) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const validatePlate = () => {
  const nextErrors = {}
  const nombre = form.value.nombre.trim()
  const precio = Number(form.value.precio)
  const fotoUrl = form.value.foto_url.trim()
  const descripcion = form.value.descripcion.trim()
  const categoria = form.value.categoria.trim()

  if (!nombre) nextErrors.nombre = 'El nombre es obligatorio.'
  else if (nombre.length < 3) nextErrors.nombre = 'El nombre debe tener al menos 3 caracteres.'
  else if (nombre.length > 80) nextErrors.nombre = 'El nombre no debe superar 80 caracteres.'

  if (!form.value.precio) nextErrors.precio = 'El precio es obligatorio.'
  else if (!Number.isFinite(precio) || precio <= 0) nextErrors.precio = 'El precio debe ser mayor a 0.'
  else if (precio > 999) nextErrors.precio = 'El precio no debe superar Bs 999.'

  if (!fotoUrl) nextErrors.foto_url = 'La URL de imagen es obligatoria.'
  else if (!isValidUrl(fotoUrl)) nextErrors.foto_url = 'Usa una URL válida que empiece con http o https.'

  if (descripcion.length > 250) nextErrors.descripcion = 'La descripción no debe superar 250 caracteres.'
  if (categoria.length > 40) nextErrors.categoria = 'La categoría no debe superar 40 caracteres.'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const cargarPlato = async () => {
  if (!isCreateMode.value && plateId) {
    try {
      const data = await menuService.getPlato(plateId)
      plate.value = data
      form.value = {
        nombre: data.nombre,
        precio: data.precio,
        foto_url: data.foto_url,
        descripcion: data.descripcion || '',
        categoria: data.categoria || ''
      }
    } catch (error) {
      console.error('Error cargando plato:', error)
    }
  }
}

const savePlate = async () => {
  if (!validatePlate()) {
    return
  }

  const payload = {
    nombre: form.value.nombre.trim(),
    precio: Number(form.value.precio),
    foto_url: form.value.foto_url.trim(),
    descripcion: form.value.descripcion.trim() || null,
    categoria: form.value.categoria.trim() || null
  }

  guardando.value = true
  try {
    if (isCreateMode.value) {
      await menuService.crearPlato(restaurante_id, payload)
    } else {
      await menuService.editarPlato(plateId, payload)
    }
    
    router.push('/restaurant/menu')
  } catch (error) {
    console.error('Error guardando plato:', error)
    errors.value = { general: 'No se pudo guardar el plato. Intenta de nuevo.' }
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  cargarPlato()
})
</script>

<style scoped>
.edit-container {
  padding: 20px;
  max-width: 1100px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.section-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--plum);
}

.section-header p {
  margin: 6px 0 0;
  color: #666;
}

.back-btn,
.save-btn {
  background-color: #f2a359;
  border: none;
  color: white;
  padding: 12px 22px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
}

.back-btn:hover,
.save-btn:hover:not(:disabled) {
  background-color: #e0933e;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.preview-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.preview-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.preview-info {
  padding: 22px;
}

.preview-info h2 {
  margin: 0 0 12px;
  color: var(--plum);
}

.preview-price {
  color: #f2a359;
  font-weight: 700;
  margin-bottom: 18px;
}

.preview-info p {
  color: #555;
  line-height: 1.7;
}

.edit-form {
  display: grid;
  gap: 18px;
}

.edit-form label {
  display: grid;
  gap: 10px;
  font-weight: 600;
  color: #4a2c2c;
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 0.96rem;
  background: #fff;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.edit-form input:focus,
.edit-form textarea:focus {
  border-color: #f2a359;
}

.edit-form input.invalid,
.edit-form textarea.invalid {
  border-color: #dc2626;
  background: #fff7f7;
}

.field-error,
.form-error {
  color: #b91c1c;
  font-size: 0.82rem;
  font-weight: 600;
}

.edit-form textarea {
  resize: vertical;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
}

.empty-state p {
  margin: 0 0 24px;
  font-size: 1.1rem;
  color: #555;
}

@media (max-width: 900px) {
  .edit-content {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<style scoped>
.edit-container {
  padding: 20px;
  max-width: 1100px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.section-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--plum);
}

.section-header p {
  margin: 6px 0 0;
  color: #666;
}

.back-btn,
.save-btn {
  background-color: #f2a359;
  border: none;
  color: white;
  padding: 12px 22px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
}

.edit-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.preview-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.preview-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.preview-info {
  padding: 22px;
}

.preview-info h2 {
  margin: 0 0 12px;
  color: var(--plum);
}

.preview-price {
  color: #f2a359;
  font-weight: 700;
  margin-bottom: 18px;
}

.preview-info p {
  color: #555;
  line-height: 1.7;
}

.edit-form {
  display: grid;
  gap: 18px;
}

.edit-form label {
  display: grid;
  gap: 10px;
  font-weight: 600;
  color: #4a2c2c;
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 0.96rem;
  background: #fff;
  outline: none;
}

.edit-form textarea {
  resize: vertical;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
}

.empty-state p {
  margin: 0 0 24px;
  font-size: 1.1rem;
  color: #555;
}

@media (max-width: 900px) {
  .edit-content {
    grid-template-columns: 1fr;
  }
}
</style>
