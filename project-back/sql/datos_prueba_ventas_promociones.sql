-- DATOS DE PRUEBA PARA VENTAS, PRODUCTOS, CATEGORIAS Y PROMOCIONES
-- Inserta primero categorías y productos
INSERT INTO ventas.categoria (nombre) VALUES ('Bebidas'), ('Snacks');
INSERT INTO ventas.producto (nombre, descripcion, precio_venta, costo, imagen_url) VALUES
  ('Coca Cola', 'Bebida gaseosa', 1.50, 1.00, NULL),
  ('Pepsi', 'Bebida gaseosa', 1.40, 1.00, NULL),
  ('Papitas', 'Snack salado', 0.80, 0.50, NULL);
-- Relaciona productos con categorías
INSERT INTO ventas.producto_categoria (producto_id, categoria_id) VALUES (1,1), (2,1), (3,2);
-- Sucursal
INSERT INTO ventas.sucursal (nombre, direccion) VALUES ('Sucursal Centro', 'Av. Principal 123');
-- Inventario
INSERT INTO ventas.inventario (producto_id, sucursal_id, stock_actual, stock_minimo) VALUES (1,1,100,10), (2,1,100,10), (3,1,100,10);
-- Cliente (requiere usuario en public.usuario, ajusta el id según tu base)
INSERT INTO ventas.cliente (usuario_id, tipo, razon_social) VALUES (1, 'persona', NULL);
-- Venta y detalle
INSERT INTO ventas.venta (cliente_id, total, estado) VALUES (1, 3.70, 'pendiente');
INSERT INTO ventas.venta_detalle (venta_id, producto_id, cantidad, precio_unitario) VALUES (1,1,1,1.50), (1,2,1,1.40), (1,3,1,0.80);
-- Promociones
INSERT INTO ventas.promocion (nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa) VALUES
  ('Promo Bebidas 10%', 'categoria', 10, NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '10 day', TRUE),
  ('Descuento Snacks 20%', 'producto', 20, NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '10 day', TRUE),
  ('Promo Total >$3', 'monto_total', 15, '{"min_monto":3}', CURRENT_DATE, CURRENT_DATE + INTERVAL '10 day', TRUE);
-- Relaciona promociones con productos/categorías
INSERT INTO ventas.promocion_categoria (promocion_id, categoria_id) VALUES (1,1);
INSERT INTO ventas.promocion_producto (promocion_id, producto_id) VALUES (2,3);
