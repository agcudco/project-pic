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
  -- VALIDACIÓN 1: Campos obligatorios
  IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
    RAISE EXCEPTION 'El nombre de la promoción es obligatorio';
  END IF;
  
  IF p_tipo IS NULL THEN
    RAISE EXCEPTION 'El tipo de promoción es obligatorio';
  END IF;
  
  -- VALIDACIÓN 2: Longitud del nombre
  IF LENGTH(TRIM(p_nombre)) < 3 THEN
    RAISE EXCEPTION 'El nombre de la promoción debe tener al menos 3 caracteres';
  END IF;
  
  IF LENGTH(TRIM(p_nombre)) > 100 THEN
    RAISE EXCEPTION 'El nombre de la promoción no puede exceder 100 caracteres';
  END IF;
  
  -- VALIDACIÓN 3: Tipo válido
  IF p_tipo NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %. Tipos permitidos: producto, categoria, monto_total, cantidad', p_tipo;
  END IF;
  
  -- VALIDACIÓN 4: Fechas
  IF p_fecha_inicio IS NULL OR p_fecha_fin IS NULL THEN
    RAISE EXCEPTION 'Las fechas de inicio y fin son obligatorias';
  END IF;
  
  IF p_fecha_inicio > p_fecha_fin THEN
    RAISE EXCEPTION 'La fecha de inicio (%) no puede ser mayor a la fecha de fin (%)', p_fecha_inicio, p_fecha_fin;
  END IF;
  
  -- VALIDACIÓN 5: Fechas no pueden ser del pasado
  IF p_fecha_fin < CURRENT_DATE THEN
    RAISE EXCEPTION 'La fecha de fin no puede ser anterior a la fecha actual';
  END IF;
  
  -- VALIDACIÓN 6: Valor
  IF p_valor IS NULL THEN
    RAISE EXCEPTION 'El valor de la promoción es obligatorio';
  END IF;
  
  IF p_valor <= 0 THEN
    RAISE EXCEPTION 'El valor de la promoción debe ser mayor a 0';
  END IF;
  
  -- VALIDACIÓN 7: Límites por tipo de promoción
  IF p_tipo IN ('producto', 'categoria') AND p_valor > 100 THEN
    RAISE EXCEPTION 'Para promociones de tipo % el valor no puede exceder 100%%', p_tipo;
  END IF;
  
  IF p_tipo = 'monto_total' AND p_valor > 1000 THEN
    RAISE EXCEPTION 'Para promociones de monto total el valor no puede exceder $1000';
  END IF;
  
  -- VALIDACIÓN 8: Nombre único para promociones activas
  IF EXISTS (
    SELECT 1 FROM promocion 
    WHERE UPPER(TRIM(nombre)) = UPPER(TRIM(p_nombre)) 
    AND activa = TRUE 
    AND fecha_fin >= CURRENT_DATE
  ) THEN
    RAISE EXCEPTION 'Ya existe una promoción activa con el nombre "%"', p_nombre;
  END IF;
  
  -- VALIDACIÓN 9: Validar JSON de condiciones
  IF p_condicion_json IS NOT NULL THEN
    -- Verificar que sea un JSON válido (PostgreSQL ya lo valida automáticamente)
    -- Validaciones específicas por tipo
    IF p_tipo = 'cantidad' THEN
      IF p_condicion_json->>'min_qty' IS NULL THEN
        RAISE EXCEPTION 'Para promociones de tipo cantidad se requiere especificar min_qty en condicion_json';
      END IF;
      IF (p_condicion_json->>'min_qty')::INT <= 0 THEN
        RAISE EXCEPTION 'La cantidad mínima debe ser mayor a 0';
      END IF;
    END IF;
  END IF;

  INSERT INTO promocion(nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa)
       VALUES (TRIM(p_nombre), p_tipo, p_valor, p_condicion_json, p_fecha_inicio, p_fecha_fin, p_activa)
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
  promocion_existente promocion;
BEGIN
  -- VALIDACIÓN 1: ID obligatorio y existencia
  IF p_id IS NULL OR p_id <= 0 THEN
    RAISE EXCEPTION 'ID de promoción inválido';
  END IF;
  
  SELECT * INTO promocion_existente FROM promocion WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No existe una promoción con ID %', p_id;
  END IF;
  
  -- VALIDACIÓN 2: Nombre si se proporciona
  IF p_nombre IS NOT NULL THEN
    IF TRIM(p_nombre) = '' THEN
      RAISE EXCEPTION 'El nombre de la promoción no puede estar vacío';
    END IF;
    
    IF LENGTH(TRIM(p_nombre)) < 3 THEN
      RAISE EXCEPTION 'El nombre de la promoción debe tener al menos 3 caracteres';
    END IF;
    
    IF LENGTH(TRIM(p_nombre)) > 100 THEN
      RAISE EXCEPTION 'El nombre de la promoción no puede exceder 100 caracteres';
    END IF;
    
    -- Verificar nombre único (excluyendo la promoción actual)
    IF EXISTS (
      SELECT 1 FROM promocion 
      WHERE UPPER(TRIM(nombre)) = UPPER(TRIM(p_nombre)) 
      AND id != p_id
      AND activa = TRUE 
      AND fecha_fin >= CURRENT_DATE
    ) THEN
      RAISE EXCEPTION 'Ya existe otra promoción activa con el nombre "%"', p_nombre;
    END IF;
  END IF;
  
  -- VALIDACIÓN 3: Tipo si se proporciona
  IF p_tipo IS NOT NULL AND p_tipo NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %. Tipos permitidos: producto, categoria, monto_total, cantidad', p_tipo;
  END IF;
  
  -- VALIDACIÓN 4: Valor si se proporciona
  IF p_valor IS NOT NULL THEN
    IF p_valor <= 0 THEN
      RAISE EXCEPTION 'El valor de la promoción debe ser mayor a 0';
    END IF;
    
    -- Límites por tipo (usar tipo nuevo o existente)
    DECLARE
      tipo_a_validar VARCHAR := COALESCE(p_tipo, promocion_existente.tipo);
    BEGIN
      IF tipo_a_validar IN ('producto', 'categoria') AND p_valor > 100 THEN
        RAISE EXCEPTION 'Para promociones de tipo % el valor no puede exceder 100%%', tipo_a_validar;
      END IF;
      
      IF tipo_a_validar = 'monto_total' AND p_valor > 1000 THEN
        RAISE EXCEPTION 'Para promociones de monto total el valor no puede exceder $1000';
      END IF;
    END;
  END IF;
  
  -- VALIDACIÓN 5: Fechas si se proporcionan
  DECLARE
    fecha_inicio_validar DATE := COALESCE(p_fecha_inicio, promocion_existente.fecha_inicio);
    fecha_fin_validar DATE := COALESCE(p_fecha_fin, promocion_existente.fecha_fin);
  BEGIN
    IF fecha_inicio_validar > fecha_fin_validar THEN
      RAISE EXCEPTION 'La fecha de inicio (%) no puede ser mayor a la fecha de fin (%)', fecha_inicio_validar, fecha_fin_validar;
    END IF;
    
    -- No permitir actualizar fechas si la promoción ya empezó (solo si está activa)
    IF promocion_existente.activa = TRUE AND promocion_existente.fecha_inicio <= CURRENT_DATE THEN
      IF p_fecha_inicio IS NOT NULL AND p_fecha_inicio != promocion_existente.fecha_inicio THEN
        RAISE EXCEPTION 'No se puede modificar la fecha de inicio de una promoción que ya comenzó';
      END IF;
    END IF;
    
    -- Fecha fin no puede ser del pasado
    IF p_fecha_fin IS NOT NULL AND p_fecha_fin < CURRENT_DATE THEN
      RAISE EXCEPTION 'La fecha de fin no puede ser anterior a la fecha actual';
    END IF;
  END;
  
  -- VALIDACIÓN 6: JSON de condiciones si se proporciona
  IF p_condicion_json IS NOT NULL THEN
    DECLARE
      tipo_para_json VARCHAR := COALESCE(p_tipo, promocion_existente.tipo);
    BEGIN
      IF tipo_para_json = 'cantidad' THEN
        IF p_condicion_json->>'min_qty' IS NULL THEN
          RAISE EXCEPTION 'Para promociones de tipo cantidad se requiere especificar min_qty en condicion_json';
        END IF;
        IF (p_condicion_json->>'min_qty')::INT <= 0 THEN
          RAISE EXCEPTION 'La cantidad mínima debe ser mayor a 0';
        END IF;
      END IF;
    END;
  END IF;

  UPDATE promocion 
     SET nombre = COALESCE(TRIM(p_nombre), nombre),
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
  promocion_existente promocion;
BEGIN
  -- VALIDACIÓN 1: ID obligatorio
  IF p_id IS NULL OR p_id <= 0 THEN
    RAISE EXCEPTION 'ID de promoción inválido';
  END IF;
  
  -- VALIDACIÓN 2: Verificar existencia
  SELECT * INTO promocion_existente FROM promocion WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No existe una promoción con ID %', p_id;
  END IF;
  
  -- VALIDACIÓN 3: No eliminar promociones activas que ya comenzaron
  IF promocion_existente.activa = TRUE 
     AND promocion_existente.fecha_inicio <= CURRENT_DATE 
     AND promocion_existente.fecha_fin >= CURRENT_DATE THEN
    RAISE EXCEPTION 'No se puede eliminar una promoción que está activa y vigente. Considere desactivarla en su lugar.';
  END IF;
  
  -- VALIDACIÓN 4: Advertencia para promociones con fecha futura
  IF promocion_existente.activa = TRUE 
     AND promocion_existente.fecha_inicio > CURRENT_DATE THEN
    RAISE NOTICE 'Eliminando promoción programada para el futuro: %', promocion_existente.nombre;
  END IF;

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
  -- VALIDACIÓN 1: Tipo obligatorio
  IF p_tipo IS NULL OR TRIM(p_tipo) = '' THEN
    RAISE EXCEPTION 'El tipo de promoción es obligatorio';
  END IF;
  
  -- VALIDACIÓN 2: Tipo válido
  IF TRIM(LOWER(p_tipo)) NOT IN ('producto', 'categoria', 'monto_total', 'cantidad') THEN
    RAISE EXCEPTION 'Tipo de promoción no válido: %. Tipos permitidos: producto, categoria, monto_total, cantidad', p_tipo;
  END IF;

  RETURN QUERY
    SELECT * 
      FROM promocion
     WHERE LOWER(tipo) = LOWER(TRIM(p_tipo))
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
  promocion_existente promocion;
BEGIN
  -- VALIDACIÓN 1: ID obligatorio
  IF p_id IS NULL OR p_id <= 0 THEN
    RAISE EXCEPTION 'ID de promoción inválido';
  END IF;
  
  -- VALIDACIÓN 2: Verificar existencia
  SELECT * INTO promocion_existente FROM promocion WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No existe una promoción con ID %', p_id;
  END IF;
  
  -- VALIDACIÓN 3: Ya está activa
  IF promocion_existente.activa = TRUE THEN
    RAISE NOTICE 'La promoción "%" ya está activa', promocion_existente.nombre;
    RETURN promocion_existente;
  END IF;
  
  -- VALIDACIÓN 4: Verificar vigencia de fechas
  IF promocion_existente.fecha_fin < CURRENT_DATE THEN
    RAISE EXCEPTION 'No se puede activar una promoción cuya fecha de fin (%) ya expiró', promocion_existente.fecha_fin;
  END IF;
  
  -- VALIDACIÓN 5: Verificar conflictos de nombres con otras promociones activas
  IF EXISTS (
    SELECT 1 FROM promocion 
    WHERE UPPER(TRIM(nombre)) = UPPER(TRIM(promocion_existente.nombre))
    AND id != p_id
    AND activa = TRUE 
    AND fecha_fin >= CURRENT_DATE
  ) THEN
    RAISE EXCEPTION 'No se puede activar: ya existe otra promoción activa con el nombre "%"', promocion_existente.nombre;
  END IF;

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
  promocion_existente promocion;
BEGIN
  -- VALIDACIÓN 1: ID obligatorio
  IF p_id IS NULL OR p_id <= 0 THEN
    RAISE EXCEPTION 'ID de promoción inválido';
  END IF;
  
  -- VALIDACIÓN 2: Verificar existencia
  SELECT * INTO promocion_existente FROM promocion WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No existe una promoción con ID %', p_id;
  END IF;
  
  -- VALIDACIÓN 3: Ya está inactiva
  IF promocion_existente.activa = FALSE THEN
    RAISE NOTICE 'La promoción "%" ya está inactiva', promocion_existente.nombre;
    RETURN promocion_existente;
  END IF;
  
  -- VALIDACIÓN 4: Confirmar desactivación si está vigente
  IF promocion_existente.fecha_inicio <= CURRENT_DATE 
     AND promocion_existente.fecha_fin >= CURRENT_DATE THEN
    RAISE NOTICE 'Desactivando promoción vigente: "%" (activa desde % hasta %)', 
                 promocion_existente.nombre, 
                 promocion_existente.fecha_inicio, 
                 promocion_existente.fecha_fin;
  END IF;

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
  -- VALIDACIÓN 1: Parámetros obligatorios
  IF p_promocion_id IS NULL OR p_promocion_id <= 0 THEN
    RAISE EXCEPTION 'ID de promoción inválido';
  END IF;
  
  IF p_monto_base IS NULL OR p_monto_base <= 0 THEN
    RAISE EXCEPTION 'El monto base debe ser mayor a 0';
  END IF;
  
  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'La cantidad debe ser mayor a 0';
  END IF;
  
  -- VALIDACIÓN 2: Obtener la promoción
  SELECT * INTO promo FROM promocion WHERE id = p_promocion_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Promoción con ID % no encontrada', p_promocion_id;
  END IF;
  
  -- VALIDACIÓN 3: Promoción activa
  IF promo.activa = FALSE THEN
    RAISE EXCEPTION 'La promoción "%" está inactiva', promo.nombre;
  END IF;
  
  -- VALIDACIÓN 4: Verificar vigencia
  IF promo.fecha_inicio > CURRENT_DATE THEN
    RAISE EXCEPTION 'La promoción "%" aún no ha iniciado (inicia el %)', promo.nombre, promo.fecha_inicio;
  END IF;
  
  IF promo.fecha_fin < CURRENT_DATE THEN
    RAISE EXCEPTION 'La promoción "%" ya expiró (terminó el %)', promo.nombre, promo.fecha_fin;
  END IF;
  
  -- VALIDACIÓN 5: Calcular descuento según el tipo
  CASE promo.tipo
    WHEN 'monto_total' THEN
      descuento_aplicado := promo.valor;
    WHEN 'producto' THEN
      -- Validar que el valor sea un porcentaje válido
      IF promo.valor > 100 THEN
        RAISE EXCEPTION 'El porcentaje de descuento no puede ser mayor a 100%%';
      END IF;
      descuento_aplicado := (p_monto_base * promo.valor / 100) * p_cantidad;
    WHEN 'categoria' THEN
      -- Validar que el valor sea un porcentaje válido
      IF promo.valor > 100 THEN
        RAISE EXCEPTION 'El porcentaje de descuento no puede ser mayor a 100%%';
      END IF;
      descuento_aplicado := (p_monto_base * promo.valor / 100) * p_cantidad;
    WHEN 'cantidad' THEN
      -- Validar condiciones de cantidad
      IF promo.condicion_json IS NULL OR promo.condicion_json->>'min_qty' IS NULL THEN
        RAISE EXCEPTION 'Promoción de cantidad mal configurada: falta min_qty en condiciones';
      END IF;
      
      DECLARE
        min_qty INT := (promo.condicion_json->>'min_qty')::INT;
      BEGIN
        IF p_cantidad >= min_qty THEN
          descuento_aplicado := promo.valor;
        ELSE
          RAISE NOTICE 'Cantidad insuficiente para aplicar descuento. Mínimo requerido: %, cantidad actual: %', min_qty, p_cantidad;
          descuento_aplicado := 0;
        END IF;
      END;
    ELSE
      RAISE EXCEPTION 'Tipo de promoción no reconocido: %', promo.tipo;
  END CASE;
  
  -- VALIDACIÓN 6: No permitir descuento mayor al monto base
  IF descuento_aplicado > p_monto_base THEN
    RAISE NOTICE 'Descuento calculado (%) excede el monto base (%). Aplicando descuento máximo.', descuento_aplicado, p_monto_base;
    descuento_aplicado := p_monto_base;
  END IF;
  
  -- VALIDACIÓN 7: Monto final no puede ser negativo
  DECLARE
    monto_final_calc NUMERIC := p_monto_base - descuento_aplicado;
  BEGIN
    IF monto_final_calc < 0 THEN
      descuento_aplicado := p_monto_base;
      monto_final_calc := 0;
    END IF;
    
    RETURN QUERY SELECT 
      promo.id,
      promo.nombre,
      promo.tipo,
      promo.valor,
      p_monto_base,
      descuento_aplicado,
      monto_final_calc;
  END;
END;
$$
LANGUAGE plpgsql;
