import pool from '../config/db.js';

class Modulo {
  constructor({ id, nombre, descripcion, estado }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
  }
}

// Exportar funciones individuales
export async function getAll() {
  const result = await pool.query('SELECT * FROM obtener_modulos()');
  return result.rows.map(row => new Modulo(row));
}

export async function getById(id) {
  const result = await pool.query('SELECT * FROM obtener_modulo_por_id($1)', [id]);
  if (result.rowCount === 0) return null;
  return new Modulo(result.rows[0]);
}

export async function create(data) {
  const { nombre, descripcion, estado } = data;
  const result = await pool.query(
    'SELECT * FROM crear_modulo($1, $2, $3)',
    [nombre, descripcion, estado]
  );
  return new Modulo(result.rows[0]);
}

export async function update(id, data) {
  const { nombre, descripcion, estado } = data;
  const result = await pool.query(
    'SELECT * FROM actualizar_modulo($1, $2, $3, $4)',
    [id, nombre, descripcion, estado]
  );
  return new Modulo(result.rows[0]);
}

export async function remove(id) {
  const result = await pool.query('SELECT eliminar_modulo($1)', [id]);
  return result.rows[0].eliminar_modulo; // Devuelve true o false
}

// Exportar la clase también si la necesitas
export default Modulo;