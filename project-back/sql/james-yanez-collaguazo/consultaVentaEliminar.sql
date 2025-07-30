
/*Realizado por Karen Yanez
*/
CREATE OR REPLACE FUNCTION anular_venta(p_venta_id INT)
RETURNS VOID AS $$
DECLARE
  v_estado VARCHAR(20);
  v_cantidad INT;
  v_producto_id INT;
BEGIN
  SELECT estado INTO v_estado
  FROM venta
  WHERE id = p_venta_id;

  IF v_estado IS NULL THEN
    RAISE EXCEPTION 'La venta con ID % no existe', p_venta_id;
  END IF;

  IF v_estado <> 'PAGADO' THEN
    RAISE EXCEPTION 'La venta con ID % no está confirmada o ya está anulada', p_venta_id;
  END IF;

  FOR v_producto_id, v_cantidad IN
    SELECT producto_id, cantidad
    FROM venta_detalle
    WHERE venta_id = p_venta_id
  LOOP
    UPDATE producto
    SET stock = stock + v_cantidad
    WHERE id = v_producto_id;
  END LOOP;
  UPDATE venta
  SET estado = 'ANULADA'
  WHERE id = p_venta_id;
  DELETE FROM factura
  WHERE venta_id = p_venta_id;

END;
$$ LANGUAGE plpgsql;