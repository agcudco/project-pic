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