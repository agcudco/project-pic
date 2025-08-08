/Funciones ACCIONES/

/Realizado por Johan Alomia/
CREATE OR REPLACE FUNCTION crear_accion(
    p_nombre VARCHAR,
    p_id_menu INT,
    p_url VARCHAR,
    p_icono VARCHAR,
    p_descripcion TEXT,
    p_activo BOOLEAN
)
RETURNS acciones AS 
$$
DECLARE
    nueva_accion acciones;
BEGIN
    INSERT INTO acciones(nombre, id_menu, url, icono, descripcion, activo)
    VALUES (UPPER(p_nombre), p_id_menu, p_url, p_icono, UPPER(p_descripcion), p_activo)
    RETURNING * INTO nueva_accion;

    RETURN nueva_accion;
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION obtener_acciones()
RETURNS SETOF acciones AS 
$$
BEGIN
    RETURN QUERY SELECT * FROM acciones ORDER BY id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_accion_por_id(p_id INT)
RETURNS acciones AS
$$
DECLARE
    accion_resultado acciones;
BEGIN
    SELECT * INTO accion_resultado FROM acciones WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la acción con ID %', p_id;
    END IF;

    RETURN accion_resultado;
END;
$$
LANGUAGE plpgsql;


/Realizado por Luis Carrillo/
CREATE OR REPLACE FUNCTION actualizar_accion(
    p_id INT,
    p_nombre VARCHAR,
    p_id_menu INT,
    p_url VARCHAR,
    p_icono VARCHAR,
    p_descripcion TEXT,
    p_activo BOOLEAN
)
RETURNS acciones AS
$$
DECLARE
    accion_actualizada acciones;
BEGIN
    UPDATE acciones
    SET nombre = UPPER(p_nombre),
        id_menu = p_id_menu,
        url = p_url,
        icono = p_icono,
        descripcion = UPPER(p_descripcion),
        activo = p_activo
    WHERE id = p_id
    RETURNING * INTO accion_actualizada;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se pudo actualizar. Acción con ID % no encontrada', p_id;
    END IF;

    RETURN accion_actualizada;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION eliminar_accion(p_id INT)
RETURNS acciones AS
$$
DECLARE
    accion_eliminada acciones;
BEGIN
    DELETE FROM acciones
    WHERE id = p_id
    RETURNING * INTO accion_eliminada;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la acción con ID % para eliminar', p_id;
    END IF;

    RETURN accion_eliminada;
END;
$$
LANGUAGE plpgsql;


/Realizado por Johan Alomia y Luis Carrillo/
-- Crear
SELECT crear_accion('ver reportes',2 , '/reportes', 'chart-icon', 'permite ver reportes', TRUE);
SELECT crear_accion('ver modulos',2 , '/reportes', 'chart-icon', 'permite ver reportes', TRUE);



-- Obtener todas
SELECT * FROM obtener_acciones();

-- Obtener por ID
SELECT * FROM obtener_accion_por_id(4);

-- Actualizar
SELECT actualizar_accion(3, 'ver reportes actualizados', 2, '/reportes/v2', 'chart-line', 'vista nueva', TRUE);

-- Eliminar
SELECT eliminar_accion(3);