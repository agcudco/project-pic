
--Realizado por James Mena
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
    SELECT precio_venta INTO v_precio_unitario 
    FROM producto 
    WHERE id = p_productos[i];
    v_total := v_total + (v_precio_unitario * p_cantidades[i]);
  END LOOP;

  -- Insertar en venta con estado 'confirmada'
  INSERT INTO venta (cliente_id, total, estado) 
  VALUES (p_cliente_id, v_total, 'confirmada')
  RETURNING id INTO v_venta_id;

  -- Insertar en venta_detalle
  FOR i IN 1..array_length(p_productos, 1) LOOP
    SELECT precio_venta INTO v_precio_unitario 
    FROM producto 
    WHERE id = p_productos[i];
    INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario)
    VALUES (v_venta_id, p_productos[i], p_cantidades[i], v_precio_unitario);
  END LOOP;

  -- Insertar factura (opcional, con número generado automáticamente)
  INSERT INTO factura (venta_id, tipo, numero, monto_total)
  VALUES (v_venta_id, 'A', CONCAT('F-', v_venta_id), v_total);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION obtener_venta_por_id(venta_id INT)
RETURNS TABLE (id INT, cliente_id INT, total DECIMAL, estado VARCHAR, created_at TIMESTAMP, updated_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  SELECT v.id, v.cliente_id, v.total, v.estado, v.created_at, v.updated_at
  FROM ventas v
  WHERE v.id = venta_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_ventas()
RETURNS TABLE (
    id INT,
    cliente_nombre VARCHAR,
    total DECIMAL,
    estado VARCHAR,
    fecha_hora TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    CASE 
      WHEN c.tipo = 'empresa' THEN c.razon_social
      ELSE u.nombres || ' ' || u.apellidos
    END AS cliente_nombre,
    v.total,
    v.estado,
    v.fecha_hora
  FROM venta v
  JOIN cliente c ON v.cliente_id = c.id
  JOIN usuario u ON c.usuario_id = u.id
  ORDER BY v.fecha_hora DESC;
END;
$$ LANGUAGE plpgsql;

--REALIZADO POR ELIAN COLLAGUAZO 
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


--REALIZADO POR KAREN YANEZ
CREATE OR REPLACE FUNCTION anular_venta(p_venta_id INT)
RETURNS VOID AS $$
DECLARE
  v_estado VARCHAR(20);
  v_cantidad INT;
  v_producto_id INT;
BEGIN
  -- Verificar si la venta existe y obtener su estado
  SELECT estado INTO v_estado
  FROM venta
  WHERE id = p_venta_id;

  IF v_estado IS NULL THEN
    RAISE EXCEPTION 'La venta con ID % no existe', p_venta_id;
  END IF;

  -- Solo se puede anular si está confirmada
  IF v_estado <> 'confirmada' THEN
    RAISE EXCEPTION 'La venta con ID % no está confirmada o ya fue anulada', p_venta_id;
  END IF;

  -- Devolver el stock de los productos vendidos
  FOR v_producto_id, v_cantidad IN
    SELECT producto_id, cantidad
    FROM venta_detalle
    WHERE venta_id = p_venta_id
  LOOP
    UPDATE producto
    SET stock = stock + v_cantidad
    WHERE id = v_producto_id;
  END LOOP;

  -- Cambiar estado de la venta a 'anulada'
  UPDATE venta
  SET estado = 'anulada'
  WHERE id = p_venta_id;

  -- Eliminar la factura asociada
  DELETE FROM factura
  WHERE venta_id = p_venta_id;

END;
$$ LANGUAGE plpgsql;


--REALIZADO POR JAMES MENA
CREATE OR REPLACE FUNCTION ver_detalle_venta_limpia(p_venta_id INT)
RETURNS TABLE (
  producto VARCHAR,
  cantidad INT,
  precio_unitario NUMERIC,
  subtotal NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.nombre AS producto,
    vd.cantidad,
    vd.precio_unitario,
    vd.cantidad * vd.precio_unitario AS subtotal
  FROM venta_detalle vd
  JOIN producto p ON vd.producto_id = p.id
  WHERE vd.venta_id = p_venta_id;
END;
$$ LANGUAGE plpgsql;


--REALIZADO POR KAREN YANEZ

CREATE OR REPLACE FUNCTION ver_factura_simple(p_venta_id INT)
RETURNS TABLE (
  nombre_cliente TEXT,
  email_cliente VARCHAR,
  nombre_producto VARCHAR,
  cantidad INT,
  precio_unitario NUMERIC,
  subtotal_producto NUMERIC,
  numero_factura VARCHAR,
  fecha_emision DATE,
  monto_total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.nombres || ' ' || u.apellidos AS nombre_cliente,
    u.email AS email_cliente,
    p.nombre AS nombre_producto,
    vd.cantidad,
    vd.precio_unitario,
    (vd.cantidad * vd.precio_unitario) AS subtotal_producto,
    f.numero AS numero_factura,
    f.fecha_emision,
    f.monto_total
  FROM factura f
  JOIN venta v ON f.venta_id = v.id
  JOIN cliente c ON v.cliente_id = c.id
  JOIN usuario u ON c.usuario_id = u.id
  JOIN venta_detalle vd ON v.id = vd.venta_id
  JOIN producto p ON p.id = vd.producto_id
  WHERE f.venta_id = p_venta_id;
END;
$$ LANGUAGE plpgsql;