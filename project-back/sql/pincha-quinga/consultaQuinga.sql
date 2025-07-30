--REALIZADO POR QUINGA

SET search_path = ventas;
--------------------------------------------CRUD------------------------------------
-- Obtener Categorias
CREATE OR REPLACE FUNCTION obtener_categorias()
RETURNS SETOF categoria AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM categoria ORDER BY id;
END;
$$ LANGUAGE plpgsql;


-- Obtener categoria por ID
CREATE OR REPLACE FUNCTION obtener_categoria_por_id(p_id INTEGER)
RETURNS categoria AS $$
DECLARE
    resultado categoria;
BEGIN
    SELECT * INTO resultado FROM categoria WHERE id = p_id;
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Crear categoria
CREATE OR REPLACE FUNCTION crear_categoria(p_nombre VARCHAR)
RETURNS categoria AS $$
DECLARE
    existe INTEGER;
    nueva_categoria categoria;
BEGIN
    SELECT COUNT(*) INTO existe
    FROM categoria
    WHERE UPPER(TRIM(nombre)) = UPPER(TRIM(p_nombre));

    IF existe > 0 THEN
        RAISE EXCEPTION 'Ya existe una categoría con el nombre "%"', p_nombre;
    END IF;

    INSERT INTO categoria(nombre)
    VALUES (UPPER(TRIM(p_nombre)))
    RETURNING * INTO nueva_categoria;

    RETURN nueva_categoria;
END;
$$ LANGUAGE plpgsql;


-- Actualizar categoria
CREATE OR REPLACE FUNCTION actualizar_categoria(p_id INTEGER, p_nombre VARCHAR)
RETURNS categoria AS $$
DECLARE
    categoria_actualizada categoria;
    existe INTEGER;
BEGIN
-- verificar si el nuevo nombre no usa otra categoría
    SELECT COUNT(*) INTO existe
    FROM categoria
    WHERE UPPER(TRIM(nombre)) = UPPER(TRIM(p_nombre))
      AND id <> p_id;

    IF existe > 0 THEN
        RAISE EXCEPTION 'Ya existe otra categoría con el nombre "%"', p_nombre;
    END IF;

    UPDATE categoria
    SET nombre = UPPER(TRIM(p_nombre))
    WHERE id = p_id
    RETURNING * INTO categoria_actualizada;

    RETURN categoria_actualizada;
END;
$$ LANGUAGE plpgsql;


-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_categoria(p_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM categoria WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
--------------------------------CONSULTAS EXTRAS----------------------------------------
-- busqueda felxible
CREATE OR REPLACE FUNCTION buscar_categorias(p_busqueda TEXT)
RETURNS SETOF categoria AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM categoria
    WHERE UPPER(TRIM(nombre)) ILIKE '%' || TRIM(p_busqueda) || '%'
    ORDER BY id;
END;
$$ LANGUAGE plpgsql;
