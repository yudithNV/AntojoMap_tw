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
            <img :src="form.image" :alt="form.name" />
            <div class="preview-info">
              <h2>{{ form.name || 'Nombre del plato' }}</h2>
              <p class="preview-price">${{ form.price || '0.00' }}</p>
              <p>{{ form.description || 'Descripción del plato' }}</p>
            </div>
          </div>

          <form class="edit-form" @submit.prevent="savePlate">
            <label>
              Nombre del Plato
              <input v-model="form.name" required />
            </label>

            <label>
              Precio
              <input v-model="form.price" type="number" step="0.01" min="0" required />
            </label>

            <label>
              Imagen (URL)
              <input v-model="form.image" type="url" required />
            </label>

            <label>
              Descripción
              <textarea v-model="form.description" rows="4" required />
            </label>

            <button type="submit" class="save-btn">
              {{ isCreateMode ? 'Agregar Plato' : 'Guardar Cambios' }}
            </button>
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
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import restaurantMenuStore from '../../stores/restaurantMenuStore.js'

const route = useRoute()
const router = useRouter()
const plateId = route.params.id ? Number(route.params.id) : null
const isCreateMode = computed(() => !route.params.id)

const plate = computed(() => (plateId ? restaurantMenuStore.getPlateById(plateId) : null))
const form = ref({
  name: '',
  price: '',
  image: '',
  description: ''
})

watchEffect(() => {
  if (plate.value) {
    form.value = {
      name: plate.value.name,
      price: plate.value.price,
      image: plate.value.image,
      description: plate.value.description || ''
    }
  }
})

const savePlate = () => {
  if (!form.value.name || !form.value.price || !form.value.image) return

  if (isCreateMode.value) {
    restaurantMenuStore.addPlate({
      name: form.value.name,
      price: form.value.price,
      image: form.value.image,
      description: form.value.description
    })
  } else if (plate.value) {
    restaurantMenuStore.updatePlate(plateId, {
      name: form.value.name,
      price: form.value.price,
      image: form.value.image,
      description: form.value.description
    })
  }

  router.push('/restaurant/menu')
}
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
