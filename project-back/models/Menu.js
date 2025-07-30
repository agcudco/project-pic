import pool from '../config/db.js';

class Menu {
  constructor({ id, nombre, id_modulo, id_menu_padre, orden, descripcion, fecha_creacion }) {
    this.id = id;
    this.nombre = nombre;
    this.id_modulo = id_modulo;
    this.id_menu_padre = id_menu_padre;
    this.orden = orden;
    this.descripcion = descripcion;
    this.fecha_creacion = fecha_creacion;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_menus()');
    return result.rows.map(row => new Menu(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_menu_por_id($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Menu(result.rows[0]);
  }

  static async create(data) {
    const { nombre, id_modulo, id_menu_padre = null, orden = null, descripcion = null } = data;
    const result = await pool.query(
      'SELECT * FROM crear_menu($1, $2, $3, $4, $5)',
      [nombre, id_modulo, id_menu_padre, orden, descripcion]
    );
    return new Menu(result.rows[0]);
  }

  static async update(id, data) {
    const { nombre, id_modulo, id_menu_padre = null, orden = null, descripcion = null } = data;
    const result = await pool.query(
      'SELECT * FROM actualizar_menu($1, $2, $3, $4, $5, $6)',
      [id, nombre, id_modulo, id_menu_padre, orden, descripcion]
    );
    return new Menu(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_menu($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Menu(result.rows[0]);
  }
}

export default Menu;
