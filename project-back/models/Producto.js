import pool from "../config/db.js";

class Producto {
  constructor({
    id,
    nombre,
    descripcion,
    precio_venta,
    costo,
    imagen_url,
    activo,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio_venta = precio_venta;
    this.costo = costo;
    this.imagen_url = imagen_url;
    this.activo = activo;
  }

  // Obtener todos los productos activos ordenados por id
  static async getAll() {
    const result = await pool.query("SELECT * FROM obtener_productos()");
    return result.rows.map((row) => new Producto(row));
  }

  // Obtener producto por ID
  static async getById(id) {
    const result = await pool.query(
      "SELECT * FROM obtener_producto_por_id($1)",
      [id]
    );
    if (result.rowCount === 0) return null;
    return new Producto(result.rows[0]);
  }

  // Crear producto
  static async create(data) {
    const { nombre, descripcion, precio_venta, costo, imagen_url } = data;
    const result = await pool.query(
      "SELECT * FROM crear_producto($1, $2, $3, $4, $5)",
      [nombre, descripcion, precio_venta, costo, imagen_url]
    );
    return new Producto(result.rows[0]);
  }

  // Actualizar producto
  static async update(id, data) {
    const { nombre, descripcion, precio_venta, costo, imagen_url } = data;
    const result = await pool.query(
      "SELECT * FROM actualizar_producto($1, $2, $3, $4, $5, $6)",
      [id, nombre, descripcion, precio_venta, costo, imagen_url]
    );
    return new Producto(result.rows[0]);
  }

  // Eliminar producto (baja lógica)
  static async remove(id) {
    const result = await pool.query("SELECT * FROM eliminar_producto($1)", [
      id,
    ]);
    if (result.rowCount === 0) return null;
    return new Producto(result.rows[0]);
  }

  // Filtrar productos con paginación
  static async filter({
    nombre = null,
    precio_min = null,
    precio_max = null,
    limit = 10,
    offset = 0,
  }) {
    const result = await pool.query(
      "SELECT * FROM filtrar_productos($1, $2, $3, $4, $5)",
      [nombre, precio_min, precio_max, limit, offset]
    );
    return result.rows.map((row) => new Producto(row));
  }
}

export default Producto;
