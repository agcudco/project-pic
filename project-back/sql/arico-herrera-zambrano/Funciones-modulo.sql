-- funciones modulo

SET search_path = public;

-- 1. Obtener todos los módulos
CREATE OR REPLACE FUNCTION obtener_modulos()
RETURNS SETOF modulo AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM modulo
     ORDER BY id;
END;
$$
LANGUAGE plpgsql;


-- 2. Obtener un módulo por id
CREATE OR REPLACE FUNCTION obtener_modulo(p_id INT)
RETURNS modulo AS
$$
DECLARE
  m modulo;
BEGIN
  SELECT *
    INTO m
    FROM modulo
   WHERE id = p_id;

  RETURN m;
END;
$$
LANGUAGE plpgsql;


-- 3. Crear un nuevo módulo
CREATE OR REPLACE FUNCTION crear_modulo(
    p_nombre      VARCHAR,
    p_descripcion TEXT
)
RETURNS modulo AS
$$
DECLARE
  nuevo_modulo modulo;
BEGIN
  INSERT INTO modulo(nombre, descripcion)
       VALUES (UPPER(p_nombre), UPPER(p_descripcion))
  RETURNING * INTO nuevo_modulo;

  RETURN nuevo_modulo;
END;
$$
LANGUAGE plpgsql;


-- 4. Actualizar un módulo existente
CREATE OR REPLACE FUNCTION actualizar_modulo(
    p_id           INT,
    p_nombre       VARCHAR,
    p_descripcion  TEXT,
    p_activo       BOOLEAN
)
RETURNS modulo AS
$$
DECLARE
  mod_actualizado modulo;
BEGIN
  UPDATE modulo
     SET nombre      = UPPER(p_nombre),
         descripcion = UPPER(p_descripcion),
         activo      = p_activo
   WHERE id = p_id
  RETURNING * INTO mod_actualizado;

  RETURN mod_actualizado;
END;
$$
LANGUAGE plpgsql;


-- 5. Eliminar un módulo (borrado físico)
CREATE OR REPLACE FUNCTION eliminar_modulo(p_id INT)
RETURNS VOID AS
$$
BEGIN
  DELETE FROM modulo
   WHERE id = p_id;
END;
$$
LANGUAGE plpgsql;


-- 6. Obtener módulos por estado (activo/inactivo)
CREATE OR REPLACE FUNCTION obtener_modulos_por_estado(p_activo BOOLEAN)
RETURNS SETOF modulo AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM modulo
     WHERE activo = p_activo
     ORDER BY id;
END;
$$
LANGUAGE plpgsql;


-- 7. Buscar módulos por nombre (búsqueda parcial)
CREATE OR REPLACE FUNCTION buscar_modulos_por_nombre(p_nombre VARCHAR)
RETURNS SETOF modulo AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM modulo
     WHERE UPPER(nombre) LIKE UPPER('%' || p_nombre || '%')
     ORDER BY nombre;
END;
$$
LANGUAGE plpgsql;


-- Ejemplos de uso:

-- Listar todos
SELECT * FROM obtener_modulos();

-- Crear
SELECT * FROM crear_modulo('Ventas', 'Módulo de gestión de ventas');

-- Obtener por id
SELECT * FROM obtener_modulo(1);

-- Actualizar
SELECT * FROM actualizar_modulo(1, 'Ventas v2', 'Actualizado para incluir devoluciones', TRUE);

-- Obtener módulos activos
SELECT * FROM obtener_modulos_por_estado(TRUE);

-- Buscar módulos por nombre
SELECT * FROM buscar_modulos_por_nombre('vent');

-- Borrar
SELECT eliminar_modulo(1);
