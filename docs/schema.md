# Documentación del Esquema de Base de Datos

## Tablas principales

### users
- id: INT UNSIGNED AUTO_INCREMENT (clave primaria)
- email: VARCHAR(255) NOT NULL UNIQUE
- password_hash: VARCHAR(255) NOT NULL
- role: ENUM('cliente','peluquero','jefe') NOT NULL DEFAULT 'cliente'
- created_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### appointments
- id: INT UNSIGNED AUTO_INCREMENT (clave primaria)
- user_id: INT UNSIGNED NOT NULL (clave foránea a users.id)
- servicio: ENUM('Corte','Color','Tratamiento') NOT NULL
- fecha: DATE NOT NULL
- hora: TIME NOT NULL
- estado: ENUM('pendiente','confirmada','completada','cancelada') NOT NULL DEFAULT 'pendiente'
- created_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### suggestions
- id: INT UNSIGNED AUTO_INCREMENT (clave primaria)
- user_id: INT UNSIGNED NOT NULL (clave foránea a users.id)
- mensaje: TEXT NOT NULL
- created_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### products
- id: VARCHAR(50) NOT NULL (clave primaria)
- name: VARCHAR(150) NOT NULL
- description: TEXT
- price: DECIMAL(8,2) NOT NULL DEFAULT 0
- stock: INT NOT NULL DEFAULT 0
- category: VARCHAR(80) NOT NULL
- image: VARCHAR(500) DEFAULT NULL

### orders
- id: VARCHAR(50) NOT NULL (clave primaria)
- user_id: INT UNSIGNED DEFAULT NULL (clave foránea a users.id)
- total: DECIMAL(10,2) NOT NULL DEFAULT 0
- created_at: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### order_items
- id: INT UNSIGNED AUTO_INCREMENT (clave primaria)
- order_id: VARCHAR(50) NOT NULL (clave foránea a orders.id)
- product_id: VARCHAR(50) NOT NULL (clave foránea a products.id)
- quantity: INT NOT NULL DEFAULT 1
- price: DECIMAL(8,2) NOT NULL DEFAULT 0

## Relaciones y restricciones
- `appointments.user_id` referencia `users.id` y elimina citas si el usuario se borra.
- `suggestions.user_id` referencia `users.id` y elimina sugerencias si el usuario se borra.
- `orders.user_id` referencia `users.id` y se pone `NULL` si el usuario se borra.
- `order_items.order_id` referencia `orders.id` y elimina los elementos si la orden se borra.
- `order_items.product_id` referencia `products.id` y evita borrados si el producto está en pedidos.

## Notas
- El proyecto usa MySQL local con base de datos `peluqueria`.
- El esquema real está en `db/schema.sql`.
- Esta documentación describe el modelo actual usado por el backend Express.
