import pool from '../config/db.js';

class Usuario {
  constructor({
    id,
    cedula,
    nombres,
    apellidos,
    email,
    telefono,
    contrasenia,
    id_rol,
    tipo_cliente,
    razon_social
  }) {
    this.id = id;
    this.cedula = cedula;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.email = email;
    this.telefono = telefono;
    this.contrasenia = contrasenia;
    this.id_rol = id_rol;
    this.tipo_cliente = tipo_cliente;
    this.razon_social = razon_social;
  }

  // Obtener todos los usuarios
  static async getAll() {
    //const result = await pool.query('SELECT * FROM get_todos_usuarios()');
    const result = await pool.query('SELECT * FROM list_all_usuarios()');
    return result.rows.map(row => new Usuario(row));
  }

  // Obtener un usuario por ID
  static async getById(id) {
    const result = await pool.query('SELECT * FROM get_usuario($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Usuario(result.rows[0]);
  }

  // Crear un usuario completo
  static async create(data) {
    const {
      cedula,
      nombres,
      apellidos,
      email,
      telefono,
      contrasenia,
      id_rol,
      tipo_cliente = 'persona',
      razon_social = null
    } = data;

    const result = await pool.query(
      'SELECT * FROM crear_usuario_completo($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [cedula, nombres, apellidos, email, telefono, contrasenia, id_rol, tipo_cliente, razon_social]
    );

    return new Usuario(result.rows[0]);
  }

  // Actualizar un usuario completo
  static async update(id, data) {
    const {
      cedula,
      nombres,
      apellidos,
      email,
      telefono,
      contrasenia,
      id_rol,
      tipo_cliente = 'persona',
      razon_social = null
    } = data;

    const result = await pool.query(
      'SELECT * FROM actualizar_usuario_completo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, cedula, nombres, apellidos, email, telefono, contrasenia, id_rol, tipo_cliente, razon_social]
    );

    return new Usuario(result.rows[0]);
  }

  // Eliminar un usuario completamente
  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_usuario_completo($1)', [id]);
    return result.rows[0]; // Devuelve el usuario eliminado
  }

  // Inactivar un usuario (baja lógica)
  static async deactivate(id) {
    const result = await pool.query('SELECT * FROM inactivar_usuario_completo($1)', [id]);
    return result.rows[0]; // Devuelve el usuario inactivado
  }
}

export default Usuario;