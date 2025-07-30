
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

