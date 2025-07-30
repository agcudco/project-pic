CREATE OR REPLACE FUNCTION registrar_venta(
  p_cliente_id INT,
  p_productos INT[],
  p_cantidades INT[]
) RETURNS VOID AS $$
DECLARE
  v_venta_id INT;
  v_total NUMERIC := 0;
  i INT;
  v_precio_unitario NUMERIC;
BEGIN
  -- Calcular el total
  FOR i IN 1..array_length(p_productos, 1) LOOP
    SELECT precio_venta INTO v_precio_unitario FROM producto WHERE id = p_productos[i];
    v_total := v_total + (v_precio_unitario * p_cantidades[i]);
  END LOOP;

  -- Insertar en venta
  INSERT INTO venta (cliente_id, total) VALUES (p_cliente_id, v_total)
  RETURNING id INTO v_venta_id;

  -- Insertar en venta_detalle
  FOR i IN 1..array_length(p_productos, 1) LOOP
    SELECT precio_venta INTO v_precio_unitario FROM producto WHERE id = p_productos[i];
    INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario)
    VALUES (v_venta_id, p_productos[i], p_cantidades[i], v_precio_unitario);
  END LOOP;

  -- Insertar factura (opcional, con número generado automáticamente)
  INSERT INTO factura (venta_id, tipo, numero, monto_total)
  VALUES (v_venta_id, 'A', CONCAT('F-', v_venta_id), v_total);

END;
$$ LANGUAGE plpgsql;

--NOmbre:James Mena
