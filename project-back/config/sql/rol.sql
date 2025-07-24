-- Tabla menu
CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    modulo_id INTEGER REFERENCES modulo(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    url VARCHAR(255),
    icono VARCHAR(50),
    orden INTEGER DEFAULT 0,
    nivel INTEGER DEFAULT 1, -- 1: principal, 2: submenu, 3: sub-submenu
    menu_padre_id INTEGER REFERENCES menu(id) ON DELETE CASCADE, -- Para submenus
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia rol_menu
CREATE TABLE rol_menu (
    id SERIAL PRIMARY KEY,
    rol_id INTEGER REFERENCES rol(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menu(id) ON DELETE CASCADE,
    permisos JSONB DEFAULT '{"leer": true, "escribir": false, "eliminar": false}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rol_id, menu_id)
);

-- Función para obtener todos los menús
CREATE OR REPLACE FUNCTION obtener_menus()
RETURNS SETOF menu AS $$
BEGIN
    RETURN QUERY SELECT * FROM menu ORDER BY orden, id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener un menú por ID
CREATE OR REPLACE FUNCTION obtener_menu_por_id(p_id INTEGER)
RETURNS menu AS $$
DECLARE
    resultado menu;
BEGIN
    SELECT * INTO resultado FROM menu WHERE id = p_id;
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Función para crear un menú
CREATE OR REPLACE FUNCTION crear_menu(
    p_modulo_id INTEGER,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_url VARCHAR,
    p_icono VARCHAR,
    p_orden INTEGER,
    p_nivel INTEGER,
    p_menu_padre_id INTEGER,
    p_estado BOOLEAN
)
RETURNS menu AS $$
DECLARE
    nuevo_menu menu;
BEGIN
    INSERT INTO menu (modulo_id, nombre, descripcion, url, icono, orden, nivel, menu_padre_id, estado)
    VALUES (p_modulo_id, p_nombre, p_descripcion, p_url, p_icono, p_orden, p_nivel, p_menu_padre_id, p_estado)
    RETURNING * INTO nuevo_menu;

    RETURN nuevo_menu;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar un menú
CREATE OR REPLACE FUNCTION actualizar_menu(
    p_id INTEGER,
    p_modulo_id INTEGER,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_url VARCHAR,
    p_icono VARCHAR,
    p_orden INTEGER,
    p_nivel INTEGER,
    p_menu_padre_id INTEGER,
    p_estado BOOLEAN
)
RETURNS menu AS $$
DECLARE
    menu_actualizado menu;
BEGIN
    UPDATE menu
    SET modulo_id = p_modulo_id,
        nombre = p_nombre,
        descripcion = p_descripcion,
        url = p_url,
        icono = p_icono,
        orden = p_orden,
        nivel = p_nivel,
        menu_padre_id = p_menu_padre_id,
        estado = p_estado,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING * INTO menu_actualizado;

    RETURN menu_actualizado;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar un menú
CREATE OR REPLACE FUNCTION eliminar_menu(p_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM menu WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener menús por módulo
CREATE OR REPLACE FUNCTION obtener_menus_por_modulo(p_modulo_id INTEGER)
RETURNS SETOF menu AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM menu 
    WHERE modulo_id = p_modulo_id AND estado = true 
    ORDER BY orden, id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener menús principales (nivel 1)
CREATE OR REPLACE FUNCTION obtener_menus_principales()
RETURNS SETOF menu AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM menu 
    WHERE nivel = 1 AND estado = true 
    ORDER BY orden, id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener submenús de un menú
CREATE OR REPLACE FUNCTION obtener_submenus(p_menu_padre_id INTEGER)
RETURNS SETOF menu AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM menu 
    WHERE menu_padre_id = p_menu_padre_id AND estado = true 
    ORDER BY orden, id;
END;
$$ LANGUAGE plpgsql;

-- Función para asignar menú a rol
CREATE OR REPLACE FUNCTION asignar_menu_a_rol(
    p_rol_id INTEGER,
    p_menu_id INTEGER,
    p_permisos JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO rol_menu (rol_id, menu_id, permisos)
    VALUES (p_rol_id, p_menu_id, p_permisos)
    ON CONFLICT (rol_id, menu_id) 
    DO UPDATE SET permisos = p_permisos;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para remover menú de rol
CREATE OR REPLACE FUNCTION remover_menu_de_rol(
    p_rol_id INTEGER,
    p_menu_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM rol_menu 
    WHERE rol_id = p_rol_id AND menu_id = p_menu_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener menús por rol
CREATE OR REPLACE FUNCTION obtener_menus_por_rol(p_rol_id INTEGER)
RETURNS TABLE(
    id INTEGER,
    modulo_id INTEGER,
    nombre VARCHAR,
    descripcion TEXT,
    url VARCHAR,
    icono VARCHAR,
    orden INTEGER,
    nivel INTEGER,
    menu_padre_id INTEGER,
    estado BOOLEAN,
    permisos JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.modulo_id, m.nombre, m.descripcion, m.url, m.icono, 
           m.orden, m.nivel, m.menu_padre_id, m.estado, rm.permisos
    FROM menu m
    INNER JOIN rol_menu rm ON m.id = rm.menu_id
    WHERE rm.rol_id = p_rol_id AND m.estado = true
    ORDER BY m.orden, m.id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estructura completa de menú por rol (jerárquica)
CREATE OR REPLACE FUNCTION obtener_estructura_menu_por_rol(p_rol_id INTEGER)
RETURNS TABLE(
    menu_principal JSONB,
    submenus JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH menus_principales AS (
        SELECT m.*, rm.permisos
        FROM menu m
        INNER JOIN rol_menu rm ON m.id = rm.menu_id
        WHERE rm.rol_id = p_rol_id AND m.nivel = 1 AND m.estado = true
    ),
    submenus_data AS (
        SELECT 
            mp.id as menu_principal_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', sm.id,
                    'nombre', sm.nombre,
                    'descripcion', sm.descripcion,
                    'url', sm.url,
                    'icono', sm.icono,
                    'orden', sm.orden,
                    'nivel', sm.nivel,
                    'permisos', rsm.permisos
                ) ORDER BY sm.orden, sm.id
            ) as submenus_json
        FROM menus_principales mp
        LEFT JOIN menu sm ON sm.menu_padre_id = mp.id AND sm.estado = true
        LEFT JOIN rol_menu rsm ON sm.id = rsm.menu_id AND rsm.rol_id = p_rol_id
        GROUP BY mp.id
    )
    SELECT 
        jsonb_build_object(
            'id', mp.id,
            'modulo_id', mp.modulo_id,
            'nombre', mp.nombre,
            'descripcion', mp.descripcion,
            'url', mp.url,
            'icono', mp.icono,
            'orden', mp.orden,
            'nivel', mp.nivel,
            'permisos', mp.permisos
        ) as menu_principal,
        COALESCE(sd.submenus_json, '[]'::jsonb) as submenus
    FROM menus_principales mp
    LEFT JOIN submenus_data sd ON mp.id = sd.menu_principal_id
    ORDER BY mp.orden, mp.id;
END;
$$ LANGUAGE plpgsql;


-- Insertar menús de prueba
INSERT INTO menu (modulo_id, nombre, descripcion, url, icono, orden, nivel, menu_padre_id, estado) VALUES
-- Menús principales del módulo Usuarios (asumiendo que modulo_id = 1)
(1, 'Gestión de Usuarios', 'Administración de usuarios del sistema', '/usuarios', 'user-icon', 1, 1, NULL, true),
(1, 'Roles y Permisos', 'Gestión de roles y permisos', '/roles', 'lock-icon', 2, 1, NULL, true),
-- Submenús de Gestión de Usuarios
(1, 'Crear Usuario', 'Crear nuevos usuarios', '/usuarios/crear', 'plus-icon', 1, 2, 1, true),
(1, 'Listar Usuarios', 'Ver listado de usuarios', '/usuarios/listar', 'list-icon', 2, 2, 1, true),
(1, 'Editar Usuario', 'Editar usuarios existentes', '/usuarios/editar', 'edit-icon', 3, 2, 1, true),
-- Submenús de Roles y Permisos
(1, 'Crear Rol', 'Crear nuevos roles', '/roles/crear', 'plus-icon', 1, 2, 2, true),
(1, 'Asignar Permisos', 'Asignar permisos a roles', '/roles/permisos', 'key-icon', 2, 2, 2, true),
-- Menús del módulo Reportes (asumiendo que modulo_id = 2)
(2, 'Reportes Generales', 'Reportes del sistema', '/reportes', 'chart-icon', 1, 1, NULL, true),
(2, 'Reportes de Ventas', 'Reportes específicos de ventas', '/reportes/ventas', 'sales-icon', 2, 1, NULL, true);


select * from obtener_menus()