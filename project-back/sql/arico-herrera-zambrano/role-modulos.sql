-- Asignar módulo a rol
-- Esta función asigna un módulo a un rol específico en la base de datos.
CREATE OR REPLACE FUNCTION asignar_modulo_a_rol(
    p_id_rol INT,
    p_id_modulo INT
)
RETURNS TEXT AS
$$
BEGIN
    INSERT INTO rol_modulo(id_rol, id_modulo)
    VALUES (p_id_rol, p_id_modulo)
    ON CONFLICT DO NOTHING;

    RETURN 'Módulo asignado al rol exitosamente';
END;
$$
LANGUAGE plpgsql;

-- Obtiene el modulo por cada rol

CREATE OR REPLACE FUNCTION obtener_modulos_por_rol(p_id_rol INT)
RETURNS TABLE (
    id INT,
    nombre VARCHAR,
    descripcion TEXT,
    activo BOOLEAN
) AS
$$
BEGIN
    RETURN QUERY
        SELECT m.id, m.nombre, m.descripcion, m.activo
        FROM modulo m
        INNER JOIN rol_modulo rm ON m.id = rm.id_modulo
        WHERE rm.id_rol = p_id_rol
        ORDER BY m.id;
END;
$$
LANGUAGE plpgsql;

-- Eliminar modulos para algun rol

CREATE OR REPLACE FUNCTION eliminar_modulo_de_rol(p_id_rol INT, p_id_modulo INT)
RETURNS TEXT AS
$$
BEGIN
  DELETE FROM rol_modulo
  WHERE id_rol = p_id_rol AND id_modulo = p_id_modulo;

  RETURN 'Módulo eliminado del rol correctamente';
END;
$$
LANGUAGE plpgsql;

