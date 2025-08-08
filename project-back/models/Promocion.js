import pool from '../config/db.js';
//Anahy Herrera - Kevin Lechon
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
  // Usar solo la función obtener_promociones() y devolver los datos tal como vienen
  const result = await pool.query('SELECT * FROM obtener_promociones()');
  return result.rows;
  }

  static async getById(id) {
  // Usar solo la función y devolver el objeto tal como viene
  const result = await pool.query('SELECT * FROM obtener_promocion($1)', [id]);
  if (result.rowCount === 0) return null;
  return result.rows[0];
  }

  static async getActivas() {
  // Usar solo la función y devolver el array tal como viene
  const result = await pool.query('SELECT * FROM obtener_promociones_activas()');
  return result.rows;
  }

  static async getByTipo(tipo) {
  // Usar solo la función y devolver el array tal como viene
  const result = await pool.query('SELECT * FROM obtener_promociones_por_tipo($1)', [tipo]);
  return result.rows;
  }

  static async getVigentes() {
  // Usar solo la función y devolver el array tal como viene
  const result = await pool.query('SELECT * FROM obtener_promociones_vigentes()');
  return result.rows;
  }

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
    // Usar solo función crear_promocion y devolver el objeto tal como viene
    const result = await pool.query(
      'SELECT * FROM crear_promocion($1, $2, $3, $4, $5, $6, $7)',
      [nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { 
      nombre, 
      tipo, 
      valor, 
      condicion_json, 
      fecha_inicio, 
      fecha_fin, 
      activa 
    } = data;
    // Usar solo función actualizar_promocion y devolver el objeto tal como viene
    const result = await pool.query(
      'SELECT * FROM actualizar_promocion($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa]
    );
    if (result.rowCount === 0) return null;
    return result.rows[0];
  }

  static async remove(id) {
  // Usar solo función eliminar_promocion y devolver el objeto tal como viene
  const result = await pool.query('SELECT * FROM eliminar_promocion($1)', [id]);
  if (result.rowCount === 0) return null;
  return result.rows[0];
  }

  static async activar(id) {
  // Usar solo función activar_promocion y devolver el objeto tal como viene
  const result = await pool.query('SELECT * FROM activar_promocion($1)', [id]);
  if (result.rowCount === 0) return null;
  return result.rows[0];
  }

  static async desactivar(id) {
  // Usar solo función desactivar_promocion y devolver el objeto tal como viene
  const result = await pool.query('SELECT * FROM desactivar_promocion($1)', [id]);
  if (result.rowCount === 0) return null;
  return result.rows[0];
  }

  static async aplicarDescuento(ventaId, promocionId, montoBase = 100, cantidad = 1) {
    // Usando función de cálculo de descuento simplificada
    const result = await pool.query(
      'SELECT * FROM calcular_descuento_promocion($1, $2, $3)',
      [promocionId, montoBase, cantidad]
    );
    return result.rows[0];
  }
}

export default Promocion;
