-- Función para obtener todas las ventas (para el CRUD de ventas)
-- Puedes agregarla a tu archivo de funciones generales o ejecutarla directamente en tu base de datos

CREATE OR REPLACE FUNCTION ventas.obtener_ventas()
RETURNS TABLE (
  id INT,
  cliente_id INT,
  total NUMERIC,
  estado VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT id, cliente_id, total, estado, fecha_hora AS created_at, fecha_hora AS updated_at
  FROM ventas.venta;
END;
$$ LANGUAGE plpgsql;
