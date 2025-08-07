import pool from '../config/db.js';

class Descuento {
  constructor({ id, nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo }) {
    this.id = id;
    this.nombre = nombre;
    this.valor = valor;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.activo = activo;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_descuentos()');
    return result.rows.map(row => new Descuento(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_descuento($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Descuento(result.rows[0]);
  }

  static async create(data) {
    const { nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo = true } = data;
    const result = await pool.query(
      'SELECT * FROM crear_descuento($1, $2, $3, $4, $5, $6, $7)',
      [nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo]
    );
    return new Descuento(result.rows[0]);
  }

  static async update(id, data) {
    const { nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo } = data;
    const result = await pool.query(
      'SELECT * FROM actualizar_descuento($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo]
    );
    if (result.rowCount === 0) return null;
    return new Descuento(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_descuento($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Descuento(result.rows[0]);
  }

  static async activar(id) {
    const result = await pool.query('SELECT * FROM activar_descuento($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Descuento(result.rows[0]);
  }

  static async desactivar(id) {
    const result = await pool.query('SELECT * FROM desactivar_descuento($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Descuento(result.rows[0]);
  }
}

export default Descuento;
