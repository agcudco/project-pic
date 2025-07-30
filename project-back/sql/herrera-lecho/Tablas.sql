-- Extensiones y mejoras para el sistema de Promociones y Descuentos
-- Compatible con el esquema 'ventas' existente
-- Autor: Herrera-Lecho
-- Fecha: 29/07/2025

-- IMPORTANTE: Este archivo NO modifica las tablas del esquema 'ventas'
-- Solo agrega tablas complementarias para auditoría y funcionalidad extendida

SET search_path = ventas, public;

-- ============================================================================
-- TABLA DE AUDITORÍA PARA PROMOCIONES
-- ============================================================================

-- Tabla para auditoría de cambios en promociones (extiende la funcionalidad)
CREATE TABLE IF NOT EXISTS promocion_auditoria (
    id SERIAL PRIMARY KEY,
    promocion_id INT,
    operacion VARCHAR(10) CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    usuario VARCHAR(50),
    fecha_cambio TIMESTAMP DEFAULT NOW(),
    direccion_ip INET,
    detalles_cambio TEXT
);

-- ============================================================================
-- TABLA PARA CONFIGURACIÓN DEL SISTEMA DE DESCUENTOS
-- ============================================================================

-- Tabla para configurar reglas globales del sistema de descuentos
CREATE TABLE IF NOT EXISTS configuracion_descuentos (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(50) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    tipo_dato VARCHAR(20) CHECK (tipo_dato IN ('string', 'number', 'boolean', 'json')),
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_modificacion TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar configuraciones por defecto
INSERT INTO configuracion_descuentos (clave, valor, descripcion, tipo_dato) VALUES
('max_descuento_porcentaje', '90', 'Máximo porcentaje de descuento permitido', 'number'),
('permitir_descuentos_acumulables', 'false', 'Si se permiten múltiples descuentos en un producto', 'boolean'),
('validar_precio_minimo_costo', 'true', 'Validar que el precio final no sea menor al costo', 'boolean'),
('max_promociones_por_producto', '3', 'Máximo número de promociones por producto', 'number'),
('registrar_auditoria', 'true', 'Si se debe registrar auditoría de cambios', 'boolean')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================================
-- TABLA PARA HISTORIAL DE APLICACIÓN DE DESCUENTOS
-- ============================================================================

-- Extiende venta_promocion con más detalles
CREATE TABLE IF NOT EXISTS detalle_aplicacion_descuento (
    id SERIAL PRIMARY KEY,
    venta_promocion_id INT NOT NULL 
        REFERENCES venta_promocion(id)
        ON DELETE CASCADE,
    producto_id INT NOT NULL
        REFERENCES producto(id)
        ON DELETE RESTRICT,
    cantidad_aplicada INT NOT NULL CHECK (cantidad_aplicada > 0),
    precio_original NUMERIC(12,2) NOT NULL CHECK (precio_original >= 0),
    precio_con_descuento NUMERIC(12,2) NOT NULL CHECK (precio_con_descuento >= 0),
    porcentaje_aplicado NUMERIC(5,2),
    condiciones_cumplidas JSONB,
    fecha_aplicacion TIMESTAMP DEFAULT NOW(),
    CHECK (precio_con_descuento <= precio_original)
);

-- ============================================================================
-- VISTAS ÚTILES PARA EL SISTEMA
-- ============================================================================

-- Vista que combina promociones con sus estadísticas
CREATE OR REPLACE VIEW vista_promociones_con_estadisticas AS
SELECT 
    p.id,
    p.nombre,
    p.tipo,
    p.valor,
    p.fecha_inicio,
    p.fecha_fin,
    p.activa,
    COALESCE(COUNT(DISTINCT pp.producto_id), 0) as productos_asignados,
    COALESCE(COUNT(DISTINCT pc.categoria_id), 0) as categorias_asignadas,
    COALESCE(SUM(vp.monto_descuento), 0) as total_descuentos_aplicados,
    COALESCE(COUNT(DISTINCT vp.venta_id), 0) as ventas_con_promocion,
    CASE 
        WHEN p.fecha_fin < CURRENT_DATE THEN 'Vencida'
        WHEN p.fecha_inicio > CURRENT_DATE THEN 'Futura'
        WHEN p.activa = false THEN 'Inactiva'
        ELSE 'Activa'
    END as estado_calculado
FROM promocion p
LEFT JOIN promocion_producto pp ON p.id = pp.promocion_id
LEFT JOIN promocion_categoria pc ON p.id = pc.promocion_id
LEFT JOIN venta_promocion vp ON p.id = vp.promocion_id
GROUP BY p.id, p.nombre, p.tipo, p.valor, p.fecha_inicio, p.fecha_fin, p.activa;

-- Vista de productos con sus posibles descuentos
CREATE OR REPLACE VIEW vista_productos_con_descuentos AS
SELECT 
    p.id,
    p.nombre,
    p.precio_venta,
    p.costo,
    p.activo,
    c.nombre as categoria,
    COALESCE(promo_directa.descuento_directo, 0) as descuento_por_producto,
    COALESCE(promo_categoria.descuento_categoria, 0) as descuento_por_categoria,
    GREATEST(
        COALESCE(promo_directa.descuento_directo, 0),
        COALESCE(promo_categoria.descuento_categoria, 0)
    ) as mejor_descuento_porcentaje
FROM producto p
LEFT JOIN producto_categoria pc ON p.id = pc.producto_id
LEFT JOIN categoria c ON pc.categoria_id = c.id
LEFT JOIN (
    SELECT 
        pp.producto_id,
        MAX(pr.valor) as descuento_directo
    FROM promocion_producto pp
    JOIN promocion pr ON pp.promocion_id = pr.id
    WHERE pr.activa = true 
      AND pr.fecha_inicio <= CURRENT_DATE 
      AND pr.fecha_fin >= CURRENT_DATE
    GROUP BY pp.producto_id
) promo_directa ON p.id = promo_directa.producto_id
LEFT JOIN (
    SELECT 
        pc.producto_id,
        MAX(pr.valor) as descuento_categoria
    FROM producto_categoria pc
    JOIN promocion_categoria prc ON pc.categoria_id = prc.categoria_id
    JOIN promocion pr ON prc.promocion_id = pr.id
    WHERE pr.activa = true 
      AND pr.fecha_inicio <= CURRENT_DATE 
      AND pr.fecha_fin >= CURRENT_DATE
    GROUP BY pc.producto_id
) promo_categoria ON p.id = promo_categoria.producto_id;