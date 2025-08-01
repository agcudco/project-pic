import pool from '../config/db.js';

class Promocion {
  constructor({ id, nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa }) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.valor = valor;
    this.condicion_json = condicion_json;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.activa = activa;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_promociones()');
    return result.rows.map(row => new Promocion(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_promocion($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async getActivas() {
    const result = await pool.query('SELECT * FROM obtener_promociones_activas()');
    return result.rows.map(row => new Promocion(row));
  }

  static async getByTipo(tipo) {
    // Para esta versión inicial, filtramos por tipo usando SQL directo
    const result = await pool.query('SELECT * FROM ventas.promocion WHERE tipo = $1 AND activa = true', [tipo]);
    return result.rows.map(row => new Promocion(row));
  }

  static async getVigentes() {
    // Promociones vigentes = activas y dentro del rango de fechas
    const result = await pool.query(`
      SELECT * FROM ventas.promocion 
      WHERE activa = true 
      AND fecha_inicio <= CURRENT_DATE 
      AND fecha_fin >= CURRENT_DATE
      ORDER BY fecha_inicio DESC
    `);
    return result.rows.map(row => new Promocion(row));
  }


  //====================================================================
  static async create(data) {
    const { 
      nombre, 
      tipo, 
      valor, 
      condicion_json = null, 
      fecha_inicio, 
      fecha_fin, 
      activa = true 
    } = data;
    
    const result = await pool.query(
      'SELECT * FROM crear_promocion($1, $2, $3, $4, $5, $6, $7)',
      [nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa]
    );
    return new Promocion(result.rows[0]);
  }

  static async update(id, data) {
    const { 
      nombre, 
      tipo, 
      valor, 
      condicion_json = null, 
      fecha_inicio, 
      fecha_fin, 
      activa 
    } = data;
    
    const result = await pool.query(
      'SELECT * FROM actualizar_promocion($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa]
    );
    return new Promocion(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_promocion($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async activar(id) {
    const result = await pool.query('UPDATE ventas.promocion SET activa = true WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async desactivar(id) {
    const result = await pool.query('UPDATE ventas.promocion SET activa = false WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async aplicarDescuento(ventaId, promocionId) {
    const result = await pool.query('SELECT * FROM registrar_venta_promocion($1, $2, $3)', [ventaId, promocionId, 0]);
    return result.rows[0];
  }
}

export default Promocion;
