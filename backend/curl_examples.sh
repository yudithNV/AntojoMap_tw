#!/bin/bash

# ============================================================
# AntojoMap - Ejemplos de peticiones CURL para Almuerzos
# ============================================================

# Variables de configuración
API_BASE="http://localhost:3000/api"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzMDVhMDZmLTc2YWItNDExMC1hNzliLThmODgwODFlODY1MCIsInJvbCI6IlJFU1RBVVJBTlRFIiwiaWF0IjoxNzc5MzQ3MzMyLCJleHAiOjE3Nzk5NTIxMzJ9.qIoYiEaDWa2wRjtkTS8sBdV48jO7XWzB_O0RwtK8gVE"
RESTAURANTE_ID="b83a599e-645b-4050-8c9e-b5221205e9e2"
ALMUERZO_ID="tu_almuerzo_id_uuid"
PLATO_ENTRADA_ID="uuid_plato_entrada"
PLATO_PRINCIPAL_ID="uuid_plato_principal"

# ============================================================
# 1. CREAR UN ALMUERZO COMPLETO (entrada + principal + postre)
# ============================================================
echo "=== 1. Crear Almuerzo Completo ==="
curl -X POST "$API_BASE/almuerzos/$RESTAURANTE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Menú Ejecutivo del Día",
    "descripcion": "Incluye refresco sin azúcar",
    "foto_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
    "precio": 25.99,
    "entrada": {
      "plato_id": "'$PLATO_ENTRADA_ID'"
    },
    "principal": {
      "plato_id": "'$PLATO_PRINCIPAL_ID'"
    },
    "postre": {
      "nombre": "Flan Casero",
      "descripcion": "Flan preparado en la cocina",
      "precio": 3.50,
      "foto_url": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500"
    }
  }'

echo "\n"

# ============================================================
# 2. OBTENER TODOS LOS ALMUERZOS DE UN RESTAURANTE
# ============================================================
echo "=== 2. Obtener Almuerzos del Restaurante ==="
curl -X GET "$API_BASE/almuerzos/$RESTAURANTE_ID" \
  -H "Content-Type: application/json"

echo "\n"

# ============================================================
# 3. OBTENER UN ALMUERZO POR ID (con detalles completos)
# ============================================================
echo "=== 3. Obtener Almuerzo Específico ==="
curl -X GET "$API_BASE/almuerzos/detalle/$ALMUERZO_ID" \
  -H "Content-Type: application/json"

echo "\n"

# ============================================================
# 4. EDITAR UN ALMUERZO (actualizar principal)
# ============================================================
echo "=== 4. Editar Almuerzo ==="
curl -X PUT "$API_BASE/almuerzos/$ALMUERZO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Menú Ejecutivo Actualizado",
    "principal": {
      "plato_id": "nuevo_uuid_plato_principal"
    }
  }'

echo "\n"

# ============================================================
# 5. ELIMINAR UN ALMUERZO
# ============================================================
echo "=== 5. Eliminar Almuerzo ==="
curl -X DELETE "$API_BASE/almuerzos/$ALMUERZO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo "\n"

# ============================================================
# RESPUESTA ESPERADA (ejemplo)
# ============================================================
cat << 'EOF'

RESPUESTA ESPERADA AL CREAR ALMUERZO:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Menú Ejecutivo del Día",
  "descripcion": "Incluye refresco sin azúcar",
  "foto_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
  "precio": 25.99,
  "creado_en": "2026-05-21T03:05:00Z",
  "menu_items": [
    {
      "id": "item_uuid_1",
      "tipo": "entrada",
      "nombre": "Sopa de Tomate",
      "descripcion": "Sopa casera",
      "precio": null,
      "foto_url": "https://...",
      "plato": {
        "id": "plato_uuid_1",
        "nombre": "Sopa de Tomate",
        "foto_url": "https://..."
      },
      "resuelto": true
    },
    {
      "id": "item_uuid_2",
      "tipo": "principal",
      "nombre": "Pechuga de Pollo",
      "descripcion": "Con puré de papas",
      "precio": null,
      "foto_url": "https://...",
      "plato": {
        "id": "plato_uuid_2",
        "nombre": "Pechuga de Pollo",
        "foto_url": "https://..."
      },
      "resuelto": true
    },
    {
      "id": "item_uuid_3",
      "tipo": "postre",
      "nombre": "Flan Casero",
      "descripcion": "Flan preparado en la cocina",
      "precio": 3.50,
      "foto_url": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500",
      "plato": null,
      "resuelto": false
    }
  ]
}

NOTAS:
- "resuelto": true = el item trae datos del plato existente
- "resuelto": false = el item usa datos personalizados (nombre/descripcion/foto_url propios)
- Authorization: Bearer <token> es requerido para POST, PUT, DELETE
- GET es público (sin token)

EOF
