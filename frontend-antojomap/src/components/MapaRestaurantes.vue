<template>
  <div id="mapa" style="height: 450px; width: 100%;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { api } from '@/services/api.js'

onMounted(async () => {
  const mapa = L.map('mapa').setView([-16.5, -68.15], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(mapa)

  const restaurantes = await api.get('/restaurantes')

  restaurantes.forEach(r => {
    if (r.latitud && r.longitud) {
      L.marker([r.latitud, r.longitud])
        .addTo(mapa)
        .bindPopup(`<b>${r.nombre}</b><br>${r.direccion}`)
    }
  })
})
</script>