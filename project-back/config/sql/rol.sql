CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Función para obtener todos los roles
CREATE OR REPLACE FUNCTION obtener_roles()
RETURNS SETOF rol AS $$
BEGIN
    RETURN QUERY SELECT * FROM rol ORDER BY id;
END;
$$ LANGUAGE plpgsql;



-- Función para obtener un rol por ID
CREATE OR REPLACE FUNCTION obtener_rol_por_id(p_id INTEGER)
RETURNS rol AS $$
DECLARE
    resultado rol;
BEGIN
    SELECT * INTO resultado FROM rol WHERE id = p_id;
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Función para crear un rol
CREATE OR REPLACE FUNCTION crear_rol(
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_estado BOOLEAN
)
RETURNS rol AS $$
DECLARE
    nuevo_rol rol;
BEGIN
    INSERT INTO rol (nombre, descripcion, estado)
    VALUES (p_nombre, p_descripcion, p_estado)
    RETURNING * INTO nuevo_rol;

    RETURN nuevo_rol;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar un rol
CREATE OR REPLACE FUNCTION actualizar_rol(
    p_id INTEGER,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_estado BOOLEAN
)
RETURNS rol AS $$
DECLARE
    rol_actualizado rol;
BEGIN
    UPDATE rol
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        estado = p_estado,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING * INTO rol_actualizado;

    RETURN rol_actualizado;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar un rol
CREATE OR REPLACE FUNCTION eliminar_rol(p_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM rol WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener módulos asignados a un rol
CREATE OR REPLACE FUNCTION obtener_modulos_por_rol(p_rol_id INTEGER)
RETURNS TABLE(
    id INTEGER,
    nombre VARCHAR,
    descripcion TEXT,
    estado BOOLEAN,
    permisos JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.nombre, m.descripcion, m.estado, rm.permisos
    FROM modulo m
    INNER JOIN rol_modulo rm ON m.id = rm.modulo_id
    WHERE rm.rol_id = p_rol_id;
END;
$$ LANGUAGE plpgsql;

-- Función para asignar módulo a rol
CREATE OR REPLACE FUNCTION asignar_modulo_a_rol(
    p_rol_id INTEGER,
    p_modulo_id INTEGER,
    p_permisos JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO rol_modulo (rol_id, modulo_id, permisos)
    VALUES (p_rol_id, p_modulo_id, p_permisos)
    ON CONFLICT (rol_id, modulo_id) 
    DO UPDATE SET permisos = p_permisos;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para remover módulo de rol
CREATE OR REPLACE FUNCTION remover_modulo_de_rol(
    p_rol_id INTEGER,
    p_modulo_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM rol_modulo 
    WHERE rol_id = p_rol_id AND modulo_id = p_modulo_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Insertar roles de prueba
INSERT INTO rol (nombre, descripcion, estado) VALUES
('Administrador', 'Rol con acceso completo al sistema', true),
('Usuario', 'Rol básico con acceso limitado', true),
('Supervisor', 'Rol con acceso a funciones de supervisión', true),
('Invitado', 'Rol con acceso de solo lectura', false);