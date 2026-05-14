# AntojoMap Backend

Backend API para AntojoMap, construido con Node.js, Express y Supabase.

## Requisitos Previos

- Node.js >= 20.19.0 o >= 22.12.0
- npm o yarn
- Cuenta de Supabase

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Copia .env.example a .env y completa los valores
cp .env.example .env
```

### Variables de Entorno Necesarias

Ver `.env.example` para la lista completa. Principalmente necesitas:

- `SUPABASE_URL` - URL de tu proyecto Supabase
- `SUPABASE_SECRET_KEY` - Clave secreta de Supabase (usar desde backend)
- `JWT_SECRET` - Clave secreta para firmar tokens JWT (cualquier string largo)
- `ADMIN_SECRET` - Clave secreta para crear administradores

## Ejecución

```bash
# Desarrollo
npm start

# El servidor correría en http://localhost:3000
```

## Endpoints Disponibles

### Autenticación (`/api/auth`)

#### POST `/registro`
Registra un usuario normal.

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

Respuesta:
```json
{
  "token": "eyJhbGc...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "USER"
  }
}
```

#### POST `/login`
Inicia sesión.

```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

#### POST `/solicitud-restaurante`
Crea una solicitud para registrar un restaurante.

```json
{
  "nombre_restaurante": "Mi Restaurante",
  "direccion": "Calle Principal 123",
  "telefono": "+56912345678",
  "categoria": "tacos",
  "email": "restaurante@example.com",
  "password": "password123"
}
```

#### POST `/crear-admin`
Crea un usuario administrador (requiere clave secreta).

```json
{
  "nombre": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "clave_secreta": "tu_admin_secret"
}
```

#### GET `/perfil`
Obtiene el perfil del usuario actual (requiere token en header).

Header:
```
Authorization: Bearer <token>
```

### Admin (`/api/admin`)

Todas estas rutas requieren token y rol ADMIN.

#### GET `/solicitudes`
Lista todas las solicitudes de restaurante pendientes.

#### PUT `/solicitudes/:id/aprobar`
Aprueba una solicitud de restaurante.

#### PUT `/solicitudes/:id/rechazar`
Rechaza una solicitud de restaurante.

## Estructura de Carpetas

```
src/
├── config/          # Configuración (Supabase, etc)
├── controllers/     # Lógica de las rutas
├── middlewares/     # Middlewares (autenticación, etc)
└── routes/          # Definición de rutas
```

## Validaciones

El backend valida automáticamente:

- Email válido (formato correcto)
- Contraseña con mínimo 8 caracteres
- Campos requeridos no vacíos
- Emails únicos

## Manejo de Errores

Las respuestas de error incluyen un mensaje descriptivo:

```json
{
  "error": "El email ya está registrado"
}
```

Códigos HTTP usados:
- `400` - Validación fallida
- `401` - No autorizado / Token inválido
- `403` - Prohibido (sin permisos)
- `404` - No encontrado
- `500` - Error del servidor
