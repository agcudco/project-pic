import pool from '../config/db.js';

class RolModulo {
  constructor({ id_rol, id_modulo, fecha_asignacion, activo }) {
    this.id_rol = id_rol;
    this.id_modulo = id_modulo;
    this.fecha_asignacion = fecha_asignacion;
    this.activo = activo;
  }
}

export async function getAll() {
  const result = await pool.query('SELECT * FROM obtener_rol_modulos()');
  return result.rows.map(row => new RolModulo(row));
}

export async function getByIds(id_rol, id_modulo) {
  const result = await pool.query(
    'SELECT * FROM obtener_rol_modulo_por_ids($1, $2)',
    [id_rol, id_modulo]
  );
  if (result.rowCount === 0) return null;
  return new RolModulo(result.rows[0]);
}

export async function create(data) {
  const { id_rol, id_modulo, fecha_asignacion, activo } = data;
  const result = await pool.query(
    'SELECT * FROM crear_rol_modulo($1, $2, $3, $4)',
    [id_rol, id_modulo, fecha_asignacion, activo]
  );
  return new RolModulo(result.rows[0]);
}

export async function update(data) {
  const { id_rol, id_modulo, fecha_asignacion, activo } = data;
  const result = await pool.query(
    'SELECT * FROM actualizar_rol_modulo($1, $2, $3, $4)',
    [id_rol, id_modulo, fecha_asignacion, activo]
  );
  return new RolModulo(result.rows[0]);
}

export async function remove(id_rol, id_modulo) {
  const result = await pool.query(
    'SELECT eliminar_rol_modulo($1, $2)',
    [id_rol, id_modulo]
  );
  return result.rows[0].eliminar_rol_modulo; // Devuelve true o false
}

export default RolModulo;
