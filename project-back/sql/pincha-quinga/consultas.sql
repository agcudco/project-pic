CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
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


CREATE TABLE promocion_categoria (
  promocion_id INT NOT NULL
    REFERENCES promocion(id)
    ON DELETE CASCADE,
  categoria_id  INT NOT NULL
    REFERENCES categoria(id)
    ON DELETE CASCADE,
  PRIMARY KEY (promocion_id, categoria_id)
);