-- 1) Insertar módulos
INSERT INTO modulo (nombre, descripcion)
VALUES 
  ('Gestión de Usuarios', 'Módulo para administrar usuarios del sistema'),
  ('Gestión de Roles', 'Módulo para definir y asignar roles');

-- 2) Insertar roles
INSERT INTO rol (nombre, descripcion, nivel_acceso)
VALUES 
  ('Administrador', 'Rol con todos los permisos', 10),
  ('Editor', 'Rol con permisos de edición', 5);

-- 3) Insertar usuarios
INSERT INTO usuario (cedula, nombres, apellidos, email, telefono, contrasenia)
VALUES 
  ('0102030405', 'Juan', 'Pérez', 'juan.perez@ejemplo.com', '0987654321', 'Secret123'),
  ('0203040506', 'María', 'Gómez', 'maria.gomez@ejemplo.com', '0998765432', 'Clave456');

-- 4) Asignar módulos a roles
INSERT INTO rol_modulo (id_rol, id_modulo)
VALUES 
  (1, 1),  -- Administrador → Gestión de Usuarios
  (1, 2),  -- Administrador → Gestión de Roles
  (2, 1);  -- Editor → Gestión de Usuarios

-- 5) Asignar roles a usuarios
INSERT INTO rol_usuario (id_rol, id_usuario)
VALUES
  (1, 1),  -- Juan Pérez como Administrador
  (2, 2);  -- María Gómez como Editor

-- 6) Crear menú principal para Gestión de Usuarios
INSERT INTO menu (nombre, id_modulo, id_menu_padre, orden, descripcion)
VALUES
  ('Usuarios', 1, NULL, 1, 'Menú para todo lo relacionado con usuarios'),
  ('Crear Usuario', 1, 1, 1, 'Opción para registrar un nuevo usuario');

-- 7) Añadir otras opciones de menú
INSERT INTO menu (nombre, id_modulo, id_menu_padre, orden, descripcion)
VALUES
  ('Listar Usuarios', 1, 1, 2, 'Opción para ver todos los usuarios'),
  ('Roles', 2, NULL, 1, 'Menú para la gestión de roles');

-- 8) Definir acciones para “Usuarios”
INSERT INTO acciones (nombre, id_menu, url, icono, descripcion)
VALUES
  ('Crear Usuario', 2, '/usuarios/crear', 'user-plus', 'Crea un nuevo usuario'),
  ('Ver Usuarios', 3, '/usuarios', 'users', 'Lista todos los usuarios');

-- 9) Definir acciones para “Roles”
INSERT INTO acciones (nombre, id_menu, url, icono, descripcion)
VALUES
  ('Crear Rol', 4, '/roles/crear', 'shield-plus', 'Crea un nuevo rol'),
  ('Listar Roles', 4, '/roles', 'shield', 'Lista todos los roles');

-- 10) Desactivar un módulo y un rol de ejemplo (uso de la columna activo)
INSERT INTO modulo (nombre, descripcion, activo)
VALUES
  ('Módulo Archivado', 'Módulo ya no en uso', FALSE);

INSERT INTO rol (nombre, descripcion, activo)
VALUES
  ('Rol Antiguo', 'Rol eliminado del sistema', FALSE);


SELECT * FROM get_todos_usuarios()

-- ------------------------------
-- 1) Datos de prueba: Roles
-- ------------------------------
INSERT INTO rol (nombre, descripcion, nivel_acceso) VALUES
  ('SuperAdmin',  'Acceso absoluto',      10),
  ('Soporte',     'Acceso a funciones de soporte', 4),
  ('ClienteWeb',  'Acceso a portal web',  1);

-- ------------------------------
-- 2) Datos de prueba: Usuarios
-- ------------------------------
INSERT INTO usuario (cedula, nombres, apellidos, email, telefono, contrasenia, activo) VALUES
  ('0708091011', 'Lorena',   'Vega',      'lorena.vega@demo.com',     '0995544332', 'PwdVega07', TRUE),
  ('0809101112', 'Miguel',   'Torres',    'miguel.torres@demo.com',   '0986677885', 'PwdMiguel08', TRUE),
  ('0910111213', 'Carla',    'Ramos',     'carla.ramos@demo.com',     '0973344556', 'PwdCarla09', FALSE), -- inactivo
  ('1011121314', 'Ricardo',  'Suarez',    'ricardo.suarez@demo.com',  '0962233445', 'PwdRicardo10', TRUE),
  ('1112131415', 'Valentina','Lopez',     'valentina.lopez@demo.com', '0951122334', 'PwdValentina11', TRUE);

-- ------------------------------
-- 3) Datos de prueba: Asignación de roles
-- ------------------------------
INSERT INTO rol_usuario (id_rol, id_usuario) VALUES
  (2, 1),  -- Lorena → SuperAdmin
  (2, 2),  -- Miguel → Soporte
  (3, 3),  -- Carla → ClienteWeb
  (3, 4),  -- Ricardo → ClienteWeb
  (3, 5);  -- Valentina → ClienteWeb

-- ------------------------------
-- 4) Datos de prueba: Clientes (schema ventas.cliente)
-- ------------------------------
INSERT INTO ventas.cliente (usuario_id, tipo, razon_social) VALUES
  (3, 'Individual', 'Carla Ramos'),       -- Carla
  (4, 'PyME',        'Suarez Tech S.A.'), -- Ricardo
  (5, 'Corporativo','Lopez & Asociados'); -- Valentina

-- Ahora ya tienes 5 usuarios, 3 de ellos con registro en ventas.cliente,
-- y uno marcado como inactivo para probar filtrados si lo deseas.


CREATE OR REPLACE FUNCTION list_all_usuarios()
RETURNS TABLE (
    id             INTEGER,
    cedula         VARCHAR,
    nombres        VARCHAR,
    apellidos      VARCHAR,
    email          VARCHAR,
    telefono       VARCHAR,
    contrasenia    VARCHAR,
    fecha_registro TIMESTAMP,
    ultimo_login   TIMESTAMP,
    activo         BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
      u.id,
      u.cedula,
      u.nombres,
      u.apellidos,
      u.email,
      u.telefono,
      u.contrasenia,
      u.fecha_registro,
      u.ultimo_login,
      u.activo
    FROM usuario u
    ORDER BY u.id;
END;
$$ LANGUAGE plpgsql;


select * from list_all_usuarios();