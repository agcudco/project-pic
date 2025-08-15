-- Ejemplos prácticos para manejo de promociones y descuentos por categoría
-- Carpeta: herrera_lecho


-- Insertar una promoción para la categoría "Electrónicos" (id=16)
-- Ya insertaste la promoción, su id es 33
-- Asociar la promoción con id=33 a la categoría con id=16
INSERT INTO promocion_categoria (promocion_id, categoria_id)
VALUES (33, 16);

-- 2. Consultar promociones activas para una categoría
SELECT p.*
FROM promocion p
JOIN promocion_categoria pc ON p.id = pc.promocion_id
WHERE pc.categoria_id = 1
  AND p.activa = TRUE
  AND CURRENT_DATE BETWEEN p.fecha_inicio AND p.fecha_fin;

SELECT vd.id AS venta_detalle_id,
       vd.producto_id,
       vd.cantidad,
       vd.precio_unitario,
       p.valor AS porcentaje_descuento,
       (vd.precio_unitario * vd.cantidad * p.valor / 100) AS monto_descuento
FROM venta_detalle vd
JOIN producto_categoria pc ON vd.producto_id = pc.producto_id
JOIN promocion_categoria prc ON pc.categoria_id = prc.categoria_id
JOIN promocion p ON prc.promocion_id = p.id
WHERE p.activa = TRUE
  AND CURRENT_DATE BETWEEN p.fecha_inicio AND p.fecha_fin
  AND vd.venta_id = 1;

-- 4. Registrar el descuento aplicado en la tabla venta_promocion
-- Supón que la venta tiene id=1 y la promoción id=33, y el monto de descuento calculado es 10
INSERT INTO venta_promocion (venta_id, promocion_id, monto_descuento)
VALUES (1, 33, 10);

-- 5. Consultar los descuentos aplicados a una venta
SELECT vp.*, p.nombre AS nombre_promocion
FROM venta_promocion vp
JOIN promocion p ON vp.promocion_id = p.id
WHERE vp.venta_id = 1;
