--Realizado por Elian Collaguazo

CREATE OR REPLACE FUNCTION actualizar_venta(
  p_venta_id INT,
  p_estado VARCHAR(20),   -- Nuevo estado de la venta
  p_total NUMERIC         -- Nuevo total de la venta
)
RETURNS VOID AS $$
DECLARE
  v_estado_actual VARCHAR(20);
BEGIN
  -- Verificar si la venta existe
  SELECT estado INTO v_estado_actual
  FROM venta
  WHERE id = p_venta_id;

  IF v_estado_actual IS NULL THEN
    RAISE EXCEPTION 'La venta con ID % no existe', p_venta_id;
  END IF;

  -- Verificar que el estado de la venta sea 'pendiente' para poder actualizar
  IF v_estado_actual <> 'pendiente' THEN
    RAISE EXCEPTION 'La venta con ID % no está en estado pendiente y no se puede actualizar', p_venta_id;
  END IF;

  -- Actualizar el estado y el total de la venta
  UPDATE venta
  SET estado = p_estado,
      total = p_total
  WHERE id = p_venta_id;

  -- Opcional: Actualizar la factura si el total cambia
  UPDATE factura
  SET monto_total = p_total
  WHERE venta_id = p_venta_id;

END;
$$ LANGUAGE plpgsql;