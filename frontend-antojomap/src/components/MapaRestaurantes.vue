<template>
  <div id="mapa" style="height: 450px; width: 100%;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { api } from '@/services/api.js'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

onMounted(async () => {
  const mapa = L.map('mapa').setView([-16.5, -68.15], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(mapa)


  // Pin personalizado
  const iconoRestaurante = L.divIcon({
    className: '', 
    html: `
      <div style="
        background: #481827;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">🍴</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  }) 
  
  // Cargar restaurantes y agregar marcadores
  try {
    const respuesta = await api.get('/restaurantes')
    const restaurantes = Array.isArray(respuesta) ? respuesta : respuesta.restaurantes || []

    restaurantes.forEach(r => {
      if (r.latitud && r.longitud) {
        L.marker([r.latitud, r.longitud], { icon: iconoRestaurante })
          .addTo(mapa)
          .bindPopup(`<b>${r.nombre}</b><br>${r.direccion}`)
      }
    })
  } catch (error) {
    console.error('Error al cargar restaurantes:', error)
  }
})
</script>