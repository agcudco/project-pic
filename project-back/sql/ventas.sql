-- 1. Crear esquema y ajustar search_path
CREATE SCHEMA IF NOT EXISTS ventas;
SET search_path = ventas;

-- 2. Catálogo de productos y categorías
CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio_venta NUMERIC(12,2) NOT NULL CHECK (precio_venta >= 0),
  costo NUMERIC(12,2) NOT NULL CHECK (costo >= 0),
  imagen_url TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  -- regla de negocio: precio_venta >= costo
  CHECK (precio_venta >= costo)
);

CREATE TABLE producto_categoria (
  producto_id INT NOT NULL
    REFERENCES producto(id)
    ON DELETE CASCADE,
  categoria_id INT NOT NULL
    REFERENCES categoria(id)
    ON DELETE CASCADE,
  PRIMARY KEY (producto_id, categoria_id)
);

-- 3. Sucursales e inventario
CREATE TABLE sucursal (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT
);

CREATE TABLE inventario (
  id SERIAL PRIMARY KEY,
  producto_id INT NOT NULL
    REFERENCES producto(id)
    ON DELETE RESTRICT,
  sucursal_id INT NOT NULL
    REFERENCES sucursal(id)
    ON DELETE RESTRICT,
  stock_actual INT NOT NULL CHECK (stock_actual >= 0),
  stock_minimo INT NOT NULL CHECK (stock_minimo >= 0)
);

-- 4. Clientes
DROP TABLE IF EXISTS cliente CASCADE;
CREATE TABLE cliente (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE
    REFERENCES public.usuario(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  tipo VARCHAR(20) NOT NULL
    CHECK (tipo IN ('persona','empresa')),
  razon_social VARCHAR(150)  -- sólo para empresas; NULL para personas
);
-- 5. Ventas y sus detalles
CREATE TABLE venta (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL
    REFERENCES cliente(id)
    ON DELETE RESTRICT,
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente','confirmada','anulada'))
);

CREATE TABLE venta_detalle (
  id SERIAL PRIMARY KEY,
  venta_id INT NOT NULL
    REFERENCES venta(id)
    ON DELETE CASCADE,
  producto_id INT NOT NULL
    REFERENCES producto(id)
    ON DELETE RESTRICT,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0)
);

-- 6. Facturación
CREATE TABLE factura (
  id SERIAL PRIMARY KEY,
  venta_id INT NOT NULL
    UNIQUE
    REFERENCES venta(id)
    ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL,        -- e.g. 'A', 'B', 'C', 'Ticket'
  numero VARCHAR(50) NOT NULL UNIQUE,
  fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
  monto_total NUMERIC(12,2) NOT NULL CHECK (monto_total >= 0)
);

-- 7. Promociones y asociación con productos/categorías
CREATE TABLE promocion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL
    CHECK (tipo IN ('producto','categoria','monto_total','cantidad')),
  valor NUMERIC(12,2) NOT NULL CHECK (valor >= 0),
  condicion_json JSONB,            -- para reglas específicas (p.ej. {"min_qty":2})
  fecha_inicio DATE NOT NULL,
  fecha_fin   DATE NOT NULL,
  activa      BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (fecha_fin >= fecha_inicio)
);

CREATE TABLE promocion_producto (
  promocion_id INT NOT NULL
    REFERENCES promocion(id)
    ON DELETE CASCADE,
  producto_id   INT NOT NULL
    REFERENCES producto(id)
    ON DELETE CASCADE,
  PRIMARY KEY (promocion_id, producto_id)
);

CREATE TABLE promocion_categoria (
  promocion_id INT NOT NULL
    REFERENCES promocion(id)
    ON DELETE CASCADE,
  categoria_id  INT NOT NULL
    REFERENCES categoria(id)
    ON DELETE CASCADE,
  PRIMARY KEY (promocion_id, categoria_id)
);

CREATE TABLE venta_promocion (
  id SERIAL PRIMARY KEY,
  venta_id INT NOT NULL
    REFERENCES venta(id)
    ON DELETE CASCADE,
  promocion_id INT NOT NULL
    REFERENCES promocion(id)
    ON DELETE RESTRICT,
  monto_descuento NUMERIC(12,2) NOT NULL CHECK (monto_descuento >= 0)
);

-- 8. Índices adicionales (opcional)
CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_categoria_nombre ON categoria(nombre);
CREATE INDEX idx_venta_fecha ON venta(fecha_hora);
