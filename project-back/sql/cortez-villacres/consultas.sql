--producto(id, nombre, descripcion, precio_venta, costo, imagen_url, activo)
CREATE TABLE IF NOT EXISTS producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_venta DECIMAL(10, 2) NOT NULL,
    costo DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE
);

-- 1. Listar todos los productos activos ordenados por id
CREATE OR REPLACE FUNCTION obtener_productos()
RETURNS SETOF producto AS
$$
BEGIN
  RETURN QUERY
    SELECT *
    FROM producto
    WHERE activo = TRUE
    ORDER BY id;
END;
$$
LANGUAGE plpgsql;

-- 2. Obtener un producto por ID
CREATE OR REPLACE FUNCTION obtener_producto_por_id(
  p_id INT
)
RETURNS producto AS
$$
DECLARE
  resultado producto;
BEGIN
  SELECT *
    INTO resultado
    FROM producto
   WHERE id = p_id;

  RETURN resultado;
END;
$$
LANGUAGE plpgsql;

-- 3. Crear un nuevo producto
CREATE OR REPLACE FUNCTION crear_producto(
  p_nombre        VARCHAR,
  p_descripcion   TEXT,
  p_precio_venta  DECIMAL,
  p_costo         DECIMAL,
  p_imagen_url    VARCHAR DEFAULT NULL
)
RETURNS producto AS
$$
DECLARE
  nuevo_producto producto;
BEGIN
  INSERT INTO producto (nombre, descripcion, precio_venta, costo, imagen_url)
  VALUES (
    UPPER(p_nombre),
    p_descripcion,
    p_precio_venta,
    p_costo,
    p_imagen_url
  )
  RETURNING * INTO nuevo_producto;

  RETURN nuevo_producto;
END;
$$
LANGUAGE plpgsql;

-- 4. Actualizar un producto existente
CREATE OR REPLACE FUNCTION actualizar_producto(
  p_id            INT,
  p_nombre        VARCHAR,
  p_descripcion   TEXT,
  p_precio_venta  DECIMAL,
  p_costo         DECIMAL,
  p_imagen_url    VARCHAR DEFAULT NULL
)
RETURNS producto AS
$$
DECLARE
  producto_modificado producto;
BEGIN
  UPDATE producto
     SET nombre        = UPPER(p_nombre),
         descripcion   = p_descripcion,
         precio_venta  = p_precio_venta,
         costo         = p_costo,
         imagen_url    = p_imagen_url
   WHERE id = p_id
  RETURNING * INTO producto_modificado;

  RETURN producto_modificado;
END;
$$
LANGUAGE plpgsql;

-- 5. Eliminar (baja lógica) un producto
CREATE OR REPLACE FUNCTION eliminar_producto(
  p_id INT
)
RETURNS producto AS
$$
DECLARE
  producto_eliminado producto;
BEGIN
  UPDATE producto
     SET activo = FALSE
   WHERE id = p_id
  RETURNING * INTO producto_eliminado;

  RETURN producto_eliminado;
END;
$$
LANGUAGE plpgsql;

-- 6. Listado paginado y filtrado por nombre, rango de precio (y categoría si existiera)
CREATE OR REPLACE FUNCTION filtrar_productos(
  p_nombre        VARCHAR DEFAULT NULL,
  p_precio_min    DECIMAL DEFAULT NULL,
  p_precio_max    DECIMAL DEFAULT NULL,
  p_limit         INT DEFAULT 10,
  p_offset        INT DEFAULT 0
)
RETURNS SETOF producto AS
$$
BEGIN
  RETURN QUERY
    SELECT *
      FROM producto
     WHERE activo = TRUE
       AND (p_nombre IS NULL OR nombre ILIKE '%' || p_nombre || '%')
       AND (p_precio_min IS NULL OR precio_venta >= p_precio_min)
       AND (p_precio_max IS NULL OR precio_venta <= p_precio_max)
     ORDER BY id
     LIMIT p_limit OFFSET p_offset;
END;
$$
LANGUAGE plpgsql;

-- Crear un producto
SELECT * FROM crear_producto('Laptop Lenovo', 'Modelo Ideapad con 16GB RAM', 1200.00, 900.00, '/imagenes/laptop1.jpg');

-- Listar todos los productos activos
SELECT * FROM obtener_productos();

-- Obtener uno por ID
SELECT * FROM obtener_producto_por_id(1);

-- Actualizar
SELECT * FROM actualizar_producto(1, 'Laptop HP', 'Nueva generación Ryzen', 1400.00, 1100.00, '/imagenes/laptop_hp.jpg');

-- Baja lógica (eliminar)
SELECT * FROM eliminar_producto(1);

-- Filtrar por nombre parcial y rango de precio (paginado)
SELECT * FROM filtrar_productos('laptop', 1000, 1500, 5, 0);
