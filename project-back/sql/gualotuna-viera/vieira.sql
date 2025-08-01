-- ventas en los ultimos 30 días
CREATE OR REPLACE FUNCTION ventas.obtener_ventas_ultimos_30_dias()
RETURNS TABLE(fecha DATE, total NUMERIC)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(fecha_hora) AS fecha,
    SUM(total) AS total
  FROM ventas.venta
  WHERE fecha_hora >= CURRENT_DATE - INTERVAL '30 days'
    AND estado = 'confirmada'
  GROUP BY DATE(fecha_hora)
  ORDER BY fecha;
END;
$$ LANGUAGE plpgsql;

-- top 10 productos más vendidos
CREATE OR REPLACE FUNCTION ventas.obtener_top_productos()
RETURNS TABLE(nombre_producto TEXT, cantidad_total INT)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.nombre,
    SUM(vd.cantidad) AS cantidad_total
  FROM ventas.venta_detalle vd
  JOIN ventas.producto p ON p.id = vd.producto_id
  JOIN ventas.venta v ON v.id = vd.venta_id
  WHERE v.estado = 'confirmada'
  GROUP BY p.nombre
  ORDER BY cantidad_total DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;


