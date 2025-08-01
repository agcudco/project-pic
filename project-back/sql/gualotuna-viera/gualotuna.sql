--Inventario con stock bajo
CREATE OR REPLACE FUNCTION ventas.obtener_stock_bajo()
RETURNS TABLE(nombre_producto TEXT, stock_actual INT, stock_minimo INT, sucursal TEXT)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.nombre,
    i.stock_actual,
    i.stock_minimo,
    s.nombre AS sucursal
  FROM ventas.inventario i
  JOIN ventas.producto p ON i.producto_id = p.id
  JOIN ventas.sucursal s ON i.sucursal_id = s.id
  WHERE i.stock_actual < i.stock_minimo;
END;
$$ LANGUAGE plpgsql;


-- Ventas que usaron promociones
CREATE OR REPLACE FUNCTION ventas.obtener_ventas_con_promociones()
RETURNS TABLE(fecha DATE, total_ventas NUMERIC, total_descuentos NUMERIC)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(v.fecha_hora),
    SUM(v.total) AS total_ventas,
    SUM(vp.monto_descuento) AS total_descuentos
  FROM ventas.venta v
  JOIN ventas.venta_promocion vp ON vp.venta_id = v.id
  WHERE v.estado = 'confirmada'
  GROUP BY DATE(v.fecha_hora)
  ORDER BY fecha;
END;
$$ LANGUAGE plpgsql;