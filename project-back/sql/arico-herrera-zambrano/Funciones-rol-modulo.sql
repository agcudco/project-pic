-- Funciones para la tabla rol_modulo

SET search_path = public;

-- 1. Obtener todas las asignaciones rol-módulo
CREATE OR REPLACE FUNCTION obtener_rol_modulos()
RETURNS SETOF rol_modulo AS
$$
BEGIN
  RETURN QUERY
    SELECT * 
      FROM rol_modulo
     ORDER BY id_rol, id_modulo;
END;
$$
LANGUAGE plpgsql;


-- 2. Obtener asignaciones por rol
CREATE OR REPLACE FUNCTION obtener_modulos_por_rol(p_id_rol INT)
RETURNS SETOF rol_modulo AS
$$
BEGIN
  RETURN QUERY
    SELECT *
      FROM rol_modulo
     WHERE id_rol = p_id_rol
     ORDER BY id_modulo;
END;
$$
LANGUAGE plpgsql;


-- 3. Obtener asignaciones por módulo
CREATE OR REPLACE FUNCTION obtener_roles_por_modulo(p_id_modulo INT)
RETURNS SETOF rol_modulo AS
$$
BEGIN
  RETURN QUERY
    SELECT *
      FROM rol_modulo
     WHERE id_modulo = p_id_modulo
     ORDER BY id_rol;
END;
$$
LANGUAGE plpgsql;


-- 4. Obtener una asignación específica
CREATE OR REPLACE FUNCTION obtener_rol_modulo(p_id_rol INT, p_id_modulo INT)
RETURNS rol_modulo AS
$$
DECLARE
  rm rol_modulo;
BEGIN
  SELECT *
    INTO rm
    FROM rol_modulo
   WHERE id_rol = p_id_rol
     AND id_modulo = p_id_modulo;

  RETURN rm;
END;
$$
LANGUAGE plpgsql;


-- 5. Crear una nueva asignación rol-módulo
CREATE OR REPLACE FUNCTION crear_rol_modulo(
    p_id_rol    INTEGER,
    p_id_modulo INTEGER
)
RETURNS rol_modulo AS
$$
DECLARE
  nueva_asignacion rol_modulo;
BEGIN
  INSERT INTO rol_modulo(id_rol, id_modulo)
       VALUES (p_id_rol, p_id_modulo)
  RETURNING * INTO nueva_asignacion;

  RETURN nueva_asignacion;
END;
$$
LANGUAGE plpgsql;


-- 6. Actualizar una asignación rol-módulo existente
CREATE OR REPLACE FUNCTION actualizar_rol_modulo(
    p_id_rol         INTEGER,
    p_id_modulo      INTEGER,
    p_activo         BOOLEAN
)
RETURNS rol_modulo AS
$$
DECLARE
  asignacion_actualizada rol_modulo;
BEGIN
  UPDATE rol_modulo
     SET activo = p_activo
   WHERE id_rol = p_id_rol
     AND id_modulo = p_id_modulo
  RETURNING * INTO asignacion_actualizada;

  RETURN asignacion_actualizada;
END;
$$
LANGUAGE plpgsql;


-- 7. Eliminar una asignación rol-módulo (borrado físico)
CREATE OR REPLACE FUNCTION eliminar_rol_modulo(p_id_rol INT, p_id_modulo INT)
RETURNS VOID AS
$$
BEGIN
  DELETE FROM rol_modulo
   WHERE id_rol = p_id_rol
     AND id_modulo = p_id_modulo;
END;
$$
LANGUAGE plpgsql;


-- 8. Verificar si existe una asignación
CREATE OR REPLACE FUNCTION existe_rol_modulo(p_id_rol INT, p_id_modulo INT)
RETURNS BOOLEAN AS
$$
DECLARE
  existe BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS(
    SELECT 1 
      FROM rol_modulo 
     WHERE id_rol = p_id_rol 
       AND id_modulo = p_id_modulo
  ) INTO existe;

  RETURN existe;
END;
$$
LANGUAGE plpgsql;


-- Ejemplos de uso:

-- Listar todas las asignaciones
SELECT * FROM obtener_rol_modulos();

-- Crear asignación
SELECT * FROM crear_rol_modulo(1, 1);

-- Obtener módulos de un rol específico
SELECT * FROM obtener_modulos_por_rol(1);

-- Obtener roles de un módulo específico
SELECT * FROM obtener_roles_por_modulo(1);

-- Obtener asignación específica
SELECT * FROM obtener_rol_modulo(1, 1);

-- Verificar si existe asignación
SELECT existe_rol_modulo(1, 1);

-- Actualizar asignación
SELECT * FROM actualizar_rol_modulo(1, 1, FALSE);

-- Borrar asignación
SELECT eliminar_rol_modulo(1, 1);
