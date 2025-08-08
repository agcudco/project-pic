Proyecto PIC - Dashboard de Ventas
Gualotuña - Viera

Este proyecto es una aplicación web que implementa un dashboard de ventas para visualizar estadísticas de un sistema de gestión de ventas. El dashboard muestra métricas como el total de ventas, el producto más vendido, la distribución de productos por categoría, y un gráfico de ventas por año. La aplicación está dividida en un backend (Node.js con Express y PostgreSQL) y un frontend (React con TypeScript).

El dashboard de ventas permite a los usuarios visualizar estadísticas clave de un sistema de ventas. Las funcionalidades principales incluyen:
Total de Ventas: Muestra el monto total y el número de ventas confirmadas en un rango de tiempo (por ejemplo, año).
Producto Más Vendido: Muestra el producto con mayores ingresos, incluyendo nombre, cantidad vendida, e ingresos generados.
Productos por Categoría: Muestra el número de productos por cada categoría.
Gráfico de Ventas por Año: Visualiza las ventas totales y el número de ventas por año en un gráfico de líneas.


Tecnologías
Backend:
Node.js
Express.js
PostgreSQL
pg (PostgreSQL client para Node.js)
dotenv (para variables de entorno)
nodemon (para desarrollo)
Frontend:
React
TypeScript
Chart.js (para gráficos)
Vite (como bundler)
Base de Datos:
PostgreSQL
Estilos:
CSS (centralizado en App.css)


Configurar el backend:
cd project-back
npm install

Configurar el frontend:
cd project-front
npm install



SCRIPT USADO EN POSTGRES (PARA INSERTAR DATOS) PARA LAS GRAFICAS
SET search_path = ventas, public;

-- Insertar usuarios
INSERT INTO public.usuario (id, cedula, nombres, apellidos, email, telefono, contrasenia, fecha_registro, activo)
VALUES
  (1, '1234567890', 'Juan', 'Pérez', 'juan@example.com', '0987654321', 'password123', NOW(), TRUE),
  (2, '0987654321', 'María', 'Gómez', 'maria@example.com', '0998765432', 'password456', NOW(), TRUE);

-- Insertar clientes
INSERT INTO ventas.cliente (id, usuario_id, tipo, razon_social)
VALUES
  (1, 1, 'persona', NULL),
  (2, 2, 'empresa', 'Empresa Ejemplo S.A.');

-- Insertar categorías
INSERT INTO ventas.categoria (id, nombre)
VALUES
  (1, 'Electrónica'),
  (2, 'Ropa'),
  (3, 'Hogar');

-- Insertar productos
INSERT INTO ventas.producto (id, nombre, descripcion, precio_venta, costo, imagen_url, activo)
VALUES
  (1, 'Teléfono Inteligente', 'Smartphone de última generación', 500.00, 400.00, 'telefono.jpg', TRUE),
  (2, 'Camisa Casual', 'Camisa de algodón', 30.00, 20.00, 'camisa.jpg', TRUE),
  (3, 'Lámpara LED', 'Lámpara de bajo consumo', 25.00, 15.00, 'lampara.jpg', TRUE);

-- Asociar productos a categorías
INSERT INTO ventas.producto_categoria (producto_id, categoria_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 3);

-- Insertar ventas
INSERT INTO ventas.venta (id, cliente_id, fecha_hora, total, estado)
VALUES
  (1, 1, NOW() - INTERVAL '6 months', 1000.00, 'confirmada'),
  (2, 2, NOW() - INTERVAL '3 months', 150.00, 'confirmada'),
  (3, 1, '2024-12-20 15:30:00', 50.00, 'confirmada'),
  (4, 2, '2023-06-15 10:00:00', 2000.00, 'confirmada');

-- Insertar detalles de ventas
INSERT INTO ventas.venta_detalle (venta_id, producto_id, cantidad, precio_unitario)
VALUES
  (1, 1, 2, 500.00),
  (2, 2, 5, 30.00),
  (3, 3, 2, 25.00),
  (4, 1, 4, 500.00);

-- Insertar sucursales
INSERT INTO ventas.sucursal (id, nombre, direccion)
VALUES
  (1, 'Sucursal Centro', 'Av. Principal 123'),
  (2, 'Sucursal Norte', 'Calle Secundaria 456');

-- Insertar inventario
INSERT INTO ventas.inventario (producto_id, sucursal_id, stock_actual, stock_minimo)
VALUES
  (1, 1, 50, 10),
  (2, 1, 100, 20),
  (3, 2, 75, 15);






