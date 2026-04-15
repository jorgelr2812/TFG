CREATE DATABASE IF NOT EXISTS peluqueria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE peluqueria;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('cliente','peluquero','jefe') NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS appointments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  servicio ENUM('Corte','Color','Tratamiento') NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente','confirmada','completada','cancelada') NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_appointments_user (user_id),
  CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS suggestions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_suggestions_user (user_id),
  CONSTRAINT fk_suggestions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(8,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  category VARCHAR(80) NOT NULL,
  image VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) NOT NULL,
  user_id INT UNSIGNED DEFAULT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_orders_user (user_id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(8,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
