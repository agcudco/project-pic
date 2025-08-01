-- Productos con stock bajo
CREATE OR REPLACE FUNCTION ventas.obtener_stock_bajo()
RETURNS TABLE(nombre_producto VARCHAR, sucursal VARCHAR, stock_actual INT, stock_minimo INT) AS
$$
BEGIN
  RETURN QUERY
  SELECT
    p.nombre,
    s.nombre AS sucursal,
    i.stock_actual,
    i.stock_minimo
  FROM ventas.inventario i
  JOIN ventas.producto p ON p.id = i.producto_id
  JOIN ventas.sucursal s ON s.id = i.sucursal_id
  WHERE i.stock_actual <= i.stock_minimo
  ORDER BY i.stock_actual;
END;
$$ LANGUAGE plpgsql VOLATILE;


-- Ventas con promociones (últimos 30 días)
CREATE OR REPLACE FUNCTION ventas.obtener_ventas_con_promociones()
RETURNS TABLE(nombre_promocion VARCHAR, cantidad INT, monto_total NUMERIC) AS
$$
BEGIN
  RETURN QUERY
  SELECT
    pr.nombre,
    COUNT(vp.id) AS cantidad,
    SUM(vp.monto_descuento) AS monto_total
  FROM ventas.venta_promocion vp
  JOIN ventas.promocion pr ON pr.id = vp.promocion_id
  JOIN ventas.venta v ON v.id = vp.venta_id
  WHERE v.fecha_hora >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY pr.nombre
  ORDER BY monto_total DESC;
END;
$$ LANGUAGE plpgsql VOLATILE;
