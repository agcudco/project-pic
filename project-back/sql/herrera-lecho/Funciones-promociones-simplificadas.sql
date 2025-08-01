-- Funciones SIMPLIFICADAS para el sistema de Promociones y Descuentos
-- SOLO para tabla promocion - Sin dependencias de otras tablas
-- Autor: Anahy Herrera - Kevin Lechon
-- Fecha: 31/07/2025

SET search_path = ventas, public;

-- ============================================================================
-- FUNCIONES CRUD BÁSICAS PARA PROMOCIONES ÚNICAMENTE
-- ============================================================================

-- 1. Obtener todas las promociones
CREATE OR REPLACE FUNCTION obtener_promociones()
RETURNS SETOF promocion AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM promocion
     ORDER BY fecha_inicio DESC;
END;
$$
LANGUAGE plpgsql;

-- 2. Obtener una promoción por ID
CREATE OR REPLACE FUNCTION obtener_promocion(p_id INT)
RETURNS promocion AS
$$
DECLARE
  promo promocion;
BEGIN
  SELECT *
    INTO promo
    FROM promocion
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
    p_fecha_fin DATE,
    p_activa BOOLEAN DEFAULT TRUE
)
RETURNS promocion AS
$$
DECLARE
  nueva_promocion promocion;
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

  INSERT INTO promocion(nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa)
       VALUES (p_nombre, p_tipo, p_valor, p_condicion_json, p_fecha_inicio, p_fecha_fin, p_activa)
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
RETURNS promocion AS
$$
DECLARE
  promocion_actualizada promocion;
BEGIN
  -- Validaciones
  IF p_tipo IS NOT NULL AND p_tipo NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %', p_tipo;
  END IF;
  
  -- Validar fechas si se proporcionan
  IF p_fecha_inicio IS NOT NULL AND p_fecha_fin IS NOT NULL AND p_fecha_inicio > p_fecha_fin THEN
    RAISE EXCEPTION 'La fecha de inicio no puede ser mayor a la fecha de fin';
  END IF;
  
  -- Validar valor si se proporciona
  IF p_valor IS NOT NULL AND p_valor <= 0 THEN
    RAISE EXCEPTION 'El valor de la promoción debe ser mayor a 0';
  END IF;

  UPDATE promocion 
     SET nombre = COALESCE(p_nombre, nombre),
         tipo = COALESCE(p_tipo, tipo),
         valor = COALESCE(p_valor, valor),
         condicion_json = COALESCE(p_condicion_json, condicion_json),
         fecha_inicio = COALESCE(p_fecha_inicio, fecha_inicio),
         fecha_fin = COALESCE(p_fecha_fin, fecha_fin),
         activa = COALESCE(p_activa, activa)
   WHERE id = p_id
  RETURNING * INTO promocion_actualizada;

  RETURN promocion_actualizada;
END;
$$
LANGUAGE plpgsql;

-- 5. Eliminar una promoción
CREATE OR REPLACE FUNCTION eliminar_promocion(p_id INT)
RETURNS promocion AS
$$
DECLARE
  promocion_eliminada promocion;
BEGIN
  DELETE FROM promocion 
   WHERE id = p_id
  RETURNING * INTO promocion_eliminada;

  RETURN promocion_eliminada;
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
     ORDER BY fecha_inicio DESC;
END;
$$
LANGUAGE plpgsql;

-- 7. Obtener promociones vigentes (activas y dentro del periodo)
CREATE OR REPLACE FUNCTION obtener_promociones_vigentes()
RETURNS SETOF promocion AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM promocion
     WHERE activa = TRUE 
       AND fecha_inicio <= CURRENT_DATE 
       AND fecha_fin >= CURRENT_DATE
     ORDER BY valor DESC; -- Las de mayor descuento primero
END;
$$
LANGUAGE plpgsql;

-- 8. Obtener promociones por tipo
CREATE OR REPLACE FUNCTION obtener_promociones_por_tipo(p_tipo VARCHAR)
RETURNS SETOF promocion AS
$$
BEGIN
  -- Validar tipo
  IF p_tipo NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %', p_tipo;
  END IF;

  RETURN QUERY
    SELECT * 
      FROM promocion
     WHERE tipo = p_tipo
       AND activa = TRUE
     ORDER BY fecha_inicio DESC;
END;
$$
LANGUAGE plpgsql;

-- 9. Activar una promoción
CREATE OR REPLACE FUNCTION activar_promocion(p_id INT)
RETURNS promocion AS
$$
DECLARE
  promocion_activada promocion;
BEGIN
  UPDATE promocion 
     SET activa = TRUE
   WHERE id = p_id
  RETURNING * INTO promocion_activada;

  RETURN promocion_activada;
END;
$$
LANGUAGE plpgsql;

-- 10. Desactivar una promoción
CREATE OR REPLACE FUNCTION desactivar_promocion(p_id INT)
RETURNS promocion AS
$$
DECLARE
  promocion_desactivada promocion;
BEGIN
  UPDATE promocion 
     SET activa = FALSE
   WHERE id = p_id
  RETURNING * INTO promocion_desactivada;

  RETURN promocion_desactivada;
END;
$$
LANGUAGE plpgsql;

-- 11. Función para calcular descuento (solo lógica de promoción)
CREATE OR REPLACE FUNCTION calcular_descuento_promocion(
    p_promocion_id INT,
    p_monto_base NUMERIC,
    p_cantidad INT DEFAULT 1
)
RETURNS TABLE(
    promocion_id INT,
    nombre_promocion VARCHAR,
    tipo_promocion VARCHAR,
    valor_descuento NUMERIC,
    monto_original NUMERIC,
    monto_descuento NUMERIC,
    monto_final NUMERIC
) AS
$$
DECLARE
  promo promocion;
  descuento_aplicado NUMERIC := 0;
BEGIN
  -- Obtener la promoción
  SELECT * INTO promo FROM promocion WHERE id = p_promocion_id AND activa = TRUE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Promoción no encontrada o inactiva';
  END IF;
  
  -- Verificar vigencia
  IF promo.fecha_inicio > CURRENT_DATE OR promo.fecha_fin < CURRENT_DATE THEN
    RAISE EXCEPTION 'Promoción no vigente';
  END IF;
  
  -- Calcular descuento según el tipo
  CASE promo.tipo
    WHEN 'monto_total' THEN
      descuento_aplicado := promo.valor;
    WHEN 'producto' THEN
      descuento_aplicado := (p_monto_base * promo.valor / 100) * p_cantidad;
    WHEN 'cantidad' THEN
      IF p_cantidad >= (promo.condicion_json->>'min_qty')::INT THEN
        descuento_aplicado := promo.valor;
      END IF;
    ELSE
      descuento_aplicado := promo.valor;
  END CASE;
  
  -- No permitir descuento mayor al monto base
  IF descuento_aplicado > p_monto_base THEN
    descuento_aplicado := p_monto_base;
  END IF;
  
  RETURN QUERY SELECT 
    promo.id,
    promo.nombre,
    promo.tipo,
    promo.valor,
    p_monto_base,
    descuento_aplicado,
    p_monto_base - descuento_aplicado;
END;
$$
LANGUAGE plpgsql;
