<template>
  <DashboardLayout>
    <div class="page-header">
      <router-link to="/admin/restaurants" class="back-button">
        <ArrowLeft :size="20" />
      </router-link>
      <h1>Detalle del Restaurante</h1>
    </div>

    <div v-if="loading" class="loading-container">
      <p>Cargando detalles...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else class="detail-container">
      <!-- Información Principal -->
      <div class="info-card">
        <div class="header-section">
          <div class="img-container">
            <img v-if="restaurante.foto_portada" :src="restaurante.foto_portada" :alt="restaurante.nombre" class="portada" />
            <div v-else class="avatar-grande" :style="avatarStyle(restaurante)">
              {{ inicial(restaurante.nombre) }}
            </div>
          </div>
          <div class="header-info">
            <h2>{{ restaurante.nombre }}</h2>
            <p class="id-text">#{{ restaurante.id }}</p>
            <span class="estado-badge" :class="restaurante.estado">
              {{ restaurante.estado === 'activo' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Teléfono</span>
            <span class="value">{{ restaurante.telefono || 'No disponible' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Dirección</span>
            <span class="value">{{ restaurante.direccion || 'No disponible' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Coordenadas</span>
            <span class="value">{{ restaurante.latitud ? `${restaurante.latitud}, ${restaurante.longitud}` : 'No disponible' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Fecha de Registro</span>
            <span class="value">{{ formatDate(restaurante.creado_en) }}</span>
          </div>
        </div>

        <div class="description-section" v-if="restaurante.descripcion">
          <h3>Descripción</h3>
          <p>{{ restaurante.descripcion }}</p>
        </div>
      </div>

      <!-- Propietario -->
      <div class="info-card">
        <h3>Información del Propietario</h3>
        <div class="owner-info">
          <div class="owner-item">
            <span class="label">Nombre</span>
            <span class="value">{{ restaurante.propietario?.nombre || 'N/A' }}</span>
          </div>
          <div class="owner-item">
            <span class="label">Email</span>
            <span class="value">{{ restaurante.propietario?.email || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Categorías -->
      <div class="info-card" v-if="restaurante.categorias && restaurante.categorias.length > 0">
        <h3>Categorías</h3>
        <div class="categories-list">
          <span v-for="categoria in restaurante.categorias" :key="categoria.id" class="category-badge">
            {{ categoria.nombre }}
          </span>
        </div>
      </div>

      <!-- Horarios -->
      <div class="info-card" v-if="restaurante.horarios && restaurante.horarios.length > 0">
        <h3>Horarios</h3>
        <div class="horarios-table">
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Apertura</th>
                <th>Cierre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="horario in restaurante.horarios" :key="horario.id">
                <td>{{ nombreDia(horario.dia_semana) }}</td>
                <td>{{ horario.apertura }}</td>
                <td>{{ horario.cierre }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="info-card">
        <p class="sin-datos">Sin horarios registrados</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { adminService } from '../../services/admin.service.js'

const route = useRoute()
const restaurante = ref({})
const loading = ref(true)
const error = ref(null)

const avatarColors = ['#e57373','#f06292','#ba68c8','#7986cb','#4fc3f7','#4db6ac','#aed581','#ffb74d']

const inicial = (nombre) => nombre ? nombre.charAt(0).toUpperCase() : '?'

const avatarStyle = (restaurante) => {
  if (restaurante.foto_portada) return {}
  const index = restaurante.nombre?.charCodeAt(0) % avatarColors.length || 0
  return { backgroundColor: avatarColors[index] }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const nombreDia = (dia) => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[dia] ?? dia
}

const loadDetalle = async () => {
  try {
    loading.value = true
    error.value = null
    const res = await adminService.getRestauranteDetalle(route.params.id)
    restaurante.value = res.restaurante
  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDetalle()
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  color: var(--plum);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.back-button:hover {
  background: #f5f5f5;
  border-color: var(--plum);
}

.page-header h1 {
  color: var(--plum);
  font-size: 2rem;
  margin: 0;
}

.loading-container, .error-message {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: var(--dusty-coral);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.error-message {
  background: #ffebee;
  color: #c62828;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.info-card h3 {
  color: var(--plum);
  font-size: 1.2rem;
  margin: 0 0 16px 0;
}

/* Header Section */
.header-section {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.img-container {
  flex-shrink: 0;
}

.portada {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.avatar-grande {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.header-info h2 {
  color: var(--plum);
  font-size: 1.8rem;
  margin: 0 0 4px 0;
}

.id-text {
  font-size: 0.85rem;
  color: #999;
  margin: 0 0 12px 0;
}

.estado-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.estado-badge.activo {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.estado-badge:not(.activo) {
  background-color: #ffebee;
  color: #c62828;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label,
.owner-item .label {
  font-size: 0.85rem;
  color: var(--dusty-coral);
  font-weight: 600;
  text-transform: uppercase;
}

.info-item .value,
.owner-item .value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

/* Description */
.description-section {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.description-section h3 {
  font-size: 0.95rem;
  color: var(--plum);
  margin: 0 0 8px 0;
}

.description-section p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* Owner Info */
.owner-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.owner-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Categories */
.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--plum), #8b5a9e);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Horarios Table */
.horarios-table {
  overflow-x: auto;
}

.horarios-table table {
  width: 100%;
  border-collapse: collapse;
}

.horarios-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.horarios-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: var(--plum);
  font-size: 0.9rem;
}

.horarios-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.horarios-table tbody tr:hover {
  background-color: #fafafa;
}

.sin-datos {
  color: var(--dusty-coral);
  text-align: center;
  padding: 20px;
  margin: 0;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style>
