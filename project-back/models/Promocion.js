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
    // Usando funciones simplificadas que solo trabajan con promociones
    const result = await pool.query('SELECT * FROM obtener_promociones()');
    return result.rows.map(row => new Promocion(row));
  }

  static async getById(id) {
    // Usando función simplificada
    const result = await pool.query('SELECT * FROM obtener_promocion($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async getActivas() {
    // Usando función simplificada
    const result = await pool.query('SELECT * FROM obtener_promociones_activas()');
    return result.rows.map(row => new Promocion(row));
  }

  static async getByTipo(tipo) {
    // Usando función simplificada
    const result = await pool.query('SELECT * FROM obtener_promociones_por_tipo($1)', [tipo]);
    return result.rows.map(row => new Promocion(row));
  }

  static async getVigentes() {
    // Usando función simplificada
    const result = await pool.query('SELECT * FROM obtener_promociones_vigentes()');
    return result.rows.map(row => new Promocion(row));
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
    
    // Usando función simplificada
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
      condicion_json, 
      fecha_inicio, 
      fecha_fin, 
      activa 
    } = data;
    
    // Usando función simplificada
    const result = await pool.query(
      'SELECT * FROM actualizar_promocion($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa]
    );
    
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_promocion($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async activar(id) {
    const result = await pool.query('SELECT * FROM activar_promocion($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async desactivar(id) {
    const result = await pool.query('SELECT * FROM desactivar_promocion($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
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
