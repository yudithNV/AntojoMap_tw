<template>
  <DashboardLayout>
    <div class="menu-container">
      <header class="menu-header">
        <div class="header-text">
          <h1>Menú del Restaurante</h1>
          <span class="items-count">{{ items.length }} items</span>
        </div>
        <div class="header-actions">
          <button class="add-btn add-plate-btn" @click="openForm">
            <Plus :size="20" stroke-width="3" /> Agregar Menú
          </button>
        </div>
      </header>

      <div v-if="cargando" class="loading-state">
        <p>Cargando menú...</p>
      </div>

      <div v-else-if="items.length === 0" class="empty-state">
        <Plus :size="48" stroke-width="1.5" />
        <p>No tienes items en el menú. ¡Crea tu primer menú!</p>
        <button class="btn-create" @click="openForm">Crear Menú</button>
      </div>

      <div v-else class="items-grid">
        <div v-for="item in items" :key="item.id" :class="['item-card', item.tipo, { 'not-available': !item.disponible }]">
          <div v-if="!item.disponible" class="item-badge unavailable">No disponible</div>
          <div v-else class="item-badge">{{ item.tipo === 'plato_suelto' ? '🍽️ Plato' : '🥗 Almuerzo' }}</div>
          <div class="item-image">
            <img :src="item.foto_url" :alt="item.nombre">
          </div>
          <div class="item-info">
            <h3>{{ item.nombre }}</h3>
            <p class="price">Bs {{ item.precio }}</p>
            <p v-if="item.descripcion" class="description">{{ item.descripcion }}</p>
            
            <div v-if="item.tipo === 'almuerzo_completo'" class="meal-breakdown">
              <div v-if="item.entrada_nombre" class="meal-item">
                <strong>Entrada:</strong> {{ item.entrada_nombre }}
              </div>
              <div v-if="item.principal_nombre" class="meal-item">
                <strong>Principal:</strong> {{ item.principal_nombre }}
              </div>
              <div v-if="item.postre_nombre" class="meal-item">
                <strong>Postre:</strong> {{ item.postre_nombre }}
              </div>
            </div>

            <div class="item-actions">
              <button class="edit-btn" @click="editItem(item)">
                <Pencil :size="16" /> Editar
              </button>
              <button class="delete-btn" @click="openDeleteModal(item.id)">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL AGREGAR/EDITAR MENÚ ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
          <div class="form-card">
            <div class="form-header">
              <h2>{{ editingId ? 'Editar Menú' : 'Agregar Menú' }}</h2>
              <button class="close-btn" @click="closeForm">×</button>
            </div>

            <div class="tabs-nav">
              <button class="tab-btn" :class="{ active: formMenu.tipo === 'plato_suelto' }" @click="formMenu.tipo = 'plato_suelto'">Plato Individual</button>
              <button class="tab-btn" :class="{ active: formMenu.tipo === 'almuerzo_completo' }" @click="formMenu.tipo = 'almuerzo_completo'">Almuerzo Completo</button>
            </div>

            <form @submit.prevent="handleFormSubmit">
              <div class="upload-area">
                <img v-if="formMenu.foto_url" :src="formMenu.foto_url" class="upload-preview" />
                <div v-else class="upload-placeholder">
                  <ImagePlus :size="32" stroke-width="1.5" />
                  <p>Subir foto {{ formMenu.tipo === 'plato_suelto' ? 'del plato' : 'del menú completo' }}</p>
                  <span>PNG, JPG hasta 5MB</span>
                </div>
                <input v-model="formMenu.foto_url" type="url" placeholder="O pega una URL de imagen" class="url-input" />
              </div>

              <template v-if="formMenu.tipo === 'plato_suelto'">
                <div class="field">
                  <label>Título del Plato</label>
                  <input v-model="formMenu.nombre" type="text" placeholder="Ej. Hamburguesa Clásica" required />
                </div>
                <div class="field">
                  <label>Precio</label>
                  <div class="price-input">
                    <span>Bs</span>
                    <input v-model="formMenu.precio" type="number" step="0.01" min="0" placeholder="0.00" required />
                  </div>
                </div>
                <div class="field">
                  <label>Detalle de cocción o ingredientes</label>
                  <textarea v-model="formMenu.descripcion" rows="3" placeholder="Describe los ingredientes y preparación..." />
                </div>
              </template>

              <template v-else>
                <div class="field">
                  <label>Precio del Almuerzo</label>
                  <div class="price-input">
                    <span>Bs</span>
                    <input v-model="formMenu.precio" type="number" step="0.01" min="0" placeholder="0.00" required />
                  </div>
                </div>
                <div class="meal-section">
                  <div class="meal-section-title">🍴 Entrada</div>
                  <div class="field"><label>Título</label><input v-model="formMenu.entrada.nombre" placeholder="Ej. Sopa de tomate" required /></div>
                  <div class="field"><label>Detalle o ingredientes</label><textarea v-model="formMenu.entrada.descripcion" placeholder="Breve descripción..." rows="2" /></div>
                </div>
                <div class="meal-section">
                  <div class="meal-section-title">🍗 Plato Principal</div>
                  <div class="field"><label>Título</label><input v-model="formMenu.principal.nombre" placeholder="Ej. Milanesa con puré" required /></div>
                  <div class="field"><label>Detalle o ingredientes</label><textarea v-model="formMenu.principal.descripcion" placeholder="Breve descripción..." rows="2" /></div>
                </div>
                <div class="meal-section">
                  <div class="meal-section-title">🍰 Postre</div>
                  <div class="field"><label>Título</label><input v-model="formMenu.postre.nombre" placeholder="Ej. Flan casero" required /></div>
                </div>
                <div class="field">
                  <label>Nombre del almuerzo</label>
                  <input v-model="formMenu.nombre" placeholder="Ej. Almuerzo Ejecutivo" required />
                </div>
              </template>

              <label class="checkbox-label">
                <input v-model="formMenu.disponible" type="checkbox" />
                <span>Disponible para venta</span>
              </label>

              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="guardando">{{ guardando ? 'Guardando...' : 'Guardar y Publicar' }}</button>
                <button type="button" class="btn-cancel" @click="closeForm">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== MODAL DE CONFIRMACIÓN PARA GUARDAR ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showSaveConfirmModal" class="modal-overlay confirm-save-overlay" @click.self="closeSaveConfirmModal">
          <div class="modal-card confirm-save-card">
            <div class="modal-icon">
              <div class="icon-circle-save">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              </div>
            </div>
            <h2 class="modal-title">¿Guardar los cambios en el menú?</h2>
            <p class="modal-message">El menú se actualizará inmediatamente y los clientes verán los nuevos platos en la aplicación.</p>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="closeSaveConfirmModal">No</button>
              <button class="modal-btn confirm-save" @click="confirmSave">Sí, guardar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== MODAL DE CONFIRMACIÓN PARA ELIMINAR ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
          <div class="modal-card">
            <div class="modal-icon">
              <div class="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
            <h2 class="modal-title">¿Estás seguro de eliminar este plato?</h2>
            <p class="modal-message">Esta acción no se puede deshacer y el plato desaparecerá del menú.</p>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="closeDeleteModal">Cancelar</button>
              <button class="modal-btn confirm" @click="confirmDelete">Sí, eliminar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { Plus, Pencil, Trash2, ImagePlus } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { almuerzosService } from '../../services/menu.service.js'

const router = useRouter()
const items = ref([])
const cargando = ref(true)
const guardando = ref(false)
const showForm = ref(false)
const editingId = ref(null)
const restaurante_id = localStorage.getItem('restaurante_id')

// Modal save confirm
const showSaveConfirmModal = ref(false)
let pendingSaveData = null

// Modal delete
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

// ===== FUNCIONES PARA GUARDAR CON CONFIRMACIÓN =====
const handleFormSubmit = () => {
  // Validar campos
  if (!formMenu.value.nombre || !formMenu.value.precio || !formMenu.value.foto_url) {
    alert('Por favor completa los campos requeridos')
    return
  }

  if (formMenu.value.tipo === 'almuerzo_completo') {
    if (!formMenu.value.entrada.nombre || !formMenu.value.principal.nombre || !formMenu.value.postre.nombre) {
      alert('Por favor completa entrada, principal y postre')
      return
    }
  }

  // Mostrar modal de confirmación
  showSaveConfirmModal.value = true
}

const closeSaveConfirmModal = () => {
  showSaveConfirmModal.value = false
  pendingSaveData = null
}

const confirmSave = async () => {
  showSaveConfirmModal.value = false
  await executeSave()
}

const executeSave = async () => {
  guardando.value = true
  try {
    const payload = {
      tipo: formMenu.value.tipo,
      nombre: formMenu.value.nombre,
      precio: parseFloat(formMenu.value.precio),
      foto_url: formMenu.value.foto_url,
      descripcion: formMenu.value.descripcion || null,
      disponible: formMenu.value.disponible
    }

    if (formMenu.value.tipo === 'almuerzo_completo') {
      payload.entrada = { nombre: formMenu.value.entrada.nombre }
      payload.principal = { nombre: formMenu.value.principal.nombre }
      payload.postre = { nombre: formMenu.value.postre.nombre }
    }

    if (editingId.value) {
      await almuerzosService.editarMenu(editingId.value, payload)
    } else {
      await almuerzosService.crearMenu(restaurante_id, payload)
    }

    resetForm()
    await cargarItems()
  } catch (error) {
    console.error('Error guardando menú:', error)
    alert('Error al guardar el menú')
  } finally {
    guardando.value = false
  }
}

// ===== FUNCIONES EXISTENTES =====
const formMenu = ref({
  tipo: 'plato_suelto',
  nombre: '',
  precio: '',
  foto_url: '',
  descripcion: '',
  disponible: true,
  entrada: { nombre: '' },
  principal: { nombre: '' },
  postre: { nombre: '' }
})

const resetForm = () => {
  editingId.value = null
  formMenu.value = {
    tipo: 'plato_suelto',
    nombre: '',
    precio: '',
    foto_url: '',
    descripcion: '',
    disponible: true,
    entrada: { nombre: '' },
    principal: { nombre: '' },
    postre: { nombre: '' }
  }
  showForm.value = false
}

const openForm = () => {
  showForm.value = true
}

const closeForm = () => {
  resetForm()
}

const cargarItems = async () => {
  try {
    cargando.value = true
    if (restaurante_id) {
      const data = await almuerzosService.getAlmuerzos(restaurante_id)
      items.value = data || []
    }
  } catch (error) {
    console.error('Error cargando items:', error)
  } finally {
    cargando.value = false
  }
}

const editItem = (item) => {
  editingId.value = item.id
  formMenu.value = {
    tipo: item.tipo || 'plato_suelto',
    nombre: item.nombre,
    precio: item.precio,
    foto_url: item.foto_url,
    descripcion: item.descripcion || '',
    disponible: item.disponible !== false,
    entrada: { nombre: item.entrada_nombre || '' },
    principal: { nombre: item.principal_nombre || '' },
    postre: { nombre: item.postre_nombre || '' }
  }
  showForm.value = true
}

const openDeleteModal = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const confirmDelete = async () => {
  if (itemToDelete.value) {
    await deleteItem(itemToDelete.value)
    closeDeleteModal()
  }
}

const deleteItem = async (id) => {
  try {
    await almuerzosService.eliminarMenu(id)
    await cargarItems()
  } catch (error) {
    console.error('Error eliminando menú:', error)
    alert('Error al eliminar el menú')
  }
}

onMounted(async () => {
  if (!restaurante_id) {
    alert('No se encontró el ID del restaurante')
    router.push('/')
    return
  }
  await cargarItems()
})
</script>

<style scoped>
/* ===== ESTILOS EXISTENTES (se mantienen) ===== */
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
  color: var(--plum, #4a2c2c);
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
  background: linear-gradient(135deg, #D4AF37 0%, #E0A96D 100%);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.add-plate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
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

.btn-create {
  background-color: #f2a359;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.btn-create:hover {
  background-color: #e0933e;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
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
  color: var(--plum, #4a2c2c);
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
  color: var(--plum, #4a2c2c);
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
}

.delete-btn:hover {
  background-color: #ff5c5c;
  color: white;
}

/* ===== ESTILOS DE MODALES ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.form-card {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1001;
}

.modal-card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.75rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
  z-index: 1001;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-header h2 {
  margin: 0;
  color: var(--plum, #4a2c2c);
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.tabs-nav {
  display: flex;
  gap: 10px;
  padding: 10px 24px;
  background: #fdfcfb;
  border-bottom: 1px solid #f0f0f0;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: #f1f4f9;
  color: #555;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
}

.tab-btn.active {
  background-color: #f2a359;
  color: white;
}

form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.upload-placeholder {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #aaa;
}

.upload-preview {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.url-input {
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-top: 1px solid #f0f0f0;
  font-size: 0.85rem;
  outline: none;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #4a2c2c;
}

.field input,
.field textarea {
  padding: 12px 14px;
  border: 1.5px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
}

.field input:focus,
.field textarea:focus {
  border-color: #f2a359;
}

.price-input {
  display: flex;
  align-items: center;
  border: 1.5px solid #eee;
  border-radius: 10px;
  overflow: hidden;
}

.price-input span {
  padding: 12px 14px;
  background: #f9f9f9;
  color: #888;
  font-weight: 600;
  border-right: 1px solid #eee;
}

.price-input input {
  flex: 1;
  border: none;
  padding: 12px 14px;
  outline: none;
}

.meal-section {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meal-section-title {
  font-weight: 700;
  color: var(--plum);
  font-size: 0.95rem;
}

.checkbox-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.btn-save {
  width: 100%;
  padding: 14px;
  background: #f2a359;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-save:hover:not(:disabled) {
  background-color: #e0933e;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  width: 100%;
  padding: 12px;
  background: none;
  color: #888;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

/* Iconos modales */
.modal-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-circle {
  background-color: #fee2e2;
  border-radius: 9999px;
  padding: 0.75rem;
  color: #dc2626;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-circle-save {
  background-color: #fff3e6;
  border-radius: 9999px;
  padding: 0.75rem;
  color: #f2a359;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.modal-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.modal-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-btn.cancel {
  background-color: #f3f4f6;
  color: #4b5563;
}

.modal-btn.cancel:hover {
  background-color: #e5e7eb;
}

.modal-btn.confirm {
  background-color: #dc2626;
  color: white;
}

.modal-btn.confirm:hover {
  background-color: #b91c1c;
}

.modal-btn.confirm-save {
  background-color: #f2a359;
  color: white;
}

.modal-btn.confirm-save:hover {
  background-color: #e0933e;
}

/* Transiciones */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .form-card,
.modal-fade-leave-active .form-card,
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .form-card,
.modal-fade-leave-to .form-card,
.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: scale(0.95);
  opacity: 0;
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
  .form-card {
    border-radius: 20px;
    max-height: 95vh;
  }
}
</style>