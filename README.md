# Proyecto Peluquería - TFG

## Resumen del estado actual
Esta aplicación funciona como un proyecto web completo con frontend React + Vite y backend Express conectado a una base de datos MySQL local.

Actualmente el proyecto tiene:
- Autenticación de usuarios con registro e inicio de sesión.
- Roles de usuario: `cliente`, `peluquero` y `jefe`.
- Gestión de citas y estado de citas.
- Envío y lectura de sugerencias.
- Backend local en `server.js` y MySQL en `db/schema.sql`.
- Frontend en React con rutas protegidas y consumo de la API local.

## Tecnologías usadas
- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - React Router
  - React Hook Form
- Backend:
  - Node.js
  - Express
  - MySQL (`mysql2`)
  - JWT (`jsonwebtoken`)
  - Bcrypt para hash de contraseñas
  - express-validator para validar datos
- Base de datos:
  - MySQL local
  - Tablas principales: `users`, `appointments`, `suggestions`, `products`, `orders`, `order_items`

## Funciones principales
- Registro de usuario con contraseña segura.
- Login con token JWT.
- Verificación de sesión con endpoint `/api/auth/status`.
- Perfil de usuario y su rol.
- Crear citas y verlas según el rol.
- Enviar sugerencias desde la app.

## Estructura del proyecto
- `server.js` - servidor Express y rutas principales.
- `db.js` - conexión a MySQL con un pool de conexiones.
- `routes/` - rutas de autenticación, citas, usuarios y sugerencias.
- `src/lib/api.js` - capa de llamadas a la API desde el frontend.
- `src/context/AuthContext.jsx` - lógica de autenticación y token en el navegador.
- `src/pages/` - pantallas de registro, login, home y paneles de usuario.

## Cómo arrancar el proyecto localmente
1. Importar el schema MySQL en tu base de datos local.
2. Crear un archivo `.env` con las siguientes variables:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=Jorge2812$
   DB_NAME=peluqueria

   VITE_API_BASE_URL=http://localhost:3000
   JWT_SECRET=una_clave_segura_para_local
   ```
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Iniciar el backend:
   ```bash
   npm start
   ```
5. Iniciar el frontend en desarrollo:
   ```bash
   npm run dev
   ```
6. Abrir el navegador en la URL que muestre Vite (normalmente `http://localhost:5174`).

## Notas importantes
- El frontend usa proxy de Vite para que `/api` apunte a `http://localhost:3000`.
- La app guarda el token JWT en `localStorage` para mantener la sesión.
- El rol de usuario se lee en el inicio de sesión y controla qué panel se muestra.
- Las imágenes de galería se cargan desde `public/galeria-1.png`, `public/galeria-2.png` y `public/galeria-3.png`.



