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