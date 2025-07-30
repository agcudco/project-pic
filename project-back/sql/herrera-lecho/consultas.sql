-- Consultas de ejemplo para el sistema de Promociones y Descuentos
-- Integrado con las tablas del esquema 'ventas'
-- Autor: Herrera-Lecho
-- Fecha: 29/07/2025

-- ============================================================================
-- OPERACIONES INTERNAS DE DESCUENTOS - EJEMPLOS DE USO
-- ============================================================================

-- 1. CALCULAR DESCUENTOS PARA UN PRODUCTO ESPECÍFICO
-- Ejemplo: Calcular descuentos para el producto ID 1 con precio $100
SELECT * FROM calcular_descuento_producto(1, 100.00, 2);

-- 2. VERIFICAR DESCUENTOS POR MONTO TOTAL
-- Ejemplo: Ver si una compra de $500 califica para descuentos por monto
SELECT * FROM calcular_descuento_por_monto_total(500.00);

-- 3. APLICAR DESCUENTOS A UNA VENTA COMPLETA
-- Ejemplo: Aplicar todos los descuentos posibles a la venta ID 1
SELECT * FROM aplicar_descuentos_venta(1);

-- 4. OBTENER RESUMEN DE DESCUENTOS DE UNA VENTA
-- Ejemplo: Ver resumen completo de descuentos aplicados en venta ID 1
SELECT * FROM obtener_resumen_descuentos_venta(1);

-- 5. VALIDAR COHERENCIA DE PRECIOS
-- Verificar que los precios registrados coincidan con los calculados
SELECT * FROM validar_coherencia_precios_venta(1);

-- 6. REGISTRAR AUTOMÁTICAMENTE PROMOCIONES EN UNA VENTA
-- Registrar todas las promociones aplicadas en la tabla venta_promocion
SELECT registrar_promociones_aplicadas_en_venta(1);

-- ============================================================================
-- CONSULTAS DE VALIDACIÓN ANTES DE APLICAR DESCUENTOS
-- ============================================================================

-- 7. VALIDAR SI SE PUEDE APLICAR UNA PROMOCIÓN ESPECÍFICA
-- Verificar promoción ID 1 en producto ID 5 con precio $50 y costo $30
SELECT * FROM validar_aplicacion_promocion(1, 5, 50.00, 30.00);

-- 8. VERIFICAR INTEGRIDAD DEL SISTEMA
-- Encontrar problemas en las promociones configuradas
SELECT * FROM verificar_integridad_promociones_ventas();

-- ============================================================================
-- CONSULTAS PARA DATOS DE PRUEBA Y CONFIGURACIÓN
-- ============================================================================

-- 9. CREAR DATOS DE PRUEBA (EJECUTAR EN ORDEN)

-- Crear categorías de ejemplo
INSERT INTO ventas.categoria (nombre) VALUES 
('Electrónicos'), 
('Ropa'), 
('Hogar'),
('Deportes');

-- Crear productos de ejemplo
INSERT INTO ventas.producto (nombre, descripcion, precio_venta, costo, activo) VALUES 
('Smartphone Samsung', 'Teléfono inteligente última generación', 800.00, 500.00, true),
('Laptop HP', 'Computadora portátil para trabajo', 1200.00, 800.00, true),
('Camiseta Nike', 'Camiseta deportiva de algodón', 50.00, 25.00, true),
('Sofá 3 plazas', 'Sofá cómodo para sala', 600.00, 350.00, true),
('Zapatillas Adidas', 'Zapatillas para correr', 120.00, 70.00, true);

-- Asociar productos con categorías
INSERT INTO ventas.producto_categoria (producto_id, categoria_id) VALUES 
(1, 1), -- Smartphone -> Electrónicos
(2, 1), -- Laptop -> Electrónicos  
(3, 2), -- Camiseta -> Ropa
(3, 4), -- Camiseta -> Deportes
(4, 3), -- Sofá -> Hogar
(5, 2), -- Zapatillas -> Ropa
(5, 4); -- Zapatillas -> Deportes

-- Crear promociones de ejemplo
INSERT INTO ventas.promocion (nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa) VALUES 
('Descuento Electrónicos 15%', 'categoria', 15.00, '{"descripcion": "15% en electrónicos"}', '2025-01-01', '2025-12-31', true),
('Descuento Smartphone 20%', 'producto', 20.00, '{"descripcion": "20% en smartphone"}', '2025-07-01', '2025-08-31', true),
('Descuento Compra Mayor $1000', 'monto_total', 10.00, '{"monto_minimo": 1000.00}', '2025-01-01', '2025-12-31', true),
('Promoción 2x1 Ropa', 'cantidad', 50.00, '{"cantidad_minima": 2, "descripcion": "2x1 en ropa"}', '2025-07-15', '2025-08-15', true);

-- Asociar promociones con productos
INSERT INTO ventas.promocion_producto (promocion_id, producto_id) VALUES 
(2, 1); -- Descuento 20% -> Smartphone

-- Asociar promociones con categorías
INSERT INTO ventas.promocion_categoria (promocion_id, categoria_id) VALUES 
(1, 1), -- Descuento 15% -> Electrónicos
(4, 2), -- 2x1 -> Ropa
(4, 4); -- 2x1 -> Deportes

-- Crear cliente y venta de ejemplo
INSERT INTO ventas.cliente (usuario_id, tipo) VALUES (1, 'persona');

INSERT INTO ventas.venta (cliente_id, total, estado) VALUES (1, 1000.00, 'pendiente');

-- Crear detalles de venta
INSERT INTO ventas.venta_detalle (venta_id, producto_id, cantidad, precio_unitario) VALUES 
(1, 1, 1, 800.00), -- 1 Smartphone a $800
(1, 3, 2, 50.00),  -- 2 Camisetas a $50 c/u
(1, 5, 1, 120.00); -- 1 Zapatillas a $120

-- ============================================================================
-- 10. CONSULTAS DE ANÁLISIS Y REPORTES
-- ============================================================================

-- Ver todos los productos con sus posibles descuentos
SELECT 
    p.id,
    p.nombre,
    p.precio_venta,
    (SELECT descuento_total FROM calcular_descuento_producto(p.id, p.precio_venta)) as descuento_posible,
    (SELECT precio_final FROM calcular_descuento_producto(p.id, p.precio_venta)) as precio_con_descuento
FROM ventas.producto p
WHERE p.activo = true
ORDER BY p.precio_venta DESC;

-- Ver promociones activas por categoría
SELECT 
    c.nombre as categoria,
    p.nombre as promocion,
    p.tipo,
    p.valor as porcentaje_descuento,
    p.fecha_inicio,
    p.fecha_fin
FROM ventas.categoria c
JOIN ventas.promocion_categoria pc ON c.id = pc.categoria_id
JOIN ventas.promocion p ON pc.promocion_id = p.id
WHERE p.activa = true 
  AND p.fecha_inicio <= CURRENT_DATE 
  AND p.fecha_fin >= CURRENT_DATE
ORDER BY c.nombre, p.valor DESC;

-- Ver productos con promociones directas
SELECT 
    prod.nombre as producto,
    p.nombre as promocion,
    p.valor as descuento_porcentaje,
    prod.precio_venta,
    (prod.precio_venta * p.valor / 100) as descuento_monto,
    (prod.precio_venta - (prod.precio_venta * p.valor / 100)) as precio_final
FROM ventas.producto prod
JOIN ventas.promocion_producto pp ON prod.id = pp.producto_id
JOIN ventas.promocion p ON pp.promocion_id = p.id
WHERE p.activa = true 
  AND p.fecha_inicio <= CURRENT_DATE 
  AND p.fecha_fin >= CURRENT_DATE
  AND prod.activo = true
ORDER BY p.valor DESC;

-- Análisis de ventas con descuentos aplicados
SELECT 
    v.id as venta_id,
    v.fecha_hora,
    v.total as total_registrado,
    vp.monto_descuento,
    p.nombre as promocion_aplicada
FROM ventas.venta v
LEFT JOIN ventas.venta_promocion vp ON v.id = vp.venta_id
LEFT JOIN ventas.promocion p ON vp.promocion_id = p.id
ORDER BY v.fecha_hora DESC;

-- ============================================================================
-- 11. CONSULTAS DE MANTENIMIENTO
-- ============================================================================

-- Limpiar promociones antiguas (más de 1 año)
SELECT limpiar_promociones_antiguas(365);

-- Ver historial de una promoción específica
SELECT * FROM obtener_historial_promocion(1);

-- Estadísticas de auditoría (si la tabla existe)
-- SELECT * FROM estadisticas_auditoria();

-- ============================================================================
-- 12. EJEMPLOS DE USO EN TIEMPO REAL
-- ============================================================================

-- Simulación: Cliente agrega productos al carrito
-- Calcular precio con descuentos antes de finalizar la compra

-- Producto 1: Smartphone (tiene promoción directa del 20%)
SELECT 
    'Smartphone Samsung' as producto,
    800.00 as precio_original,
    descuento_total,
    precio_final,
    promociones_aplicadas
FROM calcular_descuento_producto(1, 800.00, 1);

-- Producto 2: Laptop (tiene descuento por categoría del 15%)
SELECT 
    'Laptop HP' as producto,
    1200.00 as precio_original,
    descuento_total,
    precio_final,
    promociones_aplicadas
FROM calcular_descuento_producto(2, 1200.00, 1);

-- Verificar si el total de la compra califica para descuento adicional
-- Total: $800 + $1200 = $2000 (califica para descuento del 10% por monto > $1000)
SELECT 
    'Descuento por monto total' as tipo,
    descuento_aplicable,
    promocion_nombre,
    condiciones_cumplidas
FROM calcular_descuento_por_monto_total(2000.00);

-- ============================================================================
-- NOTAS IMPORTANTES PARA EL DESARROLLO:
-- ============================================================================
-- 1. Todas estas funciones trabajan directamente con las tablas del esquema 'ventas'
-- 2. No modifican la estructura de la base de datos, solo proporcionan lógica de negocio
-- 3. Las funciones son reutilizables y pueden ser llamadas desde la aplicación
-- 4. El sistema mantiene la integridad referencial con las tablas existentes
-- 5. Los descuentos se calculan en tiempo real sin duplicar información
-- ============================================================================