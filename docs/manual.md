# Manual breve para el profesor

Este proyecto es un prototipo funcional de una aplicación de peluquería que combina:
- Frontend con React + Vite + Tailwind CSS.
- Backend local con Express y MySQL.
- Autenticación segura con JWT y contraseñas hasheadas.
- Roles de usuario: `cliente`, `peluquero` y `jefe`.

## Qué se puede mostrar en la demo
1. Registro y login de usuario.
2. Acceso a rutas protegidas según rol.
3. Creación de citas y cambio de estado de citas.
4. Envío de sugerencias desde el formulario.
5. Paneles diferentes para peluquero y jefe.

## Archivos clave
- `server.js`: servidor Express con API y rutas.
- `db.js`: conexión a MySQL.
- `routes/auth.js`: registro, login y verificación.
- `src/context/AuthContext.jsx`: gestión de sesión y token.
- `src/pages/Store.jsx`: tienda y carrito local.
- `src/pages/Home.jsx`: página principal del proyecto.

## Cómo ejecutar
1. Abrir la carpeta del proyecto.
2. Asegurarse de tener MySQL activo y la base de datos `peluqueria` importada : archivo schema.sql .
3. Configurar variables en `.env`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=Jorge2812$
   DB_NAME=peluqueria

   JWT_SECRET=una_clave_segura_para_local
   ```
4. Instalar dependencias con `npm install`.
5. Iniciar backend con `npm start`.
6. Iniciar frontend en desarrollo con `npm run dev`.

## Notas para el profesor
- Esta versión no depende de servicios externos.
- La base de datos está en MySQL local, lo que facilita la presentación.
- El frontend se comunica con el backend mediante el proxy `/api`.

