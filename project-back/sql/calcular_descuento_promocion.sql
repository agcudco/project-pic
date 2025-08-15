-- FUNCION PARA CALCULAR DESCUENTO DE UNA PROMOCION SOBRE UNA VENTA
-- Esta función es genérica y soporta promociones por producto, categoría, monto total y cantidad
-- Puedes ajustarla según tus reglas de negocio

CREATE OR REPLACE FUNCTION ventas.calcular_descuento_promocion(
    p_promocion_id INT,
    p_monto_base NUMERIC,
    p_cantidad INT DEFAULT 1
)
RETURNS TABLE(
    promocion_id INT,
    monto_descuento NUMERIC
) AS $$
DECLARE
    v_tipo VARCHAR(20);
    v_valor NUMERIC;
    v_condicion JSONB;
    v_descuento NUMERIC := 0;
BEGIN
    SELECT tipo, valor, condicion_json
      INTO v_tipo, v_valor, v_condicion
      FROM ventas.promocion
     WHERE id = p_promocion_id AND activa = TRUE AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin;

    IF NOT FOUND THEN
        RETURN QUERY SELECT p_promocion_id, 0;
        RETURN;
    END IF;

    -- Descuento por tipo de promoción
    IF v_tipo = 'producto' THEN
        -- Aplica descuento por producto (valor = % o monto fijo)
        v_descuento := p_monto_base * v_valor / 100;
    ELSIF v_tipo = 'categoria' THEN
        -- Aplica descuento por categoría (valor = % o monto fijo)
        v_descuento := p_monto_base * v_valor / 100;
    ELSIF v_tipo = 'monto_total' THEN
        -- Aplica si el monto base supera un mínimo
        IF v_condicion ? 'min_monto' AND p_monto_base >= (v_condicion->>'min_monto')::NUMERIC THEN
            v_descuento := p_monto_base * v_valor / 100;
        END IF;
    ELSIF v_tipo = 'cantidad' THEN
        -- Aplica si la cantidad supera un mínimo
        IF v_condicion ? 'min_qty' AND p_cantidad >= (v_condicion->>'min_qty')::INT THEN
            v_descuento := p_monto_base * v_valor / 100;
        END IF;
    END IF;

    RETURN QUERY SELECT p_promocion_id, COALESCE(v_descuento,0);
END;
$$ LANGUAGE plpgsql STABLE;
