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


SELECT * FROM crear_rol('ADMIN','ADMINISTRA EL SISTEMA');

SELECT * FROM crear_rol('user','usuario generico');

SELECT * FROM obtener_roles();