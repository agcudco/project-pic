CREATE TABLE modulo (
    id_modulo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    nivel_acceso INT DEFAULT 1,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Intermediate table for many-to-many relationship between rol and modulo
CREATE TABLE rol_modulo (
    id_rol INT REFERENCES rol(id_rol),
    id_modulo INT REFERENCES modulo(id_modulo),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol, id_modulo)
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    cedula VARCHAR(10) unique NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuario_rol (
    id_usuario INT REFERENCES usuario(id_usuario),
    id_rol INT REFERENCES rol(id_rol),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_rol)
);

CREATE TABLE menu (
    id_menu SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_modulo INT REFERENCES modulo(id_modulo),
    id_menu_padre INT REFERENCES menu(id_menu),
    orden INT,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE acciones (
    id_accion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_menu INT REFERENCES menu(id_menu),
    url VARCHAR(255) NOT NULL,
    icono VARCHAR(100),
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);