-- funciones rol

SET search_path = public;

CREATE OR REPLACE FUNCTION obtener_roles()
RETURNS SETOF rol AS 
$$
  BEGIN
    RETURN QUERY SELECT * FROM rol ORDER BY id;
  END;  
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION crear_rol(
    p_nombre VARCHAR,
    p_descripcion TEXT
)
RETURNS rol AS
$$
DECLARE
    nuevo_rol rol;
BEGIN
    INSERT INTO rol(nombre,descripcion)
    VALUES(UPPER(p_nombre),UPPER(p_descripcion))
    RETURNING * INTO nuevo_rol;

    RETURN nuevo_rol;
END;
$$
LANGUAGE plpgsql;


-- 2. Obtener un rol por id
CREATE OR REPLACE FUNCTION obtener_rol(p_id INT)
RETURNS rol AS
$$
DECLARE
  r rol;
BEGIN
  SELECT *
    INTO r
    FROM rol
   WHERE id = p_id;

  RETURN r;
END;
$$
LANGUAGE plpgsql;


-- 3. Actualizar un rol existente
CREATE OR REPLACE FUNCTION actualizar_rol(
    p_id           INT,
    p_nombre       VARCHAR,
    p_descripcion  TEXT,
    p_activo       BOOLEAN,
    p_nivel_acceso INTEGER
)
RETURNS rol AS
$$
DECLARE
  rol_actualizado rol;
BEGIN
  UPDATE rol
     SET nombre       = UPPER(p_nombre),
         descripcion  = UPPER(p_descripcion),
         activo       = p_activo,
         nivel_acceso = p_nivel_acceso
   WHERE id = p_id
  RETURNING * INTO rol_actualizado;

  RETURN rol_actualizado;
END;
$$
LANGUAGE plpgsql;


-- 4. Eliminar un rol (borrado físico)
CREATE OR REPLACE FUNCTION eliminar_rol(p_id INT)
RETURNS VOID AS
$$
BEGIN
  DELETE FROM rol
   WHERE id = p_id;
END;
$$
LANGUAGE plpgsql;


-- 5. Obtener roles por estado (activo/inactivo)
CREATE OR REPLACE FUNCTION obtener_roles_por_estado(p_activo BOOLEAN)
RETURNS SETOF rol AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM rol
     WHERE activo = p_activo
     ORDER BY id;
END;
$$
LANGUAGE plpgsql;


-- 6. Obtener roles por nivel de acceso
CREATE OR REPLACE FUNCTION obtener_roles_por_nivel(p_nivel_acceso INTEGER)
RETURNS SETOF rol AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM rol
     WHERE nivel_acceso = p_nivel_acceso
     ORDER BY nombre;
END;
$$
LANGUAGE plpgsql;


-- 7. Buscar roles por nombre (búsqueda parcial)
CREATE OR REPLACE FUNCTION buscar_roles_por_nombre(p_nombre VARCHAR)
RETURNS SETOF rol AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM rol
     WHERE UPPER(nombre) LIKE UPPER('%' || p_nombre || '%')
     ORDER BY nombre;
END;
$$
LANGUAGE plpgsql;


-- Ejemplos de uso:

-- Listar todos
SELECT * FROM obtener_roles();

-- Crear
SELECT * FROM crear_rol('Administrador', 'Rol con acceso completo al sistema');

-- Obtener por id
SELECT * FROM obtener_rol(1);

-- Actualizar
SELECT * FROM actualizar_rol(1, 'Super Administrador', 'Rol actualizado con permisos especiales', TRUE, 10);

-- Obtener roles activos
SELECT * FROM obtener_roles_por_estado(TRUE);

-- Obtener roles por nivel de acceso
SELECT * FROM obtener_roles_por_nivel(10);

-- Buscar roles por nombre
SELECT * FROM buscar_roles_por_nombre('admin');

-- Borrar
SELECT eliminar_rol(1);
