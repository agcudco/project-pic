import pool from '../config/db.js';

class Accion {
  constructor({ id, nombre, id_menu, url, icono, descripcion, activo }) {
    this.id = id;
    this.nombre = nombre;
    this.id_menu = id_menu;
    this.url = url;
    this.icono = icono;
    this.descripcion = descripcion;
    this.activo = activo;
  }
}

// Obtener todas las acciones
export async function getAll() {
  const result = await pool.query('SELECT * FROM obtener_acciones()');
  return result.rows.map(row => new Accion(row));
}

// Obtener una acción por ID
export async function getById(id) {
  const result = await pool.query('SELECT * FROM obtener_accion_por_id($1)', [id]);
  if (result.rowCount === 0) return null;
  return new Accion(result.rows[0]);
}

// Crear una nueva acción
export async function create(data) {
  const { nombre, id_menu, url, icono, descripcion, activo } = data;
  const result = await pool.query(
    'SELECT * FROM crear_accion($1, $2, $3, $4, $5, $6)',
    [nombre, id_menu, url, icono, descripcion, activo]
  );
  return new Accion(result.rows[0]);
}

// Actualizar una acción
export async function update(id, data) {
  const { nombre, id_menu, url, icono, descripcion, activo } = data;
  const result = await pool.query(
    'SELECT * FROM actualizar_accion($1, $2, $3, $4, $5, $6, $7)',
    [id, nombre, id_menu, url, icono, descripcion, activo]
  );
  return new Accion(result.rows[0]);
}

// Eliminar una acción
export async function remove(id) {
  const result = await pool.query('SELECT * FROM eliminar_accion($1)', [id]);
  return result.rows[0]; // Devuelve la acción eliminada o lanza error en el controlador
}

export default Accion;
