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

      <!-- ===== NUEVO: BUSCADOR Y FILTROS ===== -->
      <div class="filters-section">
        <!-- Barra de búsqueda -->
        <div class="search-wrapper">
          <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="search-input" 
            placeholder="Buscar plato o ingrediente..."
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">×</button>
        </div>

        <!-- Botones de categoría principal -->
        <div class="category-filters">
          <button 
            class="category-btn"
            :class="{ active: selectedCategory === 'plato_suelto' }"
            @click="toggleCategory('plato_suelto')"
          >
            🍽️ Plato
          </button>
          <button 
            class="category-btn"
            :class="{ active: selectedCategory === 'almuerzo_completo' }"
            @click="toggleCategory('almuerzo_completo')"
          >
            🥗 Almuerzo
          </button>
          <button 
            v-if="selectedCategory"
            class="category-btn clear-btn"
            @click="clearFilters"
          >
            ✕ Limpiar filtros
          </button>
        </div>

        <!-- Filtro de disponibilidad (solo se muestra si hay categoría seleccionada) -->
        <transition name="slide-fade">
          <div v-if="selectedCategory" class="status-filters">
            <span class="status-label">Disponibilidad:</span>
            <div class="status-buttons">
              <button 
                class="status-btn"
                :class="{ active: selectedStatus === 'disponible' }"
                @click="selectedStatus = 'disponible'"
              >
                Disponible
              </button>
              <button 
                class="status-btn"
                :class="{ active: selectedStatus === 'no_disponible' }"
                @click="selectedStatus = 'no_disponible'"
              >
                ❌ No disponible
              </button>
            </div>
          </div>
        </transition>
      </div>

      <div v-if="cargando" class="loading-state">
        <p>Cargando menú...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="empty-state">
        <Plus :size="48" stroke-width="1.5" />
        <p>No se encontraron resultados para tu búsqueda</p>
        <button class="btn-create" @click="clearFilters">Limpiar filtros</button>
      </div>

      <div v-else class="items-grid">
        <div v-for="item in filteredItems" :key="item.id" :class="['item-card', item.tipo, { 'not-available': !item.disponible }]">
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

    <Transition name="modal-fade">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="form-card">
          <div class="form-header">
            <h2>{{ editingId ? 'Editar Menú' : 'Agregar Menú' }}</h2>
            <button class="close-btn" type="button" @click="closeForm">×</button>
          </div>

          <div class="tabs-nav">
            <button
              type="button"
              class="tab-btn"
              :class="{ active: formMenu.tipo === 'plato_suelto' }"
              @click="selectMenuType('plato_suelto')"
            >
              Plato
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: formMenu.tipo === 'almuerzo_completo' }"
              @click="selectMenuType('almuerzo_completo')"
            >
              Almuerzo
            </button>
          </div>

          <form @submit.prevent="saveMenuDirect">
  <!-- Indicador de pasos (solo para almuerzo_completo) -->
  <div v-if="formMenu.tipo === 'almuerzo_completo'" class="wizard-steps">
    <div 
      v-for="step in totalSteps" 
      :key="step"
      class="wizard-step"
      :class="{ 
        active: currentStep === step, 
        completed: currentStep > step 
      }"
      @click="currentStep = step"
    >
      <div class="step-number">
        <span v-if="currentStep > step">✓</span>
        <span v-else>{{ step }}</span>
      </div>
      <div class="step-label">
        {{ step === 1 ? 'Datos básicos' : step === 2 ? 'Componentes' : 'Configuración' }}
      </div>
    </div>
  </div>

  <!-- Mostrar error general -->
  <div v-if="formErrors.general" class="validation-summary">
    <strong>Error</strong>
    <span>{{ formErrors.general }}</span>
  </div>

  <!-- ===== PASO 1: DATOS BÁSICOS ===== -->
  <div v-show="currentStep === 1 || formMenu.tipo !== 'almuerzo_completo'" class="step-content">
    <div class="two-columns">
      <div class="col">
        <label class="field">
          <span class="field-label">Nombre <span class="required">*</span></span>
          <input
            v-model="formMenu.nombre"
            :class="{ invalid: formErrors.nombre }"
            type="text"
            placeholder="Ej: Lomo Saltado"
            @blur="validateMenuForm"
            @input="refreshVisibleErrors"
          />
          <span v-if="formErrors.nombre" class="field-error">{{ formErrors.nombre }}</span>
        </label>
      </div>
      
      <div class="col">
        <label class="field">
          <span class="field-label">Precio <span class="required">*</span></span>
          <div class="price-input" :class="{ invalid: formErrors.precio }">
            <span>Bs</span>
            <input
              v-model="formMenu.precio"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              @blur="validateMenuForm"
              @input="refreshVisibleErrors"
            />
          </div>
          <span v-if="formErrors.precio" class="field-error">{{ formErrors.precio }}</span>
        </label>
      </div>
    </div>

    <label class="field">
      <span class="field-label">Imagen <span class="required">*</span></span>
      <div class="upload-area">
        <ImageUploader v-model="formMenu.foto_url" @update:modelValue="validateMenuForm" />
      </div>
      <p v-if="formErrors.foto_url" class="field-error">{{ formErrors.foto_url }}</p>
    </label>

    <label class="field">
      <span class="field-label">Descripción</span>
      <textarea
        v-model="formMenu.descripcion"
        :class="{ invalid: formErrors.descripcion }"
        rows="3"
        placeholder="Describe el plato (opcional)..."
        @blur="validateMenuForm"
        @input="refreshVisibleErrors"
      />
      <small class="field-hint">{{ formMenu.descripcion.length }}/250 caracteres</small>
      <span v-if="formErrors.descripcion" class="field-error">{{ formErrors.descripcion }}</span>
    </label>
  </div>

  <!-- ===== PASO 2: COMPONENTES DEL ALMUERZO (solo para almuerzo_completo) ===== -->
  <div v-if="formMenu.tipo === 'almuerzo_completo'" v-show="currentStep === 2" class="step-content">
    <div class="meal-section">
      <span class="meal-section-title">🍽️ Componentes del almuerzo</span>
      
      <div class="two-columns">
        <div class="col">
          <label class="field">
            <span class="field-label">Entrada <span class="required">*</span></span>
            <input
              v-model="formMenu.entrada.nombre"
              :class="{ invalid: formErrors.entrada }"
              type="text"
              placeholder="Ej: Sopa de verduras"
              @blur="validateMenuForm"
              @input="refreshVisibleErrors"
            />
            <span v-if="formErrors.entrada" class="field-error">{{ formErrors.entrada }}</span>
          </label>
        </div>
        
        <div class="col">
          <label class="field">
            <span class="field-label">Principal <span class="required">*</span></span>
            <input
              v-model="formMenu.principal.nombre"
              :class="{ invalid: formErrors.principal }"
              type="text"
              placeholder="Ej: Lomo saltado con arroz"
              @blur="validateMenuForm"
              @input="refreshVisibleErrors"
            />
            <span v-if="formErrors.principal" class="field-error">{{ formErrors.principal }}</span>
          </label>
        </div>
      </div>
      
      <label class="field">
        <span class="field-label">Postre <span class="required">*</span></span>
        <input
          v-model="formMenu.postre.nombre"
          :class="{ invalid: formErrors.postre }"
          type="text"
          placeholder="Ej: Flan de vainilla"
          @blur="validateMenuForm"
          @input="refreshVisibleErrors"
        />
        <span v-if="formErrors.postre" class="field-error">{{ formErrors.postre }}</span>
      </label>
    </div>
  </div>

  <!-- ===== PASO 3: CONFIGURACIÓN ===== -->
  <div v-show="currentStep === 3 || formMenu.tipo !== 'almuerzo_completo'" class="step-content">
    <div class="config-section">
      <label class="checkbox-card">
        <div class="checkbox-content">
          <input v-model="formMenu.disponible" type="checkbox" />
          <div>
            <strong> Disponible</strong>
            <p>El plato estará visible para los clientes</p>
          </div>
        </div>
      </label>

      <label v-if="formMenu.tipo === 'almuerzo_completo'" class="checkbox-card">
        <div class="checkbox-content">
          <input v-model="formMenu.es_menu_del_dia" type="checkbox" />
          <div>
            <strong>🌟 Menú del día</strong>
            <p>Destacar este almuerzo como especial del día</p>
          </div>
        </div>
      </label>
    </div>
  </div>

  <!-- Botones de navegación -->
  <div class="form-actions">
    <div class="nav-buttons" v-if="formMenu.tipo === 'almuerzo_completo'">
      <button 
        v-if="currentStep > 1" 
        type="button" 
        class="btn-nav btn-prev" 
        @click="prevStep"
      >
        ← Anterior
      </button>
      <button 
        v-if="currentStep < totalSteps" 
        type="button" 
        class="btn-nav btn-next" 
        @click="nextStep"
      >
        Siguiente →
      </button>
    </div>
    
    <button 
      v-if="currentStep === totalSteps || formMenu.tipo !== 'almuerzo_completo'" 
      class="btn-save" 
      type="submit" 
      :disabled="guardando"
    >
      {{ guardando ? 'Guardando...' : 'Guardar Menú' }}
    </button>
    
    <button class="btn-cancel" type="button" @click="closeForm">
      Cancelar
    </button>
  </div>
</form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-card">
          <div class="modal-icon">
            <div class="icon-circle">
              <Trash2 :size="28" />
            </div>
          </div>
          <h3 class="modal-title">Eliminar menú</h3>
          <p class="modal-message">Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button class="modal-btn cancel" type="button" @click="closeDeleteModal">Cancelar</button>
            <button class="modal-btn confirm" type="button" @click="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="toast-slide">
      <div v-if="showSuccessToast" class="success-toast">
        <div class="toast-content">
          <div class="toast-icon">✓</div>
          <div class="toast-message">
            <strong>Menú guardado</strong>
          </div>
        </div>
      </div>
    </Transition>
  </DashboardLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import ImageUploader from '../../components/ImageUploader.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { almuerzosService } from '../../services/menu.service.js'

const router = useRouter()
const items = ref([])
const cargando = ref(true)
const guardando = ref(false)
const showForm = ref(false)
const editingId = ref(null)
const restaurante_id = localStorage.getItem('restaurante_id')
const formErrors = ref({})

// ===== NUEVOS ESTADOS PARA FILTROS =====
const searchQuery = ref('')
const selectedCategory = ref('') // 'plato_suelto' | 'almuerzo_completo' | ''
const selectedStatus = ref('') // 'disponible' | 'no_disponible' | ''

// ===== PROPIEDAD COMPUTADA PARA FILTRAR =====
const filteredItems = computed(() => {
  let result = [...items.value]
  
  // 1. Filtrar por categoría
  if (selectedCategory.value) {
    result = result.filter(item => item.tipo === selectedCategory.value)
  }
  
  // 2. Filtrar por disponibilidad (solo si hay categoría seleccionada)
  if (selectedCategory.value && selectedStatus.value) {
    const isAvailable = selectedStatus.value === 'disponible'
    result = result.filter(item => item.disponible === isAvailable)
  }
  
  // 3. Filtrar por texto de búsqueda (nombre, descripción, componentes del almuerzo)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(item => {
      // Buscar en nombre
      if (item.nombre?.toLowerCase().includes(query)) return true
      
      // Buscar en descripción
      if (item.descripcion?.toLowerCase().includes(query)) return true
      
      // Buscar en componentes del almuerzo
      if (item.tipo === 'almuerzo_completo') {
        if (item.entrada_nombre?.toLowerCase().includes(query)) return true
        if (item.principal_nombre?.toLowerCase().includes(query)) return true
        if (item.postre_nombre?.toLowerCase().includes(query)) return true
      }
      
      return false
    })
  }
  
  return result
})

// ===== FUNCIONES DE FILTROS =====
const toggleCategory = (category) => {
  if (selectedCategory.value === category) {
    // Si ya está seleccionada, la deseleccionamos
    selectedCategory.value = ''
    selectedStatus.value = '' // Limpiar también el estado de disponibilidad
  } else {
    selectedCategory.value = category
    selectedStatus.value = '' // Resetear disponibilidad al cambiar categoría
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
}

// ===== TOAST DE ÉXITO =====
const showSuccessToast = ref(false)
let toastTimeout = null

//noseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
// ===== NUEVOS ESTADOS PARA EL WIZARD =====
const currentStep = ref(1) // 1, 2 o 3
const totalSteps = 3

// Funciones de navegación del wizard
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const validateCurrentStep = () => {
  // Limpiar errores visuales previos
  if (currentStep.value === 1) {
    // Validar paso 1: nombre, precio, foto
    const nombre = formMenu.value.nombre.trim()
    const precio = Number(formMenu.value.precio)
    const fotoUrl = formMenu.value.foto_url.trim()
    
    if (!nombre) {
      formErrors.value.nombre = 'El nombre es obligatorio.'
      return false
    }
    if (nombre.length < 3) {
      formErrors.value.nombre = 'El nombre debe tener al menos 3 caracteres.'
      return false
    }
    if (!formMenu.value.precio) {
      formErrors.value.precio = 'El precio es obligatorio.'
      return false
    }
    if (precio <= 0) {
      formErrors.value.precio = 'El precio debe ser mayor a 0.'
      return false
    }
    if (!fotoUrl) {
      formErrors.value.foto_url = 'La imagen es obligatoria.'
      return false
    }
    return true
  }
  
  if (currentStep.value === 2 && formMenu.value.tipo === 'almuerzo_completo') {
    // Validar paso 2: componentes del almuerzo
    const entrada = formMenu.value.entrada.nombre.trim()
    const principal = formMenu.value.principal.nombre.trim()
    const postre = formMenu.value.postre.nombre.trim()
    
    if (!entrada) {
      formErrors.value.entrada = 'La entrada es obligatoria.'
      return false
    }
    if (!principal) {
      formErrors.value.principal = 'El plato principal es obligatorio.'
      return false
    }
    if (!postre) {
      formErrors.value.postre = 'El postre es obligatorio.'
      return false
    }
    return true
  }
  
  return true
}

// Reiniciar el wizard al cerrar/abrir
const resetWizard = () => {
  currentStep.value = 1
}

const showToast = () => {
  showSuccessToast.value = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

// ===== MODAL DELETE =====
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const isValidUrl = (value) => {
  if (value.startsWith('data:image/') || value.startsWith('blob:')) {
    return true
  }

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const refreshVisibleErrors = () => {
  if (Object.keys(formErrors.value).length > 0) {
    validateMenuForm()
  }
}

const selectMenuType = (type) => {
  formMenu.value.tipo = type
  resetWizard() // <-- Reinicia el wizard al cambiar de tipo
  refreshVisibleErrors()
}

const validateMenuForm = () => {
  const nextErrors = {}
  const nombre = formMenu.value.nombre.trim()
  const precio = Number(formMenu.value.precio)
  const fotoUrl = formMenu.value.foto_url.trim()
  const descripcion = formMenu.value.descripcion.trim()
  const entrada = formMenu.value.entrada.nombre.trim()
  const principal = formMenu.value.principal.nombre.trim()
  const postre = formMenu.value.postre.nombre.trim()

  if (!nombre) nextErrors.nombre = 'El nombre es obligatorio.'
  else if (nombre.length < 3) nextErrors.nombre = 'El nombre debe tener al menos 3 caracteres.'
  else if (nombre.length > 80) nextErrors.nombre = 'El nombre no debe superar 80 caracteres.'

  if (!formMenu.value.precio) nextErrors.precio = 'El precio es obligatorio.'
  else if (!Number.isFinite(precio) || precio <= 0) nextErrors.precio = 'El precio debe ser mayor a 0.'
  else if (precio > 999) nextErrors.precio = 'El precio no debe superar Bs 999.'

  if (!fotoUrl) nextErrors.foto_url = 'La imagen es obligatoria.'
  else if (!isValidUrl(fotoUrl)) nextErrors.foto_url = 'Usa una URL válida que empiece con http o https.'

  if (descripcion.length > 250) nextErrors.descripcion = 'La descripción no debe superar 250 caracteres.'

  if (formMenu.value.tipo === 'almuerzo_completo') {
    if (!entrada) nextErrors.entrada = 'La entrada es obligatoria para un almuerzo.'
    if (!principal) nextErrors.principal = 'El plato principal es obligatorio para un almuerzo.'
    if (!postre) nextErrors.postre = 'El postre es obligatorio para un almuerzo.'
  }

  formErrors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

// ===== FUNCIÓN DE GUARDADO DIRECTO (SIN MODAL) =====
const saveMenuDirect = async () => {
  if (!validateMenuForm()) {
    return
  }

  guardando.value = true
  try {
    const payload = {
      tipo: formMenu.value.tipo,
      nombre: formMenu.value.nombre.trim(),
      precio: Number(formMenu.value.precio),
      foto_url: formMenu.value.foto_url.trim(),
      descripcion: formMenu.value.descripcion.trim() || null,
      disponible: formMenu.value.disponible
    }

    if (formMenu.value.tipo === 'almuerzo_completo') {
      payload.entrada = { nombre: formMenu.value.entrada.nombre.trim() }
      payload.principal = { nombre: formMenu.value.principal.nombre.trim() }
      payload.postre = { nombre: formMenu.value.postre.nombre.trim() }
      payload.es_menu_del_dia = formMenu.value.es_menu_del_dia
    }

    if (editingId.value) {
      await almuerzosService.editarMenu(editingId.value, payload)
    } else {
      await almuerzosService.crearMenu(restaurante_id, payload)
    }

    showToast()
    resetForm()
    await cargarItems()
    
  } catch (error) {
    console.error('Error guardando menú:', error)
    formErrors.value = { general: 'No se pudo guardar el menú. Intenta de nuevo.' }
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
  es_menu_del_dia: false,
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
    es_menu_del_dia: false,
    entrada: { nombre: '' },
    principal: { nombre: '' },
    postre: { nombre: '' }
  }
  showForm.value = false
  formErrors.value = {}
  resetWizard() // <-- Agrega esta línea
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
    es_menu_del_dia: item.es_menu_del_dia || false,
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

/* ===== NUEVOS ESTILOS PARA FILTROS ===== */
.filters-section {
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #F0EDE7;
}

.search-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 1.5px solid #E8E5DF;
  border-radius: 48px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #FEFEFE;
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.search-clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.search-clear:hover {
  color: #666;
  background: #F0EDE7;
}

.category-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 10px 24px;
  border: 1.5px solid #E8E5DF;
  background: white;
  border-radius: 48px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a2c2c;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.category-btn:hover {
  border-color: #D4AF37;
  background: #FFFBF5;
}

.category-btn.active {
  background: linear-gradient(135deg, #4a2c2c 0%, #6B3A3A 100%);
  border-color: #4a2c2c;
  color: white;
}

.category-btn.clear-btn {
  background: #F5F5F5;
  border-color: #E8E5DF;
  color: #888;
}

.category-btn.clear-btn:hover {
  background: #EEEEEE;
  color: #666;
}

.status-filters {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #F0EDE7;
  flex-wrap: wrap;
}

.status-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-buttons {
  display: flex;
  gap: 10px;
}

.status-btn {
  padding: 8px 20px;
  border: 1.5px solid #E8E5DF;
  background: white;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.status-btn:hover {
  border-color: #D4AF37;
  background: #FFFBF5;
}

.status-btn.active {
  background: #D4AF37;
  border-color: #D4AF37;
  color: white;
}

/* Animación para el filtro de disponibilidad */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== RESTO DE ESTILOS EXISTENTES ===== */
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
.item-badge.unavailable {
  background: rgba(220, 38, 38, 0.9);
}
.item-card.plato_suelto .item-badge {
  background: rgba(72, 24, 39, 0.85);
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

/* ===== ESTILOS DE MODALES (sin cambios) ===== */
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
  max-width: 560px; /* Aumentado de 480px a 560px para más espacio */
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

/* ... resto de estilos de modales igual que antes ... */
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

.field input.invalid,
.field textarea.invalid,
.price-input.invalid {
  border-color: #dc2626;
  background: #fff7f7;
}

.field-error,
.form-error {
  color: #b91c1c;
  font-size: 0.82rem;
  font-weight: 600;
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
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.meal-section .field {
  width: 100%;
}

.meal-section input {
  width: 100%;
  box-sizing: border-box;
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

.success-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1100;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 12px 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  min-width: 260px;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #dcfce7;
  border-radius: 50%;
  color: #16a34a;
}

.toast-message strong {
  font-size: 0.875rem;
  font-weight: 700;
  color: #166534;
  display: block;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

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

/* ===== ESTILOS DEL WIZARD ===== */
.wizard-steps {
  display: flex;
  justify-content: space-between;
  margin: 0 24px 24px 24px;
  padding-top: 16px;
  border-bottom: 2px solid #F0EDE7;
}

.wizard-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-bottom: 16px;
  position: relative;
  transition: all 0.2s;
}

.wizard-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #E8E5DF;
  z-index: 0;
}

.wizard-step.completed:not(:last-child)::after {
  background: #22c55e;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  background: #F0EDE7;
  color: #888;
  position: relative;
  z-index: 1;
  transition: all 0.2s;
}

.wizard-step.active .step-number {
  background: linear-gradient(135deg, #D4AF37 0%, #E0A96D 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.wizard-step.completed .step-number {
  background: #22c55e;
  color: white;
}

.step-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.wizard-step.active .step-label {
  color: #D4AF37;
}

/* Grid de dos columnas - CORREGIDO */
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

/* Asegurar que los campos dentro del grid no se desborden */
.two-columns .field {
  width: 100%;
  min-width: 0; /* Previene el desbordamiento */
}

.two-columns input,
.two-columns .price-input {
  width: 100%;
  box-sizing: border-box;
}

/* Corregir el contenedor price-input */
.price-input {
  display: flex;
  align-items: center;
  border: 1.5px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  background: white;
}

.price-input span {
  padding: 12px 14px;
  background: #f9f9f9;
  color: #888;
  font-weight: 600;
  border-right: 1px solid #eee;
  flex-shrink: 0;
}

.price-input input {
  flex: 1;
  border: none;
  padding: 12px 14px;
  outline: none;
  width: 100%;
  min-width: 0;
  background: white;
}

/* Estilos para campos requeridos */
.required {
  color: #dc2626;
  font-size: 0.7rem;
  margin-left: 4px;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a2c2c;
  margin-bottom: 4px;
  display: block;
}

/* Asegurar que todos los inputs tengan box-sizing correcto */
.field input,
.field textarea,
.price-input {
  box-sizing: border-box;
}

.field input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  background: white;
}

/* Configuración cards */
.config-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-card {
  background: #FAFAFA;
  border: 1.5px solid #F0EDE7;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-card:hover {
  border-color: #D4AF37;
  background: #FFFBF5;
}

.checkbox-content {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.checkbox-content input {
  margin-top: 2px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-content strong {
  color: #4a2c2c;
  display: block;
  margin-bottom: 4px;
}

.checkbox-content p {
  margin: 0;
  font-size: 0.8rem;
  color: #888;
}

/* Botones de navegación */
.nav-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-nav {
  flex: 1;
  padding: 12px;
  border: 1.5px solid #E8E5DF;
  background: white;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nav:hover {
  border-color: #D4AF37;
  background: #FFFBF5;
}

.btn-prev {
  color: #666;
}

.btn-next {
  background: linear-gradient(135deg, #D4AF37 0%, #E0A96D 100%);
  border: none;
  color: white;
}

.btn-next:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

/* Animación de pasos */
.step-content {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Campo de texto */
.field-hint {
  font-size: 0.7rem;
  color: #999;
  margin-top: 4px;
}

/* ===== MEDIA QUERY RESPONSIVE ===== */
@media (max-width: 640px) {
  .two-columns {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .wizard-steps {
    margin: 0 16px 20px 16px;
  }
  
  .step-label {
    font-size: 0.6rem;
  }
  
  .step-number {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  .form-card {
    max-width: 95%;
    margin: 0 auto;
  }
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
  .success-toast {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
  }
  .filters-section {
    padding: 16px;
  }
  .category-filters {
    gap: 8px;
  }
  .category-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  .status-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
