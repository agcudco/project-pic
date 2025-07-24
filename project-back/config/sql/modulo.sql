CREATE TABLE modulo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true
);


CREATE TABLE modulo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true
);

-- Insertar datos de prueba directamente en la tabla
INSERT INTO modulo (nombre, descripcion, estado) VALUES
('Usuarios', 'Gestión de usuarios del sistema', true),
('Roles', 'Administración de roles y permisos', true),
('Productos', 'Gestión de catálogo de productos', true),
('Inventario', 'Control de stock y movimientos', true),
('Ventas', 'Registro y seguimiento de ventas', true),
('Reportes', 'Generación de informes y estadísticas', false),
('Configuración', 'Configuración general del sistema', true),
('Clientes', 'Gestión de información de clientes', true),
('Proveedores', 'Administración de proveedores', false),
('Compras', 'Registro de órdenes de compra', true);

-- Función para obtener todos los módulos
CREATE OR REPLACE FUNCTION obtener_modulos()
RETURNS SETOF modulo AS $$
BEGIN
    RETURN QUERY SELECT * FROM modulo;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener un módulo por ID
CREATE OR REPLACE FUNCTION obtener_modulo_por_id(p_id INTEGER)
RETURNS modulo AS $$
DECLARE
    resultado modulo;
BEGIN
    SELECT * INTO resultado FROM modulo WHERE id = p_id;
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Función para crear un módulo
CREATE OR REPLACE FUNCTION crear_modulo(
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_estado BOOLEAN
)
RETURNS modulo AS $$
DECLARE
    nuevo_modulo modulo;
BEGIN
    INSERT INTO modulo (nombre, descripcion, estado)
    VALUES (p_nombre, p_descripcion, p_estado)
    RETURNING * INTO nuevo_modulo;

    RETURN nuevo_modulo;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar un módulo
CREATE OR REPLACE FUNCTION actualizar_modulo(
    p_id INTEGER,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_estado BOOLEAN
)
RETURNS modulo AS $$
DECLARE
    modulo_actualizado modulo;
BEGIN
    UPDATE modulo
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        estado = p_estado
    WHERE id = p_id
    RETURNING * INTO modulo_actualizado;

    RETURN modulo_actualizado;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar un módulo
CREATE OR REPLACE FUNCTION eliminar_modulo(p_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM modulo WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;


-- Testear obtener todos los módulos
SELECT * FROM obtener_modulos();

-- Testear obtener módulo por ID
SELECT * FROM obtener_modulo_por_id(11);

-- Testear crear módulo
SELECT * FROM crear_modulo('Nuevo Módulo', 'Descripción de prueba', true);

-- Testear actualizar módulo
SELECT * FROM actualizar_modulo(1, 'Módulo Actualizado', 'Nueva descripción', false);

SELECT * FROM eliminar_modulo(11);