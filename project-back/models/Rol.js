import pool from '../config/db.js';

class Rol {
  constructor({ id, nombre, descripcion, estado, created_at, updated_at }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_roles()');
    return result.rows.map(row => new Rol(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_rol_por_id($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Rol(result.rows[0]);
  }

  static async create(data) {
    const { nombre, descripcion, estado } = data;
    const result = await pool.query(
      'SELECT * FROM crear_rol($1, $2, $3)',
      [nombre, descripcion, estado]
    );
    return new Rol(result.rows[0]);
  }

  static async update(id, data) {
    const { nombre, descripcion, estado } = data;
    const result = await pool.query(
      'SELECT * FROM actualizar_rol($1, $2, $3, $4)',
      [id, nombre, descripcion, estado]
    );
    return new Rol(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT eliminar_rol($1)', [id]);
    return result.rows[0].eliminar_rol;
  }

  // Métodos adicionales para relación con módulos
  static async getModulosByRol(rolId) {
    const result = await pool.query('SELECT * FROM obtener_modulos_por_rol($1)', [rolId]);
    return result.rows;
  }

  static async assignModulo(rolId, moduloId, permisos = {}) {
    const result = await pool.query(
      'SELECT asignar_modulo_a_rol($1, $2, $3)',
      [rolId, moduloId, permisos]
    );
    return result.rows[0].asignar_modulo_a_rol;
  }

  static async removeModulo(rolId, moduloId) {
    const result = await pool.query(
      'SELECT remover_modulo_de_rol($1, $2)',
      [rolId, moduloId]
    );
    return result.rows[0].remover_modulo_de_rol;
  }
}

export default Rol;