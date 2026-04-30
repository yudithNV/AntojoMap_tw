import { ref } from 'vue'

const plates = ref([
  {
    id: 1,
    name: 'Bowl de Quinoa',
    price: '12.50',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
    description: 'Quinoa, vegetales asados, aguacate y aderezo cítrico.'
  },
  {
    id: 2,
    name: 'Hamburguesa Clásica',
    price: '15.00',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop',
    description: 'Carne jugosa, queso cheddar, lechuga, tomate y salsa especial.'
  },
  {
    id: 3,
    name: 'Pasta Alfredo',
    price: '14.00',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Pasta cremosa con salsa Alfredo, champiñones y parmesano rallado.'
  }
])

const getPlateById = (id) => {
  return plates.value.find((plate) => plate.id === Number(id))
}

const updatePlate = (id, updates) => {
  const plate = getPlateById(id)
  if (!plate) return
  Object.assign(plate, updates)
}

const addPlate = (plateData) => {
  const nextId = plates.value.length
    ? Math.max(...plates.value.map((plate) => plate.id)) + 1
    : 1
  plates.value.push({ id: nextId, ...plateData })
  return nextId
}

export default {
  plates,
  getPlateById,
  updatePlate,
  addPlate
}
