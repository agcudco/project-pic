-- Triggers y Validaciones para el sistema de Promociones y Descuentos
-- Autor: Herrera-Lecho
-- Fecha: 29/07/2025

SET search_path = public;

-- ============================================================================
-- TRIGGERS PARA AUDITORÍA Y VALIDACIONES
-- ============================================================================

-- 1. Trigger para actualizar fecha_modificacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS
$$
BEGIN
  NEW.fecha_modificacion = NOW();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_promocion_fecha_modificacion
  BEFORE UPDATE ON promocion
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_modificacion();

-- 2. Trigger para validar que no se apliquen múltiples promociones del mismo tipo al mismo producto
CREATE OR REPLACE FUNCTION validar_promocion_unica_producto()
RETURNS TRIGGER AS
$$
BEGIN
  -- Verificar si ya existe una promoción activa del mismo tipo para el mismo producto
  IF EXISTS (
    SELECT 1 
    FROM promocion_producto pp1
    JOIN promocion p1 ON pp1.promocion_id = p1.id
    JOIN promocion_producto pp2 ON pp2.producto_id = pp1.producto_id
    JOIN promocion p2 ON pp2.promocion_id = p2.id
    WHERE pp1.producto_id = NEW.producto_id
      AND pp2.promocion_id = NEW.promocion_id
      AND p1.tipo = p2.tipo
      AND p1.activa = TRUE
      AND p2.activa = TRUE
      AND pp1.activo = TRUE
      AND pp2.activo = TRUE
      AND pp1.promocion_id != pp2.promocion_id
      AND (p1.fecha_inicio <= p2.fecha_fin AND p1.fecha_fin >= p2.fecha_inicio)
  ) THEN
    RAISE EXCEPTION 'Ya existe una promoción activa del mismo tipo para este producto en el período especificado';
  END IF;
  
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_promocion_unica_producto
  BEFORE INSERT OR UPDATE ON promocion_producto
  FOR EACH ROW
  EXECUTE FUNCTION validar_promocion_unica_producto();

-- 3. Trigger para validar fechas de promociones
CREATE OR REPLACE FUNCTION validar_fechas_promocion()
RETURNS TRIGGER AS
$$
BEGIN
  -- Validar que la fecha de inicio no sea mayor que la fecha de fin
  IF NEW.fecha_inicio > NEW.fecha_fin THEN
    RAISE EXCEPTION 'La fecha de inicio (%) no puede ser mayor que la fecha de fin (%)', 
                    NEW.fecha_inicio, NEW.fecha_fin;
  END IF;
  
  -- Validar que la fecha de fin no sea muy antigua (más de 1 año atrás)
  IF NEW.fecha_fin < CURRENT_DATE - INTERVAL '1 year' THEN
    RAISE EXCEPTION 'La fecha de fin no puede ser anterior a un año desde hoy';
  END IF;
  
  -- Validar que la promoción no sea demasiado larga (más de 1 año)
  IF NEW.fecha_fin > NEW.fecha_inicio + INTERVAL '1 year' THEN
    RAISE EXCEPTION 'La duración de la promoción no puede exceder 1 año';
  END IF;
  
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_fechas_promocion
  BEFORE INSERT OR UPDATE ON promocion
  FOR EACH ROW
  EXECUTE FUNCTION validar_fechas_promocion();

-- 4. Trigger para log de cambios en promociones (auditoría)
CREATE TABLE promocion_auditoria (
    id SERIAL PRIMARY KEY,
    promocion_id INT,
    operacion VARCHAR(10), -- INSERT, UPDATE, DELETE
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    usuario VARCHAR(50), -- Se puede obtener del contexto de la aplicación
    fecha_cambio TIMESTAMP DEFAULT NOW(),
    direccion_ip INET
);

CREATE OR REPLACE FUNCTION log_cambios_promocion()
RETURNS TRIGGER AS
$$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO promocion_auditoria (promocion_id, operacion, datos_nuevos)
    VALUES (NEW.id, 'INSERT', row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO promocion_auditoria (promocion_id, operacion, datos_anteriores, datos_nuevos)
    VALUES (NEW.id, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO promocion_auditoria (promocion_id, operacion, datos_anteriores)
    VALUES (OLD.id, 'DELETE', row_to_json(OLD)::jsonb);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_log_cambios_promocion
  AFTER INSERT OR UPDATE OR DELETE ON promocion
  FOR EACH ROW
  EXECUTE FUNCTION log_cambios_promocion();

-- ============================================================================
-- FUNCIONES DE VALIDACIÓN AVANZADAS
-- ============================================================================

-- 5. Función para validar reglas de negocio antes de aplicar promoción
CREATE OR REPLACE FUNCTION validar_aplicacion_promocion(
    p_promocion_id INT,
    p_producto_id INT DEFAULT NULL,
    p_precio_producto NUMERIC DEFAULT NULL,
    p_costo_producto NUMERIC DEFAULT NULL,
    p_monto_total NUMERIC DEFAULT NULL
)
RETURNS TABLE(
    es_valida BOOLEAN,
    mensaje_error TEXT,
    descuento_calculado NUMERIC
) AS
$$
DECLARE
  promo promocion;
  descuento NUMERIC := 0;
  precio_final NUMERIC;
BEGIN
  -- Obtener datos de la promoción desde la tabla del sistema ventas
  SELECT * INTO promo FROM ventas.promocion WHERE id = p_promocion_id;
  
  -- Validar que la promoción existe y está activa
  IF promo IS NULL THEN
    RETURN QUERY SELECT FALSE, 'La promoción no existe', 0::NUMERIC;
    RETURN;
  END IF;
  
  IF NOT promo.activa THEN
    RETURN QUERY SELECT FALSE, 'La promoción no está activa', 0::NUMERIC;
    RETURN;
  END IF;
  
  -- Validar fechas de vigencia
  IF CURRENT_DATE < promo.fecha_inicio THEN
    RETURN QUERY SELECT FALSE, 'La promoción aún no ha iniciado', 0::NUMERIC;
    RETURN;
  END IF;
  
  IF CURRENT_DATE > promo.fecha_fin THEN
    RETURN QUERY SELECT FALSE, 'La promoción ya ha vencido', 0::NUMERIC;
    RETURN;
  END IF;
  
  -- Calcular descuento según el tipo de promoción
  CASE promo.tipo
    WHEN 'producto' THEN
      IF p_precio_producto IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Se requiere el precio del producto', 0::NUMERIC;
        RETURN;
      END IF;
      descuento := (p_precio_producto * promo.valor) / 100;
      
    WHEN 'categoria' THEN
      IF p_precio_producto IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Se requiere el precio del producto', 0::NUMERIC;
        RETURN;
      END IF;
      descuento := (p_precio_producto * promo.valor) / 100;
      
    WHEN 'monto_total' THEN
      IF p_monto_total IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Se requiere el monto total de la compra', 0::NUMERIC;
        RETURN;
      END IF;
      
      -- Verificar si cumple el monto mínimo
      IF promo.condicion_json IS NOT NULL AND 
         promo.condicion_json ? 'monto_minimo' THEN
        IF p_monto_total < (promo.condicion_json->>'monto_minimo')::NUMERIC THEN
          RETURN QUERY SELECT FALSE, 
            'El monto total no cumple con el mínimo requerido: $' || (promo.condicion_json->>'monto_minimo'), 
            0::NUMERIC;
          RETURN;
        END IF;
      END IF;
      
      descuento := (p_monto_total * promo.valor) / 100;
      
    WHEN 'cantidad' THEN
      -- Para promociones por cantidad, el descuento se calcula diferente
      IF p_precio_producto IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Se requiere el precio del producto', 0::NUMERIC;
        RETURN;
      END IF;
      descuento := (p_precio_producto * promo.valor) / 100;
      
    ELSE
      RETURN QUERY SELECT FALSE, 'Tipo de promoción no válido', 0::NUMERIC;
      RETURN;
  END CASE;
  
  -- Validar que el precio final no sea menor al costo
  IF p_costo_producto IS NOT NULL AND p_precio_producto IS NOT NULL THEN
    precio_final := p_precio_producto - descuento;
    IF precio_final < p_costo_producto THEN
      RETURN QUERY SELECT FALSE, 
        'El descuento haría que el precio final sea menor al costo del producto', 
        0::NUMERIC;
      RETURN;
    END IF;
  END IF;
  
  -- Si llegamos aquí, la validación fue exitosa
  RETURN QUERY SELECT TRUE, 'Promoción válida'::TEXT, descuento;
END;
$$
LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIONES DE DESCUENTOS INTERNOS
-- ============================================================================

-- Función para calcular descuentos automáticos en productos
CREATE OR REPLACE FUNCTION calcular_descuento_producto(
    p_producto_id INT,
    p_precio_unitario NUMERIC,
    p_cantidad INT DEFAULT 1
)
RETURNS TABLE(
    descuento_total NUMERIC,
    precio_final NUMERIC,
    promociones_aplicadas TEXT[],
    detalles_descuento JSONB
) AS
$$
DECLARE
  producto_record RECORD;
  promocion_record RECORD;
  descuento_acumulado NUMERIC := 0;
  precio_con_descuento NUMERIC;
  promociones_array TEXT[] := '{}';
  detalles JSONB := '{}';
BEGIN
  -- Obtener información del producto
  SELECT p.*, c.nombre as categoria_nombre 
  INTO producto_record
  FROM ventas.producto p
  LEFT JOIN ventas.producto_categoria pc ON p.id = pc.producto_id
  LEFT JOIN ventas.categoria c ON pc.categoria_id = c.id
  WHERE p.id = p_producto_id AND p.activo = TRUE;
  
  IF producto_record IS NULL THEN
    RETURN QUERY SELECT 0::NUMERIC, p_precio_unitario, promociones_array, detalles;
    RETURN;
  END IF;
  
  precio_con_descuento := p_precio_unitario;
  
  -- Buscar promociones por producto específico
  FOR promocion_record IN 
    SELECT p.*, 'producto' as origen
    FROM ventas.promocion p
    JOIN ventas.promocion_producto pp ON p.id = pp.promocion_id
    WHERE pp.producto_id = p_producto_id
      AND p.activa = TRUE
      AND p.fecha_inicio <= CURRENT_DATE
      AND p.fecha_fin >= CURRENT_DATE
    ORDER BY p.valor DESC -- Aplicar primero los descuentos mayores
  LOOP
    DECLARE
      validacion_result RECORD;
      descuento_individual NUMERIC;
    BEGIN
      -- Validar si se puede aplicar el descuento
      SELECT * INTO validacion_result
      FROM validar_aplicacion_promocion(
        promocion_record.id, 
        p_producto_id, 
        precio_con_descuento, 
        producto_record.costo
      );
      
      IF validacion_result.es_valida THEN
        descuento_individual := validacion_result.descuento_calculado;
        descuento_acumulado := descuento_acumulado + descuento_individual;
        precio_con_descuento := precio_con_descuento - descuento_individual;
        
        -- Agregar a la lista de promociones aplicadas
        promociones_array := array_append(promociones_array, promocion_record.nombre);
        
        -- Agregar detalles
        detalles := detalles || jsonb_build_object(
          'promocion_' || promocion_record.id::text,
          jsonb_build_object(
            'nombre', promocion_record.nombre,
            'tipo', promocion_record.tipo,
            'descuento', descuento_individual,
            'porcentaje', promocion_record.valor
          )
        );
      END IF;
    END;
  END LOOP;
  
  -- Buscar promociones por categoría
  FOR promocion_record IN 
    SELECT p.*, 'categoria' as origen
    FROM ventas.promocion p
    JOIN ventas.promocion_categoria pc ON p.id = pc.promocion_id
    JOIN ventas.producto_categoria prc ON pc.categoria_id = prc.categoria_id
    WHERE prc.producto_id = p_producto_id
      AND p.activa = TRUE
      AND p.fecha_inicio <= CURRENT_DATE
      AND p.fecha_fin >= CURRENT_DATE
      AND p.id NOT IN (
        -- Evitar duplicados si ya se aplicó por producto
        SELECT pr.id FROM ventas.promocion pr
        JOIN ventas.promocion_producto pp ON pr.id = pp.promocion_id
        WHERE pp.producto_id = p_producto_id
      )
    ORDER BY p.valor DESC
  LOOP
    DECLARE
      validacion_result RECORD;
      descuento_individual NUMERIC;
    BEGIN
      SELECT * INTO validacion_result
      FROM validar_aplicacion_promocion(
        promocion_record.id, 
        p_producto_id, 
        precio_con_descuento, 
        producto_record.costo
      );
      
      IF validacion_result.es_valida THEN
        descuento_individual := validacion_result.descuento_calculado;
        descuento_acumulado := descuento_acumulado + descuento_individual;
        precio_con_descuento := precio_con_descuento - descuento_individual;
        
        promociones_array := array_append(promociones_array, promocion_record.nombre);
        
        detalles := detalles || jsonb_build_object(
          'promocion_' || promocion_record.id::text,
          jsonb_build_object(
            'nombre', promocion_record.nombre,
            'tipo', promocion_record.tipo,
            'descuento', descuento_individual,
            'porcentaje', promocion_record.valor
          )
        );
      END IF;
    END;
  END LOOP;
  
  -- Aplicar cantidad si es relevante
  descuento_acumulado := descuento_acumulado * p_cantidad;
  precio_con_descuento := p_precio_unitario - (descuento_acumulado / p_cantidad);
  
  RETURN QUERY SELECT 
    descuento_acumulado,
    precio_con_descuento,
    promociones_array,
    detalles;
END;
$$
LANGUAGE plpgsql;

-- Función para calcular descuentos por monto total de venta
CREATE OR REPLACE FUNCTION calcular_descuento_por_monto_total(
    p_monto_total NUMERIC
)
RETURNS TABLE(
    descuento_aplicable NUMERIC,
    promocion_id INT,
    promocion_nombre VARCHAR,
    condiciones_cumplidas BOOLEAN
) AS
$$
DECLARE
  promocion_record RECORD;
  mejor_descuento NUMERIC := 0;
  mejor_promocion INT := NULL;
  mejor_nombre VARCHAR := NULL;
BEGIN
  -- Buscar promociones por monto total
  FOR promocion_record IN 
    SELECT p.*
    FROM ventas.promocion p
    WHERE p.tipo = 'monto_total'
      AND p.activa = TRUE
      AND p.fecha_inicio <= CURRENT_DATE
      AND p.fecha_fin >= CURRENT_DATE
    ORDER BY p.valor DESC
  LOOP
    DECLARE
      monto_minimo NUMERIC;
      descuento_calculado NUMERIC;
    BEGIN
      -- Verificar condiciones del JSON
      IF promocion_record.condicion_json IS NOT NULL AND 
         promocion_record.condicion_json ? 'monto_minimo' THEN
        monto_minimo := (promocion_record.condicion_json->>'monto_minimo')::NUMERIC;
        
        IF p_monto_total >= monto_minimo THEN
          descuento_calculado := (p_monto_total * promocion_record.valor) / 100;
          
          -- Mantener el mejor descuento
          IF descuento_calculado > mejor_descuento THEN
            mejor_descuento := descuento_calculado;
            mejor_promocion := promocion_record.id;
            mejor_nombre := promocion_record.nombre;
          END IF;
        END IF;
      END IF;
    END;
  END LOOP;
  
  RETURN QUERY SELECT 
    COALESCE(mejor_descuento, 0::NUMERIC),
    mejor_promocion,
    mejor_nombre,
    (mejor_descuento > 0);
END;
$$
LANGUAGE plpgsql;

-- Función para aplicar descuentos en una venta completa
CREATE OR REPLACE FUNCTION aplicar_descuentos_venta(
    p_venta_id INT
)
RETURNS TABLE(
    producto_id INT,
    cantidad INT,
    precio_original NUMERIC,
    descuento_aplicado NUMERIC,
    precio_final NUMERIC,
    promociones_usadas TEXT[],
    monto_total_descuento NUMERIC
) AS
$$
DECLARE
  detalle_record RECORD;
  descuento_result RECORD;
  total_descuentos NUMERIC := 0;
  monto_total_venta NUMERIC;
  descuento_por_monto RECORD;
BEGIN
  -- Obtener monto total de la venta
  SELECT SUM(vd.cantidad * vd.precio_unitario) INTO monto_total_venta
  FROM ventas.venta_detalle vd
  WHERE vd.venta_id = p_venta_id;
  
  -- Procesar cada detalle de la venta
  FOR detalle_record IN 
    SELECT vd.*, p.costo
    FROM ventas.venta_detalle vd
    JOIN ventas.producto p ON vd.producto_id = p.id
    WHERE vd.venta_id = p_venta_id
  LOOP
    -- Calcular descuentos por producto
    SELECT * INTO descuento_result
    FROM calcular_descuento_producto(
      detalle_record.producto_id,
      detalle_record.precio_unitario,
      detalle_record.cantidad
    );
    
    total_descuentos := total_descuentos + descuento_result.descuento_total;
    
    RETURN QUERY SELECT 
      detalle_record.producto_id,
      detalle_record.cantidad,
      detalle_record.precio_unitario,
      descuento_result.descuento_total,
      descuento_result.precio_final,
      descuento_result.promociones_aplicadas,
      total_descuentos;
  END LOOP;
  
  -- Verificar descuentos por monto total
  SELECT * INTO descuento_por_monto
  FROM calcular_descuento_por_monto_total(monto_total_venta);
  
  IF descuento_por_monto.condiciones_cumplidas THEN
    -- Aplicar descuento adicional por monto total
    -- Esto se aplicaría a nivel de venta, no por producto individual
    total_descuentos := total_descuentos + descuento_por_monto.descuento_aplicable;
  END IF;
END;
$$
LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIONES DE UTILIDAD PARA EL SISTEMA
-- ============================================================================

-- Función para registrar automáticamente promociones aplicadas
CREATE OR REPLACE FUNCTION registrar_promociones_aplicadas_en_venta(
    p_venta_id INT
)
RETURNS INT AS
$$
DECLARE
  resultado_descuentos RECORD;
  promociones_registradas INT := 0;
  monto_total_venta NUMERIC;
  descuento_por_monto RECORD;
BEGIN
  -- Limpiar registros previos si existen
  DELETE FROM ventas.venta_promocion WHERE venta_id = p_venta_id;
  
  -- Registrar promociones por producto/categoría
  FOR resultado_descuentos IN 
    SELECT * FROM aplicar_descuentos_venta(p_venta_id)
  LOOP
    -- Aquí podríamos registrar cada promoción individual
    -- Por ahora, incrementamos el contador
    promociones_registradas := promociones_registradas + array_length(resultado_descuentos.promociones_usadas, 1);
  END LOOP;
  
  -- Obtener monto total y verificar descuento por monto
  SELECT total INTO monto_total_venta
  FROM ventas.venta 
  WHERE id = p_venta_id;
  
  SELECT * INTO descuento_por_monto
  FROM calcular_descuento_por_monto_total(monto_total_venta);
  
  -- Registrar descuento por monto total si aplica
  IF descuento_por_monto.condiciones_cumplidas THEN
    INSERT INTO ventas.venta_promocion (venta_id, promocion_id, monto_descuento)
    VALUES (p_venta_id, descuento_por_monto.promocion_id, descuento_por_monto.descuento_aplicable);
    
    promociones_registradas := promociones_registradas + 1;
  END IF;
  
  RETURN promociones_registradas;
END;
$$
LANGUAGE plpgsql;

-- Función para obtener el historial de cambios de una promoción
CREATE OR REPLACE FUNCTION obtener_historial_promocion(p_promocion_id INT)
RETURNS TABLE(
    fecha_cambio TIMESTAMP,
    operacion VARCHAR,
    campo_modificado VARCHAR,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario VARCHAR
) AS
$$
BEGIN
  RETURN QUERY
    WITH cambios AS (
      SELECT 
        pa.fecha_cambio,
        pa.operacion,
        pa.datos_anteriores,
        pa.datos_nuevos,
        pa.usuario
      FROM promocion_auditoria pa
      WHERE pa.promocion_id = p_promocion_id
      ORDER BY pa.fecha_cambio DESC
    )
    SELECT 
      c.fecha_cambio,
      c.operacion,
      'promocion'::VARCHAR as campo_modificado,
      c.datos_anteriores::TEXT as valor_anterior,
      c.datos_nuevos::TEXT as valor_nuevo,
      COALESCE(c.usuario, 'Sistema')::VARCHAR as usuario
    FROM cambios c;
END;
$$
LANGUAGE plpgsql;

-- Función para obtener resumen de descuentos de una venta
CREATE OR REPLACE FUNCTION obtener_resumen_descuentos_venta(
    p_venta_id INT
)
RETURNS TABLE(
    total_original NUMERIC,
    total_descuentos NUMERIC,
    total_final NUMERIC,
    cantidad_promociones INT,
    detalle_por_producto JSONB
) AS
$$
DECLARE
  resumen_descuentos RECORD;
  total_orig NUMERIC := 0;
  total_desc NUMERIC := 0;
  cant_promo INT := 0;
  detalle JSONB := '{}';
  producto_detalle JSONB;
BEGIN
  -- Calcular totales por cada producto
  FOR resumen_descuentos IN 
    SELECT * FROM aplicar_descuentos_venta(p_venta_id)
  LOOP
    total_orig := total_orig + (resumen_descuentos.precio_original * resumen_descuentos.cantidad);
    total_desc := total_desc + resumen_descuentos.descuento_aplicado;
    cant_promo := cant_promo + array_length(resumen_descuentos.promociones_usadas, 1);
    
    -- Construir detalle por producto
    producto_detalle := jsonb_build_object(
      'producto_id', resumen_descuentos.producto_id,
      'cantidad', resumen_descuentos.cantidad,
      'precio_original', resumen_descuentos.precio_original,
      'descuento_aplicado', resumen_descuentos.descuento_aplicado,
      'precio_final', resumen_descuentos.precio_final,
      'promociones', resumen_descuentos.promociones_usadas
    );
    
    detalle := detalle || jsonb_build_object(
      'producto_' || resumen_descuentos.producto_id::text,
      producto_detalle
    );
  END LOOP;
  
  RETURN QUERY SELECT 
    total_orig,
    total_desc,
    total_orig - total_desc,
    cant_promo,
    detalle;
END;
$$
LANGUAGE plpgsql;

-- Función para validar coherencia de precios con descuentos
CREATE OR REPLACE FUNCTION validar_coherencia_precios_venta(
    p_venta_id INT
)
RETURNS TABLE(
    es_coherente BOOLEAN,
    diferencia_encontrada NUMERIC,
    mensaje_error TEXT
) AS
$$
DECLARE
  total_calculado NUMERIC;
  total_registrado NUMERIC;
  diferencia NUMERIC;
BEGIN
  -- Obtener total registrado en la venta
  SELECT total INTO total_registrado
  FROM ventas.venta 
  WHERE id = p_venta_id;
  
  -- Calcular total con descuentos
  SELECT total_final INTO total_calculado
  FROM obtener_resumen_descuentos_venta(p_venta_id);
  
  diferencia := ABS(total_registrado - total_calculado);
  
  -- Permitir una diferencia mínima por redondeos
  IF diferencia <= 0.01 THEN
    RETURN QUERY SELECT TRUE, diferencia, 'Los precios son coherentes'::TEXT;
  ELSE
    RETURN QUERY SELECT 
      FALSE, 
      diferencia, 
      FORMAT('Diferencia encontrada: Registrado $%s, Calculado $%s', 
             total_registrado, total_calculado);
  END IF;
END;
$$
LANGUAGE plpgsql;

-- Función para limpiar promociones muy antiguas (mantenimiento)
CREATE OR REPLACE FUNCTION limpiar_promociones_antiguas(p_dias_antiguedad INT DEFAULT 365)
RETURNS INT AS
$$
DECLARE
  filas_afectadas INT;
BEGIN
  -- Eliminar físicamente promociones muy antiguas que ya no están activas del esquema ventas
  DELETE FROM ventas.promocion 
  WHERE activa = FALSE 
    AND fecha_fin < CURRENT_DATE - INTERVAL '1 day' * p_dias_antiguedad;
    
  GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
  
  -- También limpiar registros de auditoría muy antiguos
  DELETE FROM promocion_auditoria 
  WHERE fecha_cambio < CURRENT_DATE - INTERVAL '1 day' * (p_dias_antiguedad * 2);
  
  RETURN filas_afectadas;
END;
$$
LANGUAGE plpgsql;

-- Función para verificar integridad del sistema con las tablas de ventas
CREATE OR REPLACE FUNCTION verificar_integridad_promociones_ventas()
RETURNS TABLE(
    problema VARCHAR,
    descripcion TEXT,
    promocion_id INT,
    severidad VARCHAR
) AS
$$
BEGIN
  -- Verificar promociones con fechas inconsistentes
  RETURN QUERY
    SELECT 
      'FECHAS_INCONSISTENTES'::VARCHAR as problema,
      'Promoción con fecha de inicio mayor a fecha de fin'::TEXT as descripcion,
      p.id as promocion_id,
      'CRÍTICO'::VARCHAR as severidad
    FROM ventas.promocion p
    WHERE p.fecha_inicio > p.fecha_fin;
  
  -- Verificar promociones activas vencidas
  RETURN QUERY
    SELECT 
      'PROMOCION_VENCIDA_ACTIVA'::VARCHAR as problema,
      'Promoción marcada como activa pero ya vencida'::TEXT as descripcion,
      p.id as promocion_id,
      'ALTO'::VARCHAR as severidad
    FROM ventas.promocion p
    WHERE p.activa = TRUE AND p.fecha_fin < CURRENT_DATE;
  
  -- Verificar promociones sin asignaciones
  RETURN QUERY
    SELECT 
      'SIN_ASIGNACIONES'::VARCHAR as problema,
      'Promoción activa sin productos ni categorías asignadas'::TEXT as descripcion,
      p.id as promocion_id,
      'MEDIO'::VARCHAR as severidad
    FROM ventas.promocion p
    WHERE p.activa = TRUE
      AND p.tipo IN ('producto', 'categoria')
      AND NOT EXISTS (
        SELECT 1 FROM ventas.promocion_producto pp 
        WHERE pp.promocion_id = p.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM ventas.promocion_categoria pc 
        WHERE pc.promocion_id = p.id
      );
  
  -- Verificar valores de descuento extremos
  RETURN QUERY
    SELECT 
      'DESCUENTO_EXTREMO'::VARCHAR as problema,
      'Promoción con descuento mayor al 80%'::TEXT as descripcion,
      p.id as promocion_id,
      'MEDIO'::VARCHAR as severidad
    FROM ventas.promocion p
    WHERE p.activa = TRUE AND p.valor > 80;
    
  -- Verificar productos inexistentes en promociones
  RETURN QUERY
    SELECT 
      'PRODUCTO_INEXISTENTE'::VARCHAR as problema,
      'Promoción asignada a producto que no existe o está inactivo'::TEXT as descripion,
      p.id as promocion_id,
      'ALTO'::VARCHAR as severidad
    FROM ventas.promocion p
    JOIN ventas.promocion_producto pp ON p.id = pp.promocion_id
    LEFT JOIN ventas.producto prod ON pp.producto_id = prod.id
    WHERE prod.id IS NULL OR prod.activo = FALSE;
END;
$$
LANGUAGE plpgsql;

-- ============================================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índice compuesto para consultas de validación de promociones únicas
CREATE INDEX idx_promocion_producto_validacion 
ON promocion_producto(producto_id, activo) 
WHERE activo = TRUE;

-- Índice para consultas de auditoría
CREATE INDEX idx_promocion_auditoria_fecha 
ON promocion_auditoria(fecha_cambio DESC);

CREATE INDEX idx_promocion_auditoria_promocion 
ON promocion_auditoria(promocion_id, fecha_cambio DESC);

-- ============================================================================
-- COMENTARIOS SOBRE LAS VALIDACIONES
-- ============================================================================

COMMENT ON FUNCTION validar_aplicacion_promocion IS 'Valida todas las reglas de negocio antes de aplicar una promoción';
COMMENT ON FUNCTION obtener_historial_promocion IS 'Obtiene el historial completo de cambios de una promoción';
COMMENT ON FUNCTION limpiar_promociones_antiguas IS 'Función de mantenimiento para limpiar promociones muy antiguas';
COMMENT ON TABLE promocion_auditoria IS 'Tabla de auditoría para registrar todos los cambios en promociones';
