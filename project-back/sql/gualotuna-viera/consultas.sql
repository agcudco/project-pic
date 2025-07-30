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

-- Ventas en los ultimos 30 días
CREATE OR REPLACE FUNCTION ventas.obtener_ventas_ultimos_30_dias()
RETURNS TABLE(fecha DATE, total NUMERIC) AS
$$
BEGIN
  RETURN QUERY
  SELECT
    DATE(fecha_hora) AS fecha,
    SUM(total) AS total
  FROM ventas.venta
  WHERE fecha_hora >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(fecha_hora)
  ORDER BY fecha;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Top 10 productos más vendidos
CREATE OR REPLACE FUNCTION ventas.obtener_top_productos()
RETURNS TABLE(nombre_producto VARCHAR, cantidad_total INT) AS
$$
BEGIN
  RETURN QUERY
  SELECT
    p.nombre,
    SUM(dv.cantidad) AS cantidad_total
  FROM ventas.venta_detalle dv
  JOIN ventas.producto p ON p.id = dv.producto_id
  GROUP BY p.nombre
  ORDER BY cantidad_total DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql VOLATILE;

