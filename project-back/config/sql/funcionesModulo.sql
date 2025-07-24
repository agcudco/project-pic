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