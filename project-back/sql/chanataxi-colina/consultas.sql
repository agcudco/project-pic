CREATE OR REPLACE FUNCTION crear_usuario_completo(
    p_cedula VARCHAR,
    p_nombres VARCHAR,
    p_apellidos VARCHAR,
    p_email VARCHAR,
    p_telefono VARCHAR,
    p_contrasenia VARCHAR,
    p_id_rol INTEGER,
    p_tipo_cliente VARCHAR DEFAULT 'persona',
    p_razon_social VARCHAR DEFAULT NULL
) RETURNS usuario AS $$
DECLARE
    nuevo_usuario usuario;
BEGIN
    -- Insertar en usuario
    INSERT INTO usuario (cedula, nombres, apellidos, email, telefono, contrasenia)
    VALUES (p_cedula, p_nombres, p_apellidos, p_email, p_telefono, p_contrasenia)
    RETURNING * INTO nuevo_usuario;

    -- Asignar rol
    INSERT INTO rol_usuario (id_rol, id_usuario)
    VALUES (p_id_rol, nuevo_usuario.id);

    -- Registrar cliente
    INSERT INTO ventas.cliente (usuario_id, tipo, razon_social)
    VALUES (nuevo_usuario.id, p_tipo_cliente, p_razon_social);

    RETURN nuevo_usuario;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION actualizar_usuario_completo(
    p_id_usuario INTEGER,
    p_cedula VARCHAR,
    p_nombres VARCHAR,
    p_apellidos VARCHAR,
    p_email VARCHAR,
    p_telefono VARCHAR,
    p_contrasenia VARCHAR,
    p_id_rol INTEGER,
    p_tipo_cliente VARCHAR DEFAULT 'persona',
    p_razon_social VARCHAR DEFAULT NULL
) RETURNS usuario AS $$
DECLARE
    usuario_actualizado usuario;
BEGIN
    -- Actualizar usuario
    UPDATE usuario
    SET cedula = p_cedula,
        nombres = p_nombres,
        apellidos = p_apellidos,
        email = p_email,
        telefono = p_telefono,
        contrasenia = p_contrasenia
    WHERE id = p_id_usuario
    RETURNING * INTO usuario_actualizado;

    -- Actualizar rol
    UPDATE rol_usuario
    SET id_rol = p_id_rol
    WHERE id_usuario = p_id_usuario;

    -- Actualizar cliente
    UPDATE ventas.cliente
    SET tipo = p_tipo_cliente,
        razon_social = p_razon_social
    WHERE usuario_id = p_id_usuario;

    RETURN usuario_actualizado;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION eliminar_usuario_completo(
    p_id_usuario INTEGER
) RETURNS usuario AS $$
DECLARE
    usuario_eliminado usuario;
BEGIN
    -- Guardar registro antes de eliminar
    SELECT * INTO usuario_eliminado FROM usuario WHERE id = p_id_usuario;

    -- Eliminar cliente y rol_usuario
    DELETE FROM ventas.cliente WHERE usuario_id = p_id_usuario;
    DELETE FROM rol_usuario WHERE id_usuario = p_id_usuario;

    -- Eliminar usuario
    DELETE FROM usuario WHERE id = p_id_usuario;

    RETURN usuario_eliminado;
END;
$$ LANGUAGE plpgsql;


create or replace function get_usuario(
    p_id_usuario INTEGER
) RETURNS TABLE (
    id INTEGER,
    cedula VARCHAR,
    nombres VARCHAR,
    apellidos VARCHAR,
    email VARCHAR,
    telefono VARCHAR,
    contrasenia VARCHAR,
    id_rol INTEGER,
    tipo_cliente VARCHAR,
    razon_social VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id,
           u.cedula,
           u.nombres,
           u.apellidos,
           u.email,
           u.telefono,
           u.contrasenia,
           ru.id_rol,
           c.tipo,
           c.razon_social
    FROM usuario u
    JOIN rol_usuario ru ON u.id = ru.id_usuario
    JOIN ventas.cliente c ON u.id = c.usuario_id
    WHERE u.id = p_id_usuario;
END;
$$ LANGUAGE plpgsql;

-- funcion para obtener todos los usuarios sin filtros
CREATE OR REPLACE FUNCTION get_todos_usuarios()
RETURNS TABLE (
    id INTEGER,
    cedula VARCHAR,
    nombres VARCHAR,
    apellidos VARCHAR,
    email VARCHAR,
    telefono VARCHAR,
    contrasenia VARCHAR,
    id_rol INTEGER,
    tipo_cliente VARCHAR,
    razon_social VARCHAR
) AS $$ 
BEGIN
    RETURN QUERY
    SELECT u.id,
           u.cedula,
           u.nombres,
           u.apellidos,
           u.email,
           u.telefono,
           u.contrasenia,
           ru.id_rol,
           c.tipo,
           c.razon_social
    FROM usuario u
    JOIN rol_usuario ru ON u.id = ru.id_usuario
    JOIN ventas.cliente c ON u.id = c.usuario_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION inactivar_usuario_completo(
    p_id_usuario INTEGER
) RETURNS usuario AS $$
DECLARE
    usuario_inactivado usuario;
BEGIN
    -- Baja lógica
    UPDATE usuario
    SET activo = FALSE
    WHERE id = p_id_usuario
    RETURNING * INTO usuario_inactivado;

    -- Baja lógica en tabla de roles
    UPDATE rol_usuario
    SET activo = FALSE
    WHERE id_usuario = p_id_usuario;

    RETURN usuario_inactivado;
END;
$$ LANGUAGE plpgsql;
