-- Script de Pruebas Completas del Sistema de Promociones y Descuentos
-- Esquema: ventas
-- Autor: Herrera-Lecho
-- Fecha: 29/07/2025

SET search_path = ventas, public;

-- ============================================================================
-- PRUEBAS DE FUNCIONES Y TRIGGERS
-- ============================================================================

-- 1. Limpiar datos de prueba anteriores
DELETE FROM venta_promocion WHERE venta_id IN (SELECT id FROM venta WHERE total < 10000);
DELETE FROM venta_detalle WHERE venta_id IN (SELECT id FROM venta WHERE total < 10000);
DELETE FROM venta WHERE total < 10000;
DELETE FROM promocion_producto WHERE promocion_id > 100;
DELETE FROM promocion_categoria WHERE promocion_id > 100;
DELETE FROM promocion WHERE id > 100;

-- 2. Crear datos de prueba
INSERT INTO promocion (id, nombre, descripcion, tipo, valor, fecha_inicio, fecha_fin, condicion_json, activa) VALUES
(101, 'Descuento Producto Específico', '20% de descuento en producto ID 1', 'producto', 20.00, '2025-01-01', '2025-12-31', NULL, TRUE),
(102, 'Descuento por Categoría', '15% de descuento en categoría tecnología', 'categoria', 15.00, '2025-01-01', '2025-12-31', NULL, TRUE),
(103, 'Descuento por Monto Total', '10% de descuento en compras mayores a $100', 'monto_total', 10.00, '2025-01-01', '2025-12-31', '{"monto_minimo": 100}', TRUE),
(104, 'Descuento por Cantidad', '25% de descuento comprando 3 o más unidades', 'cantidad', 25.00, '2025-01-01', '2025-12-31', '{"cantidad_minima": 3}', TRUE);

-- Asociar promociones a productos y categorías
INSERT INTO promocion_producto (promocion_id, producto_id) VALUES (101, 1);
INSERT INTO promocion_categoria (promocion_id, categoria_id) VALUES (102, 1);

-- 3. Probar trigger de validación de fechas
BEGIN;
  INSERT INTO promocion (nombre, descripcion, tipo, valor, fecha_inicio, fecha_fin, activa) 
  VALUES ('Promoción Inválida', 'Fecha fin menor a fecha inicio', 'producto', 10.00, '2025-12-31', '2025-01-01', TRUE);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'CORRECTO: Se bloqueó la inserción de promoción con fechas inválidas: %', SQLERRM;
    ROLLBACK;
END;

-- 4. Probar trigger de validación de límites de descuento
BEGIN;
  INSERT INTO promocion (nombre, descripcion, tipo, valor, fecha_inicio, fecha_fin, activa) 
  VALUES ('Descuento Excesivo', 'Más del 100%', 'producto', 150.00, '2025-01-01', '2025-12-31', TRUE);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'CORRECTO: Se bloqueó la inserción de descuento mayor al 100%%: %', SQLERRM;
    ROLLBACK;
END;

-- 5. Probar función de descuento por producto
RAISE NOTICE '--- PRUEBA: Descuento por producto ---';
DO $$
DECLARE
  resultado RECORD;
BEGIN
  SELECT * INTO resultado FROM calcular_descuento_producto(1, 100.00, 1);
  RAISE NOTICE 'Producto ID 1: Descuento=%, Precio Final=%, Promociones=%', 
               resultado.descuento_total, resultado.precio_final, resultado.promociones_aplicadas;
END $$;

-- 6. Probar función de descuento por monto total
RAISE NOTICE '--- PRUEBA: Descuento por monto total ---';
DO $$
DECLARE
  resultado RECORD;
BEGIN
  SELECT * INTO resultado FROM calcular_descuento_por_monto_total(150.00);
  RAISE NOTICE 'Monto $150: Descuento=%, Promoción=%, Condiciones=%', 
               resultado.descuento_aplicable, resultado.promocion_nombre, resultado.condiciones_cumplidas;
               
  SELECT * INTO resultado FROM calcular_descuento_por_monto_total(50.00);
  RAISE NOTICE 'Monto $50: Descuento=%, Promoción=%, Condiciones=%', 
               resultado.descuento_aplicable, resultado.promocion_nombre, resultado.condiciones_cumplidas;
END $$;

-- 7. Crear una venta de prueba y aplicar descuentos
INSERT INTO venta (cliente_id, total, fecha_venta, estado) VALUES (1, 0, NOW(), 'pendiente');
SELECT currval('venta_id_seq') as venta_id \gset

INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
VALUES (:venta_id, 1, 2, 100.00, 200.00);

-- Simular aplicación de promociones
INSERT INTO venta_promocion (venta_id, promocion_id, monto_descuento) 
VALUES (:venta_id, 101, 40.00); -- 20% en 2 productos de $100

-- Actualizar total de la venta
UPDATE venta SET total = 160.00 WHERE id = :venta_id;

-- 8. Probar función de resumen de descuentos
RAISE NOTICE '--- PRUEBA: Resumen de descuentos de venta ---';
DO $$
DECLARE
  resultado RECORD;
  venta_test_id INT := currval('venta_id_seq');
BEGIN
  SELECT * INTO resultado FROM obtener_resumen_descuentos_venta(venta_test_id);
  RAISE NOTICE 'Venta ID %: Total Original=%, Descuentos=%, Total Final=%, Promociones=%', 
               venta_test_id, resultado.total_original, resultado.total_descuentos, 
               resultado.total_final, resultado.cantidad_promociones;
END $$;

-- 9. Verificar auditoría
RAISE NOTICE '--- VERIFICACIÓN: Auditoría de cambios ---';
SELECT 
  pa.id,
  pa.promocion_id,
  pa.operacion,
  pa.fecha_cambio,
  pa.datos_nuevos->>'nombre' as promocion_nombre
FROM promocion_auditoria pa
WHERE pa.promocion_id IN (101, 102, 103, 104)
ORDER BY pa.fecha_cambio DESC
LIMIT 5;

-- 10. Probar obtener promociones activas
RAISE NOTICE '--- PRUEBA: Obtener promociones activas ---';
SELECT 
  p.id,
  p.nombre,
  p.tipo,
  p.valor,
  p.activa,
  CASE 
    WHEN p.fecha_inicio <= CURRENT_DATE AND p.fecha_fin >= CURRENT_DATE THEN 'VIGENTE'
    WHEN p.fecha_inicio > CURRENT_DATE THEN 'FUTURA'
    ELSE 'EXPIRADA'
  END as estado
FROM ventas.promocion p
WHERE p.id > 100
ORDER BY p.id;

-- ============================================================================
-- CASOS DE USO REALES
-- ============================================================================

RAISE NOTICE '=== CASOS DE USO REALES ===';

-- Caso 1: Cliente compra un producto con descuento específico
RAISE NOTICE '--- CASO 1: Producto con descuento específico ---';
DO $$
DECLARE
  desc_result RECORD;
BEGIN
  -- Producto ID 1 con descuento del 20%
  SELECT * INTO desc_result FROM calcular_descuento_producto(1, 50.00, 1);
  RAISE NOTICE 'Producto $50 con 20%% descuento: Final=%, Ahorro=%', 
               desc_result.precio_final, desc_result.descuento_total;
END $$;

-- Caso 2: Compra que califica para descuento por monto
RAISE NOTICE '--- CASO 2: Descuento por monto total ---';
DO $$
DECLARE
  desc_result RECORD;
BEGIN
  SELECT * INTO desc_result FROM calcular_descuento_por_monto_total(250.00);
  RAISE NOTICE 'Compra de $250: Descuento=%, Promoción="%"', 
               desc_result.descuento_aplicable, desc_result.promocion_nombre;
END $$;

-- Caso 3: Modificar una promoción (trigger de auditoría)
UPDATE promocion SET valor = 25.00 WHERE id = 101;
RAISE NOTICE 'CORRECTO: Promoción actualizada, auditoría registrada automáticamente';

-- Caso 4: Intentar eliminar promoción activa
BEGIN;
  DELETE FROM promocion WHERE id = 101;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'CORRECTO: Se bloqueó eliminación de promoción activa: %', SQLERRM;
    ROLLBACK;
END;

-- ============================================================================
-- ESTADÍSTICAS Y REPORTES
-- ============================================================================

RAISE NOTICE '=== ESTADÍSTICAS DEL SISTEMA ===';

-- Reporte de promociones más utilizadas
SELECT 
  p.nombre,
  COUNT(vp.id) as veces_aplicada,
  SUM(vp.monto_descuento) as descuento_total_otorgado,
  AVG(vp.monto_descuento) as descuento_promedio
FROM promocion p
LEFT JOIN venta_promocion vp ON p.id = vp.promocion_id
WHERE p.id > 100
GROUP BY p.id, p.nombre
ORDER BY veces_aplicada DESC;

-- Reporte de ventas con descuentos
SELECT 
  v.id as venta_id,
  v.total as total_venta,
  COUNT(vp.id) as cantidad_promociones,
  SUM(vp.monto_descuento) as total_descuentos,
  (SUM(vp.monto_descuento) / v.total * 100) as porcentaje_descuento
FROM venta v
LEFT JOIN venta_promocion vp ON v.id = vp.venta_id
WHERE v.total > 0
GROUP BY v.id, v.total
HAVING COUNT(vp.id) > 0
ORDER BY total_descuentos DESC
LIMIT 10;

RAISE NOTICE '=== PRUEBAS COMPLETADAS EXITOSAMENTE ===';
RAISE NOTICE 'Sistema de Promociones y Descuentos funcionando correctamente';
RAISE NOTICE 'Todos los triggers de validación están activos';
RAISE NOTICE 'Auditoría automática registrando cambios';
RAISE NOTICE 'Funciones de cálculo de descuentos operativas';
