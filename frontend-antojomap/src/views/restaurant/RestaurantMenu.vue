<template>
  <DashboardLayout>
    <div class="menu-container">
      <!-- Encabezado -->
      <header class="menu-header">
        <div class="header-text">
          <h1>Menú del Restaurante</h1>
          <span class="items-count">{{ items.length }} items</span>
        </div>
        <div class="header-actions">
          <button class="add-btn add-plate-btn" @click="showForm = 'plato_suelto'">
            <Plus :size="20" stroke-width="3" /> Agregar Plato
          </button>
          <button class="add-btn add-menu-btn" @click="showForm = 'almuerzo_completo'">
            <Plus :size="20" stroke-width="3" /> Crear Almuerzo
          </button>
        </div>
      </header>

      <!-- Loading/Empty states -->
      <div v-if="cargando" class="loading-state">
        <p>Cargando menú...</p>
      </div>

      <div v-else-if="!showForm && items.length === 0" class="empty-state">
        <Plus :size="48" stroke-width="1.5" />
        <p>No tienes items aún. ¡Crea tu primer plato o almuerzo!</p>
        <div class="empty-buttons">
          <button class="btn-create" @click="showForm = 'plato_suelto'">Crear Plato Suelto</button>
          <button class="btn-create alt" @click="showForm = 'almuerzo_completo'">Crear Almuerzo Completo</button>
        </div>
      </div>

      <!-- Formulario -->
      <div v-if="showForm" class="form-container">
        <div class="form-card">
          <div class="form-header">
            <h2>{{ showForm === 'plato_suelto' ? 'Agregar Plato Suelto' : 'Crear Almuerzo Completo' }}</h2>
            <button class="close-btn" @click="showForm = null">×</button>
          </div>

          <!-- PLATO SUELTO -->
          <form v-if="showForm === 'plato_suelto'" @submit.prevent="guardarPlatoSuelto">
            <label>
              Nombre del Plato *
              <input v-model="formPlatoSuelto.nombre" type="text" required />
            </label>

            <label>
              Precio *
              <input v-model="formPlatoSuelto.precio" type="number" step="0.01" min="0" required />
            </label>

            <label>
              Imagen (URL) *
              <input v-model="formPlatoSuelto.foto_url" type="url" required />
            </label>

            <label>
              Descripción
              <textarea v-model="formPlatoSuelto.descripcion" rows="3" />
            </label>

            <div class="form-actions">
              <button type="submit" class="btn-save" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Crear Plato' }}
              </button>
              <button type="button" class="btn-cancel" @click="showForm = null">Cancelar</button>
            </div>
          </form>

          <!-- ALMUERZO COMPLETO -->
          <form v-else-if="showForm === 'almuerzo_completo'" @submit.prevent="guardarAlmuerzoCompleto">
            <h3>Información General del Almuerzo</h3>

            <label>
              Nombre del Almuerzo *
              <input v-model="formAlmuerzo.nombre" type="text" required />
            </label>

            <label>
              Precio Total *
              <input v-model="formAlmuerzo.precio" type="number" step="0.01" min="0" required />
            </label>

            <label>
              Imagen del Almuerzo (URL) *
              <input v-model="formAlmuerzo.foto_url" type="url" required />
            </label>

            <label>
              Descripción
              <textarea v-model="formAlmuerzo.descripcion" rows="2" />
            </label>

            <hr />

            <h3>Entrada</h3>
            <div class="meal-option">
              <label class="radio-label">
                <input type="radio" v-model="formAlmuerzo.entradaTipo" value="referencia" />
                Usar plato existente
              </label>
              <select v-if="formAlmuerzo.entradaTipo === 'referencia'" v-model="formAlmuerzo.entrada.plato_id">
                <option value="">-- Selecciona un plato --</option>
                <option v-for="plato in platosSueltos" :key="plato.id" :value="plato.id">
                  {{ plato.nombre }} (Bs{{ plato.precio }})
                </option>
              </select>

              <label class="radio-label">
                <input type="radio" v-model="formAlmuerzo.entradaTipo" value="custom" />
                Describir plato
              </label>
              <input v-if="formAlmuerzo.entradaTipo === 'custom'" v-model="formAlmuerzo.entrada.nombre" type="text" placeholder="Nombre del plato de entrada" />
            </div>

            <hr />

            <h3>Plato Principal</h3>
            <div class="meal-option">
              <label class="radio-label">
                <input type="radio" v-model="formAlmuerzo.principalTipo" value="referencia" />
                Usar plato existente
              </label>
              <select v-if="formAlmuerzo.principalTipo === 'referencia'" v-model="formAlmuerzo.principal.plato_id">
                <option value="">-- Selecciona un plato --</option>
                <option v-for="plato in platosSueltos" :key="plato.id" :value="plato.id">
                  {{ plato.nombre }} (Bs{{ plato.precio }})
                </option>
              </select>

              <label class="radio-label">
                <input type="radio" v-model="formAlmuerzo.principalTipo" value="custom" />
                Describir plato
              </label>
              <input v-if="formAlmuerzo.principalTipo === 'custom'" v-model="formAlmuerzo.principal.nombre" type="text" placeholder="Nombre del plato principal" />
            </div>

            <hr />

            <h3>Postre</h3>
            <div class="meal-option">
              <label class="radio-label">
                <input type="radio" v-model="formAlmuerzo.postreTipo" value="referencia" />
                Usar plato existente
              </label>
              <select v-if="formAlmuerzo.postreTipo === 'referencia'" v-model="formAlmuerzo.postre.plato_id">
                <option value="">-- Selecciona un plato --</option>
                <option v-for="plato in platosSueltos" :key="plato.id" :value="plato.id">
                  {{ plato.nombre }} (Bs{{ plato.precio }})
                </option>
              </select>

              <label class="radio-label">
                <input type="radio" v-model="formAlmuerzo.postreTipo" value="custom" />
                Describir plato
              </label>
              <input v-if="formAlmuerzo.postreTipo === 'custom'" v-model="formAlmuerzo.postre.nombre" type="text" placeholder="Nombre del postre" />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Crear Almuerzo' }}
              </button>
              <button type="button" class="btn-cancel" @click="showForm = null">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Grid de Items -->
      <div v-else-if="!cargando && items.length > 0" class="items-grid">
        <div v-for="item in items" :key="item.id" class="item-card" :class="item.tipo">
          <div class="item-badge">{{ item.tipo === 'plato_suelto' ? 'Plato' : 'Almuerzo' }}</div>
          <div class="item-image">
            <img :src="item.foto_url" :alt="item.nombre">
          </div>
          <div class="item-info">
            <h3>{{ item.nombre }}</h3>
            <p class="price">Bs {{ item.precio }}</p>
            <p v-if="item.descripcion" class="description">{{ item.descripcion }}</p>
            <div v-if="item.tipo === 'almuerzo_completo'" class="meal-breakdown">
              <div v-if="item.entrada" class="meal-item">
                <strong>Entrada:</strong> {{ item.entrada.nombre }}
              </div>
              <div v-if="item.principal" class="meal-item">
                <strong>Principal:</strong> {{ item.principal.nombre }}
              </div>
              <div v-if="item.postre" class="meal-item">
                <strong>Postre:</strong> {{ item.postre.nombre }}
              </div>
            </div>
            <div class="item-actions">
              <button class="edit-btn" @click="editItem(item.id)">
                <Pencil :size="16" /> Editar
              </button>
              <button class="delete-btn" @click="deleteItem(item.id)">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { almuerzosService } from '../../services/menu.service.js'

const router = useRouter()
const items = ref([])
const cargando = ref(true)
const guardando = ref(false)
const showForm = ref(null)
const editingId = ref(null)
const restaurante_id = localStorage.getItem('restaurante_id')

// Formulario Plato Suelto
const formPlatoSuelto = ref({
  nombre: '',
  precio: '',
  foto_url: '',
  descripcion: ''
})

// Formulario Almuerzo Completo
const formAlmuerzo = ref({
  nombre: '',
  precio: '',
  foto_url: '',
  descripcion: '',
  entradaTipo: 'custom',
  entrada: { nombre: '', plato_id: '' },
  principalTipo: 'custom',
  principal: { nombre: '', plato_id: '' },
  postreTipo: 'custom',
  postre: { nombre: '', plato_id: '' }
})

// Platos sueltos para referenciar en almuerzos
const platosSueltos = computed(() => {
  return items.value.filter(item => item.tipo === 'plato_suelto')
})

const cargarItems = async () => {
  try {
    cargando.value = true
    if (restaurante_id) {
      const data = await almuerzosService.getAlmuerdos ? await almuerzosService.getAlmuerdos(restaurante_id) : await almuerzosService.getAlmuerzos(restaurante_id)
      items.value = data || []
    }
  } catch (error) {
    console.error('Error cargando items:', error)
  } finally {
    cargando.value = false
  }
}

const resetPlatoForm = () => {
  editingId.value = null
  formPlatoSuelto.value = { nombre: '', precio: '', foto_url: '', descripcion: '' }
}

const resetAlmuerzoForm = () => {
  editingId.value = null
  formAlmuerzo.value = {
    nombre: '', precio: '', foto_url: '', descripcion: '',
    entradaTipo: 'custom', entrada: { nombre: '', plato_id: '' },
    principalTipo: 'custom', principal: { nombre: '', plato_id: '' },
    postreTipo: 'custom', postre: { nombre: '', plato_id: '' }
  }
}

const guardarPlatoSuelto = async () => {
  if (!formPlatoSuelto.value.nombre || !formPlatoSuelto.value.precio || !formPlatoSuelto.value.foto_url) {
    alert('Por favor completa los campos requeridos')
    return
  }

  guardando.value = true
  try {
    const payload = {
      tipo: 'plato_suelto',
      nombre: formPlatoSuelto.value.nombre,
      precio: parseFloat(formPlatoSuelto.value.precio),
      foto_url: formPlatoSuelto.value.foto_url,
      descripcion: formPlatoSuelto.value.descripcion || null
    }

    if (editingId.value) {
      await almuerzosService.editarMenu(editingId.value, payload)
    } else {
      await almuerzosService.crearMenu(restaurante_id, payload)
    }

    showForm.value = null
    resetPlatoForm()
    await cargarItems()
  } catch (error) {
    console.error('Error guardando plato:', error)
    alert('Error al guardar el plato')
  } finally {
    guardando.value = false
  }
}

const guardarAlmuerzoCompleto = async () => {
  const entrada = formAlmuerzo.value.entradaTipo === 'referencia' 
    ? { plato_id: formAlmuerzo.value.entrada.plato_id }
    : { nombre: formAlmuerzo.value.entrada.nombre }
  
  const principal = formAlmuerzo.value.principalTipo === 'referencia' 
    ? { plato_id: formAlmuerzo.value.principal.plato_id }
    : { nombre: formAlmuerzo.value.principal.nombre }
  
  const postre = formAlmuerzo.value.postreTipo === 'referencia' 
    ? { plato_id: formAlmuerzo.value.postre.plato_id }
    : { nombre: formAlmuerzo.value.postre.nombre }

  if (!entrada.plato_id && !entrada.nombre) {
    alert('Por favor selecciona o describe la entrada')
    return
  }
  if (!principal.plato_id && !principal.nombre) {
    alert('Por favor selecciona o describe el plato principal')
    return
  }
  if (!postre.plato_id && !postre.nombre) {
    alert('Por favor selecciona o describe el postre')
    return
  }

  guardando.value = true
  try {
    const payload = {
      tipo: 'almuerzo_completo',
      nombre: formAlmuerzo.value.nombre,
      precio: parseFloat(formAlmuerzo.value.precio),
      foto_url: formAlmuerzo.value.foto_url,
      descripcion: formAlmuerzo.value.descripcion || null,
      entrada,
      principal,
      postre
    }

    if (editingId.value) {
      await almuerzosService.editarMenu(editingId.value, payload)
    } else {
      await almuerzosService.crearMenu(restaurante_id, payload)
    }

    showForm.value = null
    resetAlmuerzoForm()
    await cargarItems()
  } catch (error) {
    console.error('Error guardando almuerzo:', error)
    alert('Error al guardar el almuerzo')
  } finally {
    guardando.value = false
  }
}

const editItem = async (id) => {
  try {
    const { data } = await almuerzosService.getAlmuerzo(id)
    const item = data || data === null ? data : null
    // Some API wrappers return response directly; handle both shapes
    const menu = data && data.id ? data : (data && data.data) ? data.data : item
    if (!menu) {
      // Fallback: try to find in items list
      const found = items.value.find(i => i.id === id)
      if (!found) return alert('Item no encontrado para editar')
      return prefillFormForItem(found)
    }
    prefillFormForItem(menu)
  } catch (error) {
    console.error('Error al obtener item para editar:', error)
    alert('No se pudo cargar el item para editar')
  }
}

const prefillFormForItem = (menu) => {
  editingId.value = menu.id
  showForm.value = menu.tipo === 'plato_suelto' ? 'plato_suelto' : 'almuerzo_completo'

  if (menu.tipo === 'plato_suelto') {
    formPlatoSuelto.value = {
      nombre: menu.nombre || '',
      precio: menu.precio || '',
      foto_url: menu.foto_url || '',
      descripcion: menu.descripcion || ''
    }
  } else {
    // Almuerzo completo
    formAlmuerzo.value.nombre = menu.nombre || ''
    formAlmuerzo.value.precio = menu.precio || ''
    formAlmuerzo.value.foto_url = menu.foto_url || ''
    formAlmuerzo.value.descripcion = menu.descripcion || ''

    // Entrada
    if (menu.entrada && menu.entrada.plato && menu.entrada.plato.id) {
      formAlmuerzo.value.entradaTipo = 'referencia'
      formAlmuerzo.value.entrada.plato_id = menu.entrada.plato.id
      formAlmuerzo.value.entrada.nombre = ''
    } else {
      formAlmuerzo.value.entradaTipo = 'custom'
      formAlmuerzo.value.entrada.nombre = (menu.entrada && menu.entrada.nombre) || ''
      formAlmuerzo.value.entrada.plato_id = ''
    }

    // Principal
    if (menu.principal && menu.principal.plato && menu.principal.plato.id) {
      formAlmuerzo.value.principalTipo = 'referencia'
      formAlmuerzo.value.principal.plato_id = menu.principal.plato.id
      formAlmuerzo.value.principal.nombre = ''
    } else {
      formAlmuerzo.value.principalTipo = 'custom'
      formAlmuerzo.value.principal.nombre = (menu.principal && menu.principal.nombre) || ''
      formAlmuerzo.value.principal.plato_id = ''
    }

    // Postre
    if (menu.postre && menu.postre.plato && menu.postre.plato.id) {
      formAlmuerzo.value.postreTipo = 'referencia'
      formAlmuerzo.value.postre.plato_id = menu.postre.plato.id
      formAlmuerzo.value.postre.nombre = ''
    } else {
      formAlmuerzo.value.postreTipo = 'custom'
      formAlmuerzo.value.postre.nombre = (menu.postre && menu.postre.nombre) || ''
      formAlmuerzo.value.postre.plato_id = ''
    }
  }
}

const deleteItem = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este item?')) {
    try {
      await almuerzosService.eliminarMenu(id)
      items.value = items.value.filter(i => i.id !== id)
    } catch (error) {
      console.error('Error eliminando item:', error)
      alert('Error al eliminar el item')
    }
  }
}

onMounted(() => {
  cargarItems()
})
</script>

<style scoped>
.menu-container {
  padding: 20px;
  max-width: 1200px;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  gap: 20px;
  flex-wrap: wrap;
}

.header-text h1 {
  color: var(--plum);
  font-size: 2.2rem;
  margin: 0;
  font-weight: 800;
}

.items-count {
  color: #888;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.add-btn {
  border: none;
  color: white;
  padding: 8px 18px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-plate-btn {
  background-color: #f2a359;
  box-shadow: 0 4px 15px rgba(242, 163, 89, 0.3);
}

.add-plate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 163, 89, 0.4);
}

.add-menu-btn {
  background-color: #7e57c2;
  box-shadow: 0 4px 15px rgba(126, 87, 194, 0.3);
}

.add-menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(126, 87, 194, 0.4);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-state svg {
  color: #ddd;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

.empty-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-create {
  background-color: #f2a359;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create:hover {
  background-color: #e0933e;
}

.btn-create.alt {
  background-color: #7e57c2;
}

.btn-create.alt:hover {
  background-color: #6d46b6;
}

.form-container {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.form-card {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-header h2 {
  margin: 0;
  color: var(--plum);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

form h3 {
  margin: 12px 0 12px 0;
  color: var(--plum);
  font-size: 1.1rem;
}

form hr {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 12px 0;
}

form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
  color: #4a2c2c;
}

form input[type="text"],
form input[type="number"],
form input[type="url"],
form textarea,
form select {
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

form input:focus,
form textarea:focus,
form select:focus {
  border-color: #f2a359;
}

form textarea {
  resize: vertical;
}

.meal-option {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafafa;
  padding: 12px;
  border-radius: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  margin: 0;
}

.radio-label input[type="radio"] {
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.btn-save, .btn-cancel {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save {
  background-color: #f2a359;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background-color: #e0933e;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #555;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  justify-content: start;
}

.item-card {
  background: white;
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #F0EDE7;
  transition: all 0.2s;
  position: relative;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.item-badge {
  position: absolute;
  top: 20px;
  right: 12px;
  background: rgba(126, 87, 194, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 10;
}

.item-card.plato_suelto .item-badge {
  background: rgba(242, 163, 89, 0.9);
}

.item-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 14px;
}

.item-info h3 {
  margin: 12px 0 4px;
  font-size: 1.1rem;
  color: var(--plum);
}

.price {
  color: #f2a359;
  font-weight: 700;
  margin: 4px 0 8px 0;
}

.description {
  font-size: 0.85rem;
  color: #666;
  margin: 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meal-breakdown {
  background: #fafafa;
  padding: 8px;
  border-radius: 6px;
  margin: 8px 0;
  font-size: 0.85rem;
}

.meal-item {
  padding: 4px 0;
  color: #666;
}

.meal-item strong {
  color: var(--plum);
}

.item-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.edit-btn {
  flex: 1;
  background-color: #f1f4f9;
  border: none;
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #555;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background-color: #e5eaf2;
}

.delete-btn {
  background-color: #fff1f1;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  color: #ff5c5c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: #ff5c5c;
  color: white;
}

@media (max-width: 768px) {
  .menu-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .add-btn {
    flex: 1;
    justify-content: center;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .form-container {
    padding: 0;
  }

  .form-card {
    border-radius: 20px 20px 0 0;
    max-height: 100vh;
  }
}
</style>
