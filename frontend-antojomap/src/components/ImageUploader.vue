<template>
  <div class="image-uploader">
    <!-- Selector de modo -->
    <div class="mode-toggle">
      <button 
        class="toggle-btn" 
        :class="{ active: mode === 'file' }"
        @click="mode = 'file'"
      >
        📁 Subir archivo
      </button>
      <button 
        class="toggle-btn" 
        :class="{ active: mode === 'url' }"
        @click="mode = 'url'"
      >
        🔗 Pegar URL
      </button>
    </div>

    <!-- Modo archivo -->
    <div v-if="mode === 'file'" class="upload-section">
      <div class="file-input-wrapper">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change.stop="handleFileSelected"
          class="file-input"
        />
        <button class="btn-select-file" @click.stop.prevent="$refs.fileInput.click()">
          <Upload :size="18" />
          Seleccionar imagen
        </button>
      </div>

      <p v-if="errorMensaje" class="error-text">{{ errorMensaje }}</p>
    </div>

    <!-- Modo URL -->
    <div v-else class="url-section">
      <input
        v-model="urlManual"
        type="text"
        class="url-input"
        placeholder="https://ejemplo.com/imagen.jpg"
        @input="previewUrlManual"
      />
      <button 
        v-if="urlManual"
        class="btn-confirm"
        @click="confirmarUrl"
      >
        Confirmar URL
      </button>
      <p v-if="errorMensaje" class="error-text">{{ errorMensaje }}</p>
    </div>

    <!-- Preview -->
    <div v-if="preview" class="preview-container">
      <img :src="preview" :alt="previewAlt" class="preview-img" />
      <div class="preview-actions">
        <button 
          class="btn-use" 
          @click="usarImagen"
          :disabled="subiendo"
        >
          {{ subiendo ? 'Subiendo...' : '✓ Usar esta imagen' }}
        </button>
        <button 
          class="btn-cancel" 
          @click="cancelarPreview"
          :disabled="subiendo"
        >
          ✕ Cancelar
        </button>
      </div>
      <p v-if="errorMensaje" class="error-text">{{ errorMensaje }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import { supabase } from '@/services/supabaseClient.js'

const emit = defineEmits(['update:modelValue'])

const mode = ref('file')
const fileInput = ref(null)
const selectedFile = ref(null)
const urlManual = ref('')
const preview = ref('')
const previewAlt = ref('')
const subiendo = ref(false)
const errorMensaje = ref('')
const isFromFile = ref(false) // Distinguir si preview es de archivo o URL

const handleFileSelected = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validar que sea imagen
  if (!file.type.startsWith('image/')) {
    errorMensaje.value = 'Por favor selecciona un archivo de imagen'
    return
  }

  selectedFile.value = file
  errorMensaje.value = ''
  isFromFile.value = true

  // Mostrar preview local inmediatamente con URL.createObjectURL
  const objectUrl = URL.createObjectURL(file)
  preview.value = objectUrl
  previewAlt.value = file.name
}

const previewUrlManual = () => {
  if (urlManual.value.trim()) {
    preview.value = urlManual.value
    previewAlt.value = 'URL Preview'
    errorMensaje.value = ''
    isFromFile.value = false
  }
}

const subirArchivo = async () => {
  if (!selectedFile.value) return

  subiendo.value = true
  errorMensaje.value = ''

  try {
    const fileName = selectedFile.value.name
    const path = `${Date.now()}-${fileName}`

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('imagenes')
      .upload(path, selectedFile.value)

    if (error) throw error

    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from('imagenes')
      .getPublicUrl(data.path)

    const publicUrl = publicData.publicUrl
    
    // Limpiar URL local del objeto
    if (preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    
    // Cambiar preview a URL pública
    preview.value = publicUrl
    
    // Emitir la URL final
    emit('update:modelValue', publicUrl)

    // Reset después de emitir exitosamente
    selectedFile.value = null
    urlManual.value = ''
    fileInput.value.value = ''
    
  } catch (e) {
    console.error('Error al subir imagen:', e)
    errorMensaje.value = 'Error al subir la imagen. Intenta de nuevo.'
  } finally {
    subiendo.value = false
  }
}

const confirmarUrl = () => {
  if (!urlManual.value.trim()) {
    errorMensaje.value = 'Por favor ingresa una URL válida'
    return
  }
  errorMensaje.value = ''
  emit('update:modelValue', urlManual.value)
  urlManual.value = ''
  preview.value = ''
}

const usarImagen = () => {
  if (isFromFile.value) {
    subirArchivo()
  } else {
    confirmarUrl()
  }
}

const cancelarPreview = () => {
  // Limpiar URL local de blob si existe
  if (preview.value.startsWith('blob:')) {
    URL.revokeObjectURL(preview.value)
  }
  preview.value = ''
  selectedFile.value = null
  urlManual.value = ''
  errorMensaje.value = ''
  isFromFile.value = false
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Toggle de modo */
.mode-toggle {
  display: flex;
  gap: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 4px;
  background: #f9f9f9;
}

.toggle-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #666;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: inherit;
}

.toggle-btn:hover {
  background: rgba(72, 24, 39, 0.05);
}

.toggle-btn.active {
  background: var(--plum, #481827);
  color: white;
}

/* Sección de archivo */
.upload-section,
.url-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-input-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.btn-select-file {
  width: 100%;
  padding: 12px;
  background: white;
  border: 2px dashed var(--dusty-coral, #D893A1);
  border-radius: 8px;
  color: var(--dusty-coral, #D893A1);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
}

.btn-select-file:hover {
  background: rgba(216, 147, 161, 0.05);
  border-color: #c17a8b;
}

.url-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.url-input:focus {
  outline: none;
  border-color: var(--plum, #481827);
}

/* Botones de acción */
.btn-upload,
.btn-confirm {
  padding: 10px 16px;
  background: var(--plum, #481827);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-upload:hover:not(:disabled),
.btn-confirm:hover {
  background: #6b2540;
  transform: translateY(-1px);
}

.btn-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Preview */
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.preview-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
}

.preview-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-use {
  padding: 8px 16px;
  background: var(--dusty-coral, #D893A1);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-use:hover:not(:disabled) {
  background: #c17a8b;
  transform: translateY(-1px);
}

.btn-use:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 8px 16px;
  background: #f0f0f0;
  color: #555;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-cancel:hover:not(:disabled) {
  background: #e8e8e8;
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mensajes */
.error-text {
  color: #e74c3c;
  font-size: 0.8rem;
  margin: 0;
  margin-top: 4px;
}
</style>
