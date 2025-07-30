-- Triggers y Validaciones para el sistema de Promociones y Descuentos
-- Compatible con el esquema 'ventas' existente
-- Autor: Herrera-Lecho
-- Fecha: 29/07/2025

SET search_path = ventas, public;

-- ============================================================================
-- TRIGGERS PARA AUDITORÍA Y VALIDACIONES - ESQUEMA VENTAS
-- ============================================================================

-- 1. Trigger para log de cambios en promociones (auditoría)
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

-- Crear el trigger en las tablas del esquema ventas
DROP TRIGGER IF EXISTS trg_log_cambios_promocion ON ventas.promocion;
CREATE TRIGGER trg_log_cambios_promocion
  AFTER INSERT OR UPDATE OR DELETE ON ventas.promocion
  FOR EACH ROW
  EXECUTE FUNCTION log_cambios_promocion();

-- 2. Trigger para validar fechas de promociones
CREATE OR REPLACE FUNCTION validar_fechas_promocion()
RETURNS TRIGGER AS
$$
BEGIN
  -- Validar que la fecha de inicio no sea mayor que la fecha de fin
  IF NEW.fecha_inicio > NEW.fecha_fin THEN
    RAISE EXCEPTION 'La fecha de inicio (%) no puede ser mayor que la fecha de fin (%)', 
                    NEW.fecha_inicio, NEW.fecha_fin;
  END IF;
  
  -- Validar que la fecha de fin no sea muy antigua (más de 2 años atrás)
  IF NEW.fecha_fin < CURRENT_DATE - INTERVAL '2 years' THEN
    RAISE EXCEPTION 'La fecha de fin no puede ser anterior a 2 años desde hoy';
  END IF;
  
  -- Validar que la promoción no sea demasiado larga (más de 2 años)
  IF NEW.fecha_fin > NEW.fecha_inicio + INTERVAL '2 years' THEN
    RAISE EXCEPTION 'La duración de la promoción no puede exceder 2 años';
  END IF;
  
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_fechas_promocion ON ventas.promocion;
CREATE TRIGGER trg_validar_fechas_promocion
  BEFORE INSERT OR UPDATE ON ventas.promocion
  FOR EACH ROW
  EXECUTE FUNCTION validar_fechas_promocion();

-- 3. Trigger para validar límites de descuento
CREATE OR REPLACE FUNCTION validar_limites_descuento()
RETURNS TRIGGER AS
$$
BEGIN
  -- Validar que el valor del descuento no sea mayor al 100% para porcentajes
  IF NEW.tipo IN ('producto', 'categoria', 'monto_total') AND NEW.valor > 100 THEN
    RAISE EXCEPTION 'El descuento no puede ser mayor al 100%%. Valor actual: %', NEW.valor;
  END IF;
  
  -- Validar que el valor no sea 0 o negativo
  IF NEW.valor <= 0 THEN
    RAISE EXCEPTION 'El valor del descuento debe ser mayor a 0. Valor actual: %', NEW.valor;
  END IF;
  
  -- Para promociones por cantidad, validar que sea un porcentaje razonable
  IF NEW.tipo = 'cantidad' AND NEW.valor > 90 THEN
    RAISE EXCEPTION 'Para promociones por cantidad, el descuento no puede ser mayor al 90%%. Valor actual: %', NEW.valor;
  END IF;
  
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_limites_descuento ON ventas.promocion;
CREATE TRIGGER trg_validar_limites_descuento
  BEFORE INSERT OR UPDATE ON ventas.promocion
  FOR EACH ROW
  EXECUTE FUNCTION validar_limites_descuento();

-- 4. Trigger para validar JSON de condiciones
CREATE OR REPLACE FUNCTION validar_condiciones_json()
RETURNS TRIGGER AS
$$
DECLARE
  monto_minimo NUMERIC;
  cantidad_minima INT;
BEGIN
  -- Solo validar si hay condiciones JSON
  IF NEW.condicion_json IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Validar estructura según el tipo de promoción
  CASE NEW.tipo
    WHEN 'monto_total' THEN
      -- Debe tener monto_minimo y debe ser positivo
      IF NEW.condicion_json ? 'monto_minimo' THEN
        monto_minimo := (NEW.condicion_json->>'monto_minimo')::NUMERIC;
        IF monto_minimo <= 0 THEN
          RAISE EXCEPTION 'El monto mínimo debe ser mayor a 0. Valor actual: %', monto_minimo;
        END IF;
      END IF;
      
    WHEN 'cantidad' THEN
      -- Debe tener cantidad_minima y debe ser positiva
      IF NEW.condicion_json ? 'cantidad_minima' THEN
        cantidad_minima := (NEW.condicion_json->>'cantidad_minima')::INT;
        IF cantidad_minima <= 0 THEN
          RAISE EXCEPTION 'La cantidad mínima debe ser mayor a 0. Valor actual: %', cantidad_minima;
        END IF;
      END IF;
  END CASE;
  
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_condiciones_json ON ventas.promocion;
CREATE TRIGGER trg_validar_condiciones_json
  BEFORE INSERT OR UPDATE ON ventas.promocion
  FOR EACH ROW
  EXECUTE FUNCTION validar_condiciones_json();

-- 5. Trigger para prevenir eliminación en cascada no deseada
CREATE OR REPLACE FUNCTION prevenir_eliminacion_promocion_activa()
RETURNS TRIGGER AS
$$
BEGIN
  -- Si la promoción está activa y vigente, no permitir eliminación física
  IF OLD.activa = TRUE AND OLD.fecha_fin >= CURRENT_DATE THEN
    RAISE EXCEPTION 'No se puede eliminar físicamente una promoción activa y vigente. ID: %. Use desactivación en su lugar.', OLD.id;
  END IF;
  
  RETURN OLD;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevenir_eliminacion_promocion_activa ON ventas.promocion;
CREATE TRIGGER trg_prevenir_eliminacion_promocion_activa
  BEFORE DELETE ON ventas.promocion
  FOR EACH ROW
  EXECUTE FUNCTION prevenir_eliminacion_promocion_activa();

-- 6. Trigger para estadísticas automáticas
CREATE OR REPLACE FUNCTION actualizar_estadisticas_promocion()
RETURNS TRIGGER AS
$$
BEGIN
  -- Este trigger se ejecuta cuando se registra una nueva aplicación de promoción
  RAISE NOTICE 'Promoción % aplicada en venta % por un monto de %', 
                NEW.promocion_id, NEW.venta_id, NEW.monto_descuento;
  
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_actualizar_estadisticas_promocion ON ventas.venta_promocion;
CREATE TRIGGER trg_actualizar_estadisticas_promocion
  AFTER INSERT ON ventas.venta_promocion
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_estadisticas_promocion();

-- ============================================================================
-- FUNCIONES DE DESCUENTOS INTERNOS PARA EL ESQUEMA VENTAS
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
      descuento_individual NUMERIC;
    BEGIN
      -- Calcular descuento
      descuento_individual := (precio_con_descuento * promocion_record.valor) / 100;
      
      -- Validar que no sea menor al costo
      IF (precio_con_descuento - descuento_individual) >= producto_record.costo THEN
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
  
  -- Buscar promociones por categoría (solo si no hay descuento por producto)
  IF descuento_acumulado = 0 THEN
    FOR promocion_record IN 
      SELECT p.*, 'categoria' as origen
      FROM ventas.promocion p
      JOIN ventas.promocion_categoria pc ON p.id = pc.promocion_id
      JOIN ventas.producto_categoria prc ON pc.categoria_id = prc.categoria_id
      WHERE prc.producto_id = p_producto_id
        AND p.activa = TRUE
        AND p.fecha_inicio <= CURRENT_DATE
        AND p.fecha_fin >= CURRENT_DATE
      ORDER BY p.valor DESC
      LIMIT 1 -- Solo tomar el mejor descuento por categoría
    LOOP
      DECLARE
        descuento_individual NUMERIC;
      BEGIN
        descuento_individual := (precio_con_descuento * promocion_record.valor) / 100;
        
        IF (precio_con_descuento - descuento_individual) >= producto_record.costo THEN
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
  END IF;
  
  -- Aplicar cantidad
  descuento_acumulado := descuento_acumulado * p_cantidad;
  
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
  detalle_record RECORD;
  descuento_result RECORD;
  total_orig NUMERIC := 0;
  total_desc NUMERIC := 0;
  cant_promo INT := 0;
  detalle JSONB := '{}';
  producto_detalle JSONB;
BEGIN
  -- Calcular totales por cada producto
  FOR detalle_record IN 
    SELECT vd.*, p.costo, p.nombre as producto_nombre
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
    
    total_orig := total_orig + (detalle_record.precio_unitario * detalle_record.cantidad);
    total_desc := total_desc + descuento_result.descuento_total;
    cant_promo := cant_promo + array_length(descuento_result.promociones_aplicadas, 1);
    
    -- Construir detalle por producto
    producto_detalle := jsonb_build_object(
      'producto_id', detalle_record.producto_id,
      'producto_nombre', detalle_record.producto_nombre,
      'cantidad', detalle_record.cantidad,
      'precio_original', detalle_record.precio_unitario,
      'descuento_aplicado', descuento_result.descuento_total,
      'precio_final', descuento_result.precio_final,
      'promociones', descuento_result.promociones_aplicadas
    );
    
    detalle := detalle || jsonb_build_object(
      'producto_' || detalle_record.producto_id::text,
      producto_detalle
    );
  END LOOP;
  
  RETURN QUERY SELECT 
    total_orig,
    total_desc,
    total_orig - total_desc,
    COALESCE(cant_promo, 0),
    detalle;
END;
$$
LANGUAGE plpgsql;
