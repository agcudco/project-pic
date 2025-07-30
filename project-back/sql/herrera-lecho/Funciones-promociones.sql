-- Funciones para el sistema de Promociones y Descuentos
-- Compatible con el esquema 'ventas' existente
-- Autor: Herrera-Lecho
-- Fecha: 29/07/2025

SET search_path = ventas, public;

-- ============================================================================
-- FUNCIONES CRUD PARA PROMOCIONES (Trabajan con el esquema ventas)
-- ============================================================================

-- 1. Obtener todas las promociones
CREATE OR REPLACE FUNCTION obtener_promociones()
RETURNS SETOF ventas.promocion AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM ventas.promocion
     ORDER BY fecha_inicio DESC;
END;
$$
LANGUAGE plpgsql;

-- 2. Obtener una promoción por ID
CREATE OR REPLACE FUNCTION obtener_promocion(p_id INT)
RETURNS ventas.promocion AS
$$
DECLARE
  promo ventas.promocion;
BEGIN
  SELECT *
    INTO promo
    FROM ventas.promocion
   WHERE id = p_id;

  RETURN promo;
END;
$$
LANGUAGE plpgsql;

-- 3. Crear una nueva promoción
CREATE OR REPLACE FUNCTION crear_promocion(
    p_nombre VARCHAR,
    p_tipo VARCHAR,
    p_valor NUMERIC,
    p_condicion_json JSONB,
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS ventas.promocion AS
$$
DECLARE
  nueva_promocion ventas.promocion;
BEGIN
  -- Validar que el tipo sea válido
  IF p_tipo NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %', p_tipo;
  END IF;
  
  -- Validar fechas
  IF p_fecha_inicio > p_fecha_fin THEN
    RAISE EXCEPTION 'La fecha de inicio no puede ser mayor a la fecha de fin';
  END IF;
  
  -- Validar valor
  IF p_valor <= 0 THEN
    RAISE EXCEPTION 'El valor de la promoción debe ser mayor a 0';
  END IF;

  INSERT INTO ventas.promocion(nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin)
       VALUES (UPPER(p_nombre), p_tipo, p_valor, p_condicion_json, p_fecha_inicio, p_fecha_fin)
  RETURNING * INTO nueva_promocion;

  RETURN nueva_promocion;
END;
$$
LANGUAGE plpgsql;

-- 4. Actualizar una promoción
CREATE OR REPLACE FUNCTION actualizar_promocion(
    p_id INT,
    p_nombre VARCHAR,
    p_tipo VARCHAR,
    p_valor NUMERIC,
    p_condicion_json JSONB,
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_activa BOOLEAN
)
RETURNS ventas.promocion AS
$$
DECLARE
  promocion_actualizada ventas.promocion;
BEGIN
  -- Validaciones
  IF p_tipo NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %', p_tipo;
  END IF;
  
  IF p_fecha_inicio > p_fecha_fin THEN
    RAISE EXCEPTION 'La fecha de inicio no puede ser mayor a la fecha de fin';
  END IF;
  
  IF p_valor <= 0 THEN
    RAISE EXCEPTION 'El valor de la promoción debe ser mayor a 0';
  END IF;

  UPDATE ventas.promocion 
     SET nombre = UPPER(p_nombre),
         tipo = p_tipo,
         valor = p_valor,
         condicion_json = p_condicion_json,
         fecha_inicio = p_fecha_inicio,
         fecha_fin = p_fecha_fin,
         activa = p_activa
   WHERE id = p_id
  RETURNING * INTO promocion_actualizada;

  IF promocion_actualizada IS NULL THEN
    RAISE EXCEPTION 'No se encontró la promoción con ID: %', p_id;
  END IF;

  RETURN promocion_actualizada;
END;
$$
LANGUAGE plpgsql;

-- 5. Eliminar una promoción (soft delete)
CREATE OR REPLACE FUNCTION eliminar_promocion(p_id INT)
RETURNS BOOLEAN AS
$$
DECLARE
  filas_afectadas INT;
BEGIN
  UPDATE ventas.promocion 
     SET activa = FALSE
   WHERE id = p_id;
   
  GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
  
  RETURN filas_afectadas > 0;
END;
$$
LANGUAGE plpgsql;

-- 6. Obtener promociones activas
CREATE OR REPLACE FUNCTION obtener_promociones_activas()
RETURNS SETOF ventas.promocion AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM ventas.promocion
     WHERE activa = TRUE 
       AND fecha_inicio <= CURRENT_DATE 
       AND fecha_fin >= CURRENT_DATE
     ORDER BY valor DESC; -- Las de mayor descuento primero
END;
$$
LANGUAGE plpgsql;

-- 7. Obtener promociones por producto
CREATE OR REPLACE FUNCTION obtener_promociones_producto(p_producto_id INT)
RETURNS TABLE(
    promocion_id INT,
    nombre VARCHAR,
    tipo VARCHAR,
    valor NUMERIC,
    condicion_json JSONB,
    fecha_inicio DATE,
    fecha_fin DATE
) AS
$$
BEGIN
  RETURN QUERY
    SELECT p.id, p.nombre, p.tipo, p.valor, 
           p.condicion_json, p.fecha_inicio, p.fecha_fin
      FROM ventas.promocion p
      JOIN ventas.promocion_producto pp ON p.id = pp.promocion_id
     WHERE pp.producto_id = p_producto_id
       AND p.activa = TRUE
       AND p.fecha_inicio <= CURRENT_DATE 
       AND p.fecha_fin >= CURRENT_DATE
     ORDER BY p.valor DESC;
END;
$$
LANGUAGE plpgsql;

-- 8. Obtener promociones por categoría
CREATE OR REPLACE FUNCTION obtener_promociones_categoria(p_categoria_id INT)
RETURNS TABLE(
    promocion_id INT,
    nombre VARCHAR,
    tipo VARCHAR,
    valor NUMERIC,
    condicion_json JSONB,
    fecha_inicio DATE,
    fecha_fin DATE
) AS
$$
BEGIN
  RETURN QUERY
    SELECT p.id, p.nombre, p.tipo, p.valor, 
           p.condicion_json, p.fecha_inicio, p.fecha_fin
      FROM ventas.promocion p
      JOIN ventas.promocion_categoria pc ON p.id = pc.promocion_id
     WHERE pc.categoria_id = p_categoria_id
       AND p.activa = TRUE
       AND p.fecha_inicio <= CURRENT_DATE 
       AND p.fecha_fin >= CURRENT_DATE
     ORDER BY p.valor DESC;
END;
$$
LANGUAGE plpgsql;

-- 9. Asignar promoción a producto
CREATE OR REPLACE FUNCTION asignar_promocion_producto(
    p_promocion_id INT,
    p_producto_id INT
)
RETURNS ventas.promocion_producto AS
$$
DECLARE
  nueva_asignacion ventas.promocion_producto;
BEGIN
  -- Verificar que la promoción y el producto existen
  IF NOT EXISTS (SELECT 1 FROM ventas.promocion WHERE id = p_promocion_id) THEN
    RAISE EXCEPTION 'La promoción con ID % no existe', p_promocion_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM ventas.producto WHERE id = p_producto_id AND activo = TRUE) THEN
    RAISE EXCEPTION 'El producto con ID % no existe o no está activo', p_producto_id;
  END IF;

  INSERT INTO ventas.promocion_producto(promocion_id, producto_id)
       VALUES (p_promocion_id, p_producto_id)
  ON CONFLICT (promocion_id, producto_id) DO NOTHING
  RETURNING * INTO nueva_asignacion;

  -- Si no se insertó nada, obtener el registro existente
  IF nueva_asignacion IS NULL THEN
    SELECT * INTO nueva_asignacion
    FROM ventas.promocion_producto
    WHERE promocion_id = p_promocion_id AND producto_id = p_producto_id;
  END IF;

  RETURN nueva_asignacion;
END;
$$
LANGUAGE plpgsql;

-- 10. Asignar promoción a categoría
CREATE OR REPLACE FUNCTION asignar_promocion_categoria(
    p_promocion_id INT,
    p_categoria_id INT
)
RETURNS ventas.promocion_categoria AS
$$
DECLARE
  nueva_asignacion ventas.promocion_categoria;
BEGIN
  -- Verificar que la promoción y la categoría existen
  IF NOT EXISTS (SELECT 1 FROM ventas.promocion WHERE id = p_promocion_id) THEN
    RAISE EXCEPTION 'La promoción con ID % no existe', p_promocion_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM ventas.categoria WHERE id = p_categoria_id) THEN
    RAISE EXCEPTION 'La categoría con ID % no existe', p_categoria_id;
  END IF;

  INSERT INTO ventas.promocion_categoria(promocion_id, categoria_id)
       VALUES (p_promocion_id, p_categoria_id)
  ON CONFLICT (promocion_id, categoria_id) DO NOTHING
  RETURNING * INTO nueva_asignacion;

  -- Si no se insertó nada, obtener el registro existente
  IF nueva_asignacion IS NULL THEN
    SELECT * INTO nueva_asignacion
    FROM ventas.promocion_categoria
    WHERE promocion_id = p_promocion_id AND categoria_id = p_categoria_id;
  END IF;

  RETURN nueva_asignacion;
END;
$$
LANGUAGE plpgsql;

-- 11. Registrar aplicación de promoción en venta
CREATE OR REPLACE FUNCTION registrar_venta_promocion(
    p_venta_id INT,
    p_promocion_id INT,
    p_monto_descuento NUMERIC
)
RETURNS ventas.venta_promocion AS
$$
DECLARE
  nuevo_registro ventas.venta_promocion;
BEGIN
  -- Verificar que la venta y promoción existen
  IF NOT EXISTS (SELECT 1 FROM ventas.venta WHERE id = p_venta_id) THEN
    RAISE EXCEPTION 'La venta con ID % no existe', p_venta_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM ventas.promocion WHERE id = p_promocion_id) THEN
    RAISE EXCEPTION 'La promoción con ID % no existe', p_promocion_id;
  END IF;

  INSERT INTO ventas.venta_promocion(venta_id, promocion_id, monto_descuento)
       VALUES (p_venta_id, p_promocion_id, p_monto_descuento)
  RETURNING * INTO nuevo_registro;

  RETURN nuevo_registro;
END;
$$
LANGUAGE plpgsql;

-- 12. Inhabilitar promociones vencidas (función de mantenimiento)
CREATE OR REPLACE FUNCTION inhabilitar_promociones_vencidas()
RETURNS INT AS
$$
DECLARE
  filas_afectadas INT;
BEGIN
  UPDATE ventas.promocion 
     SET activa = FALSE
   WHERE activa = TRUE 
     AND fecha_fin < CURRENT_DATE;
   
  GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
  
  RETURN filas_afectadas;
END;
$$
LANGUAGE plpgsql;

-- 4. Actualizar una promoción
CREATE OR REPLACE FUNCTION actualizar_promocion(
    p_id INT,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_tipo VARCHAR,
    p_valor NUMERIC,
    p_condicion_json JSONB,
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_activa BOOLEAN
)
RETURNS promocion AS
$$
DECLARE
  promocion_actualizada promocion;
BEGIN
  -- Validar que el tipo sea válido
  IF p_tipo NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %', p_tipo;
  END IF;
  
  -- Validar fechas
  IF p_fecha_inicio > p_fecha_fin THEN
    RAISE EXCEPTION 'La fecha de inicio no puede ser mayor a la fecha de fin';
  END IF;
  
  -- Validar valor
  IF p_valor < 0 THEN
    RAISE EXCEPTION 'El valor de la promoción no puede ser negativo';
  END IF;

  UPDATE promocion 
     SET nombre = UPPER(p_nombre),
         descripcion = p_descripcion,
         tipo = p_tipo,
         valor = p_valor,
         condicion_json = p_condicion_json,
         fecha_inicio = p_fecha_inicio,
         fecha_fin = p_fecha_fin,
         activa = p_activa,
         fecha_modificacion = NOW()
   WHERE id = p_id
  RETURNING * INTO promocion_actualizada;

  IF promocion_actualizada IS NULL THEN
    RAISE EXCEPTION 'No se encontró la promoción con ID: %', p_id;
  END IF;

  RETURN promocion_actualizada;
END;
$$
LANGUAGE plpgsql;

-- 5. Eliminar una promoción (soft delete)
CREATE OR REPLACE FUNCTION eliminar_promocion(p_id INT)
RETURNS BOOLEAN AS
$$
DECLARE
  filas_afectadas INT;
BEGIN
  UPDATE promocion 
     SET activa = FALSE,
         fecha_modificacion = NOW()
   WHERE id = p_id;
   
  GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
  
  RETURN filas_afectadas > 0;
END;
$$
LANGUAGE plpgsql;

-- 6. Obtener promociones activas
CREATE OR REPLACE FUNCTION obtener_promociones_activas()
RETURNS SETOF promocion AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM promocion
     WHERE activa = TRUE 
       AND fecha_inicio <= CURRENT_DATE 
       AND fecha_fin >= CURRENT_DATE
     ORDER BY fecha_creacion DESC;
END;
$$
LANGUAGE plpgsql;

-- 7. Obtener promociones por producto
CREATE OR REPLACE FUNCTION obtener_promociones_producto(p_producto_id INT)
RETURNS TABLE(
    promocion_id INT,
    nombre VARCHAR,
    descripcion TEXT,
    tipo VARCHAR,
    valor NUMERIC,
    condicion_json JSONB,
    fecha_inicio DATE,
    fecha_fin DATE
) AS
$$
BEGIN
  RETURN QUERY
    SELECT p.id, p.nombre, p.descripcion, p.tipo, p.valor, 
           p.condicion_json, p.fecha_inicio, p.fecha_fin
      FROM promocion p
      JOIN promocion_producto pp ON p.id = pp.promocion_id
     WHERE pp.producto_id = p_producto_id
       AND p.activa = TRUE
       AND pp.activo = TRUE
       AND p.fecha_inicio <= CURRENT_DATE 
       AND p.fecha_fin >= CURRENT_DATE
     ORDER BY p.fecha_creacion DESC;
END;
$$
LANGUAGE plpgsql;

-- 8. Obtener promociones por categoría
CREATE OR REPLACE FUNCTION obtener_promociones_categoria(p_categoria_id INT)
RETURNS TABLE(
    promocion_id INT,
    nombre VARCHAR,
    descripcion TEXT,
    tipo VARCHAR,
    valor NUMERIC,
    condicion_json JSONB,
    fecha_inicio DATE,
    fecha_fin DATE
) AS
$$
BEGIN
  RETURN QUERY
    SELECT p.id, p.nombre, p.descripcion, p.tipo, p.valor, 
           p.condicion_json, p.fecha_inicio, p.fecha_fin
      FROM promocion p
      JOIN promocion_categoria pc ON p.id = pc.promocion_id
     WHERE pc.categoria_id = p_categoria_id
       AND p.activa = TRUE
       AND pc.activo = TRUE
       AND p.fecha_inicio <= CURRENT_DATE 
       AND p.fecha_fin >= CURRENT_DATE
     ORDER BY p.fecha_creacion DESC;
END;
$$
LANGUAGE plpgsql;

-- 9. Asignar promoción a producto
CREATE OR REPLACE FUNCTION asignar_promocion_producto(
    p_promocion_id INT,
    p_producto_id INT
)
RETURNS promocion_producto AS
$$
DECLARE
  nueva_asignacion promocion_producto;
BEGIN
  INSERT INTO promocion_producto(promocion_id, producto_id)
       VALUES (p_promocion_id, p_producto_id)
  ON CONFLICT (promocion_id, producto_id) 
  DO UPDATE SET activo = TRUE, fecha_asignacion = NOW()
  RETURNING * INTO nueva_asignacion;

  RETURN nueva_asignacion;
END;
$$
LANGUAGE plpgsql;

-- 10. Asignar promoción a categoría
CREATE OR REPLACE FUNCTION asignar_promocion_categoria(
    p_promocion_id INT,
    p_categoria_id INT
)
RETURNS promocion_categoria AS
$$
DECLARE
  nueva_asignacion promocion_categoria;
BEGIN
  INSERT INTO promocion_categoria(promocion_id, categoria_id)
       VALUES (p_promocion_id, p_categoria_id)
  ON CONFLICT (promocion_id, categoria_id) 
  DO UPDATE SET activo = TRUE, fecha_asignacion = NOW()
  RETURNING * INTO nueva_asignacion;

  RETURN nueva_asignacion;
END;
$$
LANGUAGE plpgsql;

-- 11. Registrar aplicación de promoción en venta
CREATE OR REPLACE FUNCTION registrar_venta_promocion(
    p_venta_id INT,
    p_promocion_id INT,
    p_monto_descuento NUMERIC,
    p_porcentaje_descuento NUMERIC DEFAULT NULL,
    p_detalles_aplicacion JSONB DEFAULT NULL
)
RETURNS venta_promocion AS
$$
DECLARE
  nuevo_registro venta_promocion;
BEGIN
  INSERT INTO venta_promocion(venta_id, promocion_id, monto_descuento, porcentaje_descuento, detalles_aplicacion)
       VALUES (p_venta_id, p_promocion_id, p_monto_descuento, p_porcentaje_descuento, p_detalles_aplicacion)
  RETURNING * INTO nuevo_registro;

  RETURN nuevo_registro;
END;
$$
LANGUAGE plpgsql;

-- 12. Calcular descuento por monto total
CREATE OR REPLACE FUNCTION calcular_descuento_monto_total(
    p_monto_total NUMERIC,
    p_promocion_id INT
)
RETURNS NUMERIC AS
$$
DECLARE
  promo promocion;
  monto_minimo NUMERIC;
  descuento NUMERIC := 0;
BEGIN
  SELECT * INTO promo FROM promocion WHERE id = p_promocion_id;
  
  IF promo IS NULL OR NOT promo.activa THEN
    RETURN 0;
  END IF;
  
  -- Obtener monto mínimo de las condiciones JSON
  IF promo.condicion_json IS NOT NULL THEN
    monto_minimo := (promo.condicion_json->>'monto_minimo')::NUMERIC;
    
    IF p_monto_total >= monto_minimo THEN
      descuento := (p_monto_total * promo.valor) / 100;
    END IF;
  END IF;
  
  RETURN descuento;
END;
$$
LANGUAGE plpgsql;

-- 13. Inhabilitar promociones vencidas (función de mantenimiento)
CREATE OR REPLACE FUNCTION inhabilitar_promociones_vencidas()
RETURNS INT AS
$$
DECLARE
  filas_afectadas INT;
BEGIN
  UPDATE promocion 
     SET activa = FALSE,
         fecha_modificacion = NOW()
   WHERE activa = TRUE 
     AND fecha_fin < CURRENT_DATE;
   
  GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
  
  RETURN filas_afectadas;
END;
$$
LANGUAGE plpgsql;
