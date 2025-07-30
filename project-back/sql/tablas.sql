CREATE Table modulo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT now()
);

create table rol (
    id SERIAL PRIMARY key,
    nombre VARCHAR(50) not null,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    nivel_acceso INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT now()
);

create table rol_modulo(
    id_rol INTEGER REFERENCES rol(id),
    id_modulo INTEGER REFERENCES modulo(id),
    fecha_asignacion TIMESTAMP DEFAULT now(),
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_rol,id_modulo)
);

create table usuario (
    id SERIAL PRIMARY key,
    cedula VARCHAR(10) UNIQUE NOT null,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    email VARCHAR(30) UNIQUE not null,
    telefono VARCHAR(10),
    contrasenia VARCHAR(20) not null,
    fecha_registro TIMESTAMP DEFAULT now(),
    ultimo_login TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

create table rol_usuario(
    id_rol INTEGER REFERENCES rol(id),
    id_usuario INTEGER REFERENCES usuario(id),
    fecha_asignacion TIMESTAMP DEFAULT now(),
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_rol,id_usuario)
);

CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_modulo INT REFERENCES modulo(id),
    id_menu_padre INT REFERENCES menu(id),
    orden INT,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE acciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_menu INT REFERENCES menu(id),
    url VARCHAR(255) NOT NULL,
    icono VARCHAR(100),
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


