-- Active: 1754156374522@@127.0.0.1@5432@project_db
--Funcione para Login

SET search_path = public;

-- Obtener usuario
CREATE OR REPLACE FUNCTION obtener_usuario(p_id INT)
RETURNS usuario AS
$$
DECLARE
  u usuario;
BEGIN
  SELECT *
    INTO u
    FROM usuario
   WHERE id = p_id;

  RETURN u;
END;
$$
LANGUAGE plpgsql;

-- Funciones para obtener roles
CREATE OR REPLACE FUNCTION obtener_roles()
RETURNS SETOF rol AS 
$$
  BEGIN
    RETURN QUERY SELECT * FROM rol ORDER BY id;
  END;  
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verificacion_credenciales(p_usuario VARCHAR, contrasenia VARCHAR)
RETURNS BOOLEAN AS
$$
DECLARE
  existe BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM usuario
    WHERE usuario = p_usuario
      AND contrasenia = p_contrasenia
      AND activo = TRUE
  ) INTO existe;

  RETURN existe;
END;
$$
LANGUAGE plpgsql;