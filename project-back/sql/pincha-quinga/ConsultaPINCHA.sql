-----------TRABAJO 29 DE JULIO 2025--------------------
-------------   PINCHA - QUINGA   ---------------------

-----------------   TABLAS   -----------------------
--CATEGORIA
CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);
--PRODUCTO
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

--PRODUCTO CATEGORIA
CREATE TABLE producto_categoria (
  producto_id INT NOT NULL
    REFERENCES producto(id)
    ON DELETE CASCADE,
  categoria_id INT NOT NULL
    REFERENCES categoria(id)
    ON DELETE CASCADE,
  PRIMARY KEY (producto_id, categoria_id)
);


--Datos prueba 
-- Producto 1: Activo
INSERT INTO producto (nombre, descripcion, precio_venta, costo, imagen_url)
VALUES ('Laptop Lenovo', 'Portátil 16GB RAM', 1200.00, 1000.00, 'https://imagen.com/laptop.png');

-- Producto 2: Inactivo
INSERT INTO producto (nombre, descripcion, precio_venta, costo, imagen_url, activo)
VALUES ('Celular Xiaomi', 'Celular gama media', 350.00, 300.00, 'https://imagen.com/xiaomi.png', FALSE);

-- Producto 3: Activo
INSERT INTO producto (nombre, descripcion, precio_venta, costo, imagen_url)
VALUES ('Monitor Samsung', 'Monitor 24 pulgadas', 250.00, 200.00, 'https://imagen.com/monitor.png');

INSERT INTO categoria (nombre) VALUES 
('Tecnología'),
('Oficina'),
('Gamer'),
('Electrodomésticos');



-----------------   FUNCIONES   -----------------------
--FUNCIONES PRODUCTO CATEGORIA 

--crear PRODUCTO CATEGORIA 
CREATE OR REPLACE FUNCTION crear_producto_categoria(
								p_producto_id INT, 
								p_categoria_id INT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO producto_categoria (producto_id, categoria_id)
  VALUES (p_producto_id, p_categoria_id)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM producto_categoria

-- PRUEBA
SELECT crear_producto_categoria(1, 2);


--/////////////////////////////////////////////////////////////////////////

--leer relaciones
CREATE OR REPLACE FUNCTION obtener_producto_categoria()
RETURNS TABLE (
  producto_id INT,
  nombre_producto VARCHAR,
  categoria_id INT,
  nombre_categoria VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.nombre,
    c.id,
    c.nombre
  FROM producto_categoria pc
  JOIN producto p ON pc.producto_id = p.id
  JOIN categoria c ON pc.categoria_id = c.id;
END;
$$ LANGUAGE plpgsql;

-- PRUEBA
SELECT * FROM obtener_producto_categoria();



--//////////////////////////////////////////////////////////////////////////

--leer por ID
CREATE OR REPLACE FUNCTION obtener_categorias_por_producto(p_producto_id INT)
RETURNS TABLE (
  categoria_id INT,
  nombre_categoria VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.nombre
  FROM producto_categoria pc
  JOIN categoria c ON pc.categoria_id = c.id
  WHERE pc.producto_id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

-- PRUEBA
SELECT * FROM obtener_categorias_por_producto(1);


--//////////////////////////////////////////////////////////////////////////

--eliminar relacion
CREATE OR REPLACE FUNCTION eliminar_producto_categoria(p_producto_id INT, p_categoria_id INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM producto_categoria
  WHERE producto_id = p_producto_id AND categoria_id = p_categoria_id;
END;
$$ LANGUAGE plpgsql;

-- PRUEBA
SELECT eliminar_producto_categoria(1, 2);


--//////////////////////////////////////////////////////////////////////////

--no registrar productos si no estan activos por categorias
CREATE OR REPLACE FUNCTION crear_si_producto_activo(p_producto_id INT, p_categoria_id INT)
RETURNS TEXT AS $$
DECLARE
  activo_producto BOOLEAN;
BEGIN
  SELECT activo INTO activo_producto FROM producto WHERE id = p_producto_id;

  IF NOT FOUND THEN
    RETURN 'Producto no encontrado.';
  ELSIF NOT activo_producto THEN
    RETURN 'El producto está inactivo.';
  END IF;

  INSERT INTO producto_categoria (producto_id, categoria_id)
  VALUES (p_producto_id, p_categoria_id)
  ON CONFLICT DO NOTHING;

  RETURN 'Relación creada correctamente.';
END;
$$ LANGUAGE plpgsql;

-- PRUEBA
SELECT crear_si_producto_activo(1, 3);



--//////////////////////////////////////////////////////////////////////////

--verificar relacion
CREATE OR REPLACE FUNCTION relacion_existe(p_producto_id INT, p_categoria_id INT)
RETURNS BOOLEAN AS $$
DECLARE
  existe BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM producto_categoria 
    WHERE producto_id = p_producto_id AND categoria_id = p_categoria_id
  ) INTO existe;

  RETURN existe;
END;
$$ LANGUAGE plpgsql;


-- PRUEBA
SELECT relacion_existe(1, 2);  -- true o false


--//////////////////////////////////////////////////////////////////////////

--cantidad de productos por categoria
CREATE OR REPLACE FUNCTION cantidad_productos_por_categoria()
RETURNS TABLE (
  categoria_id INT,
  nombre_categoria VARCHAR,
  total_productos INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.nombre,
    COUNT(pc.producto_id)
  FROM categoria c
  LEFT JOIN producto_categoria pc ON c.id = pc.categoria_id
  GROUP BY c.id, c.nombre;
END;
$$ LANGUAGE plpgsql;

--PRUEBA
SELECT * FROM cantidad_productos_por_categoria();


--//////////////////////////////////////////////////////////////////////////
--categoria normalizada
CREATE OR REPLACE FUNCTION crear_categoria_normalizada(p_nombre VARCHAR)
RETURNS TEXT AS $$
DECLARE
  nombre_trim TEXT := TRIM(p_nombre);
  nombre_final TEXT := INITCAP(nombre_trim); -- Ej: "tecnología" → "Tecnología"
  existe BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM categoria WHERE TRIM(LOWER(nombre)) = LOWER(nombre_trim)
  ) INTO existe;

  IF existe THEN
    RETURN 'La categoría ya existe.';
  END IF;

  INSERT INTO categoria(nombre)
  VALUES (nombre_final);

  RETURN 'Categoría creada: ' || nombre_final;
END;
$$ LANGUAGE plpgsql;

--PRUEBA
SELECT crear_categoria_normalizada(' tecnologia  ');
SELECT crear_categoria_normalizada('Tecnología');


--//////////////////////////////////////////////////////////////////////////
--Nombres y validaciones
CREATE OR REPLACE FUNCTION crear_producto_normalizado(
  p_nombre TEXT,
  p_descripcion TEXT,
  p_precio_venta NUMERIC,
  p_costo NUMERIC,
  p_imagen_url TEXT,
  p_activo BOOLEAN DEFAULT TRUE
)
RETURNS TEXT AS $$
DECLARE
  nombre_trim TEXT := TRIM(p_nombre);
  nombre_final TEXT := INITCAP(nombre_trim);
  existe BOOLEAN;
BEGIN
  IF p_precio_venta < p_costo THEN
    RETURN 'El precio de venta no puede ser menor al costo.';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM producto WHERE TRIM(LOWER(nombre)) = LOWER(nombre_trim)
  ) INTO existe;

  IF existe THEN
    RETURN 'Ya existe un producto con ese nombre.';
  END IF;

  INSERT INTO producto(nombre, descripcion, precio_venta, costo, imagen_url, activo)
  VALUES (nombre_final, p_descripcion, p_precio_venta, p_costo, p_imagen_url, p_activo);

  RETURN 'Producto creado: ' || nombre_final;
END;
$$ LANGUAGE plpgsql;

--PRUEBA
SELECT crear_producto_normalizado('  Laptop lenovo ', 'portátil potente', 1500, 1200, 'http://img.png');



--//////////////////////////////////////////////////////////////////////////
--validaciones
CREATE OR REPLACE FUNCTION relacionar_producto_categoria_normalizado(
  p_nombre_producto TEXT,
  p_nombre_categoria TEXT
)
RETURNS TEXT AS $$
DECLARE
  nombre_prod TEXT := INITCAP(TRIM(p_nombre_producto));
  nombre_cat TEXT := INITCAP(TRIM(p_nombre_categoria));
  id_prod INT;
  id_cat INT;
  existe BOOLEAN;
  activo_producto BOOLEAN;
BEGIN
  SELECT id, activo INTO id_prod, activo_producto FROM producto
  WHERE TRIM(LOWER(nombre)) = LOWER(TRIM(p_nombre_producto));

  IF id_prod IS NULL THEN
    RETURN 'Producto no encontrado.';
  ELSIF NOT activo_producto THEN
    RETURN 'El producto está inactivo.';
  END IF;

  SELECT id INTO id_cat FROM categoria
  WHERE TRIM(LOWER(nombre)) = LOWER(TRIM(p_nombre_categoria));

  IF id_cat IS NULL THEN
    RETURN 'Categoría no encontrada.';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM producto_categoria
    WHERE producto_id = id_prod AND categoria_id = id_cat
  ) INTO existe;

  IF existe THEN
    RETURN 'La relación ya existe.';
  END IF;

  INSERT INTO producto_categoria(producto_id, categoria_id)
  VALUES (id_prod, id_cat);

  RETURN 'Relación creada entre "' || nombre_prod || '" y "' || nombre_cat || '"';
END;
$$ LANGUAGE plpgsql;

--PRUEBA
SELECT relacionar_producto_categoria_normalizado(' laptop lenovo ', '  tecnologia');
