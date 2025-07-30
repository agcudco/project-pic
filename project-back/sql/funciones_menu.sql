-- Asegúrate de estar en el esquema correcto
SET search_path = public;

-- 1. Listar todos los menús
CREATE OR REPLACE FUNCTION obtener_menus()
RETURNS SETOF menu AS
$$
BEGIN
  RETURN QUERY
    SELECT *
    FROM menu
    ORDER BY id;
END;
$$
LANGUAGE plpgsql;


-- 2. Obtener un menú por su ID
CREATE OR REPLACE FUNCTION obtener_menu_por_id(
  p_id INT
)
RETURNS menu AS
$$
DECLARE
  resultado menu;
BEGIN
  SELECT *
    INTO resultado
    FROM menu
   WHERE id = p_id;

  RETURN resultado;
END;
$$
LANGUAGE plpgsql;


-- 3. Crear un nuevo menú
CREATE OR REPLACE FUNCTION crear_menu(
  p_nombre        VARCHAR,
  p_id_modulo     INT,
  p_id_menu_padre INT DEFAULT NULL,
  p_orden         INT DEFAULT NULL,
  p_descripcion   TEXT DEFAULT NULL
)
RETURNS menu AS
$$
DECLARE
  nuevo_menu menu;
BEGIN
  INSERT INTO menu (nombre, id_modulo, id_menu_padre, orden, descripcion)
  VALUES (
    UPPER(p_nombre),
    p_id_modulo,
    p_id_menu_padre,
    p_orden,
    p_descripcion
  )
  RETURNING * INTO nuevo_menu;

  RETURN nuevo_menu;
END;
$$
LANGUAGE plpgsql;


-- 4. Actualizar un menú existente
CREATE OR REPLACE FUNCTION actualizar_menu(
  p_id            INT,
  p_nombre        VARCHAR,
  p_id_modulo     INT,
  p_id_menu_padre INT DEFAULT NULL,
  p_orden         INT DEFAULT NULL,
  p_descripcion   TEXT DEFAULT NULL
)
RETURNS menu AS
$$
DECLARE
  menu_modificado menu;
BEGIN
  UPDATE menu
     SET nombre        = UPPER(p_nombre),
         id_modulo     = p_id_modulo,
         id_menu_padre = p_id_menu_padre,
         orden         = p_orden,
         descripcion   = p_descripcion
   WHERE id = p_id
  RETURNING * INTO menu_modificado;

  RETURN menu_modificado;
END;
$$
LANGUAGE plpgsql;


-- 5. Eliminar un menú (retorna el registro eliminado)
CREATE OR REPLACE FUNCTION eliminar_menu(
  p_id INT
)
RETURNS menu AS
$$
DECLARE
  menu_eliminado menu;
BEGIN
  DELETE FROM menu
  WHERE id = p_id
  RETURNING * INTO menu_eliminado;

  RETURN menu_eliminado;
END;
$$
LANGUAGE plpgsql;


-- Ejemplos de uso:

-- Crear algunos menús
SELECT * FROM crear_menu('Dashboard', 2, NULL, 1, 'Pantalla principal');
SELECT * FROM crear_menu('Usuarios',   2, NULL, 2, 'Gestión de usuarios');
SELECT * FROM crear_menu('Roles',      2, 4,    1, 'Gestión de roles');

-- Listar todos
SELECT * FROM obtener_menus();

-- Obtener uno por ID
SELECT * FROM obtener_menu_por_id(2);

-- Actualizar
SELECT * FROM actualizar_menu(3, 'Permisos', 2, 2, 2, 'Gestión de permisos');

-- Eliminar
SELECT * FROM eliminar_menu(3);

-- Volver a listar para verificar cambios
SELECT * FROM obtener_menus();
