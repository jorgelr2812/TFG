-- ARCHIVO DE CREACIÓN DE BASE DE DATOS PARA TFG "BARBERÍA JLR"
-- Alumno: Jorge Lerga Ruiz

CREATE DATABASE IF NOT EXISTS peluqueria;
USE peluqueria;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('cliente', 'peluquero', 'jefe') DEFAULT 'cliente',
  puntos INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Citas (Appointments)
CREATE TABLE IF NOT EXISTS appointments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  servicio VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
  precio DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabla de Productos (Tienda)
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen_url VARCHAR(255)
);

-- Inserción de datos de prueba opcionales
INSERT IGNORE INTO products (nombre, descripcion, precio, stock) VALUES 
('Cera Premium', 'Fijación fuerte y brillo natural', 15.50, 10),
('Aceite para Barba', 'Hidratación profunda con aroma a madera', 12.00, 5);
