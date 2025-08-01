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
LANGUAGE plpgsql;









