import db from '../config/db.js';

const Producto = {
  async getAll() {
    const result = await db.query('SELECT * FROM productos');
    return result.rows;
  },

  async getById(id) {
    const result = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { nombre, descripcion, precio } = data;
    const result = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, precio]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { nombre, descripcion, precio } = data;
    const result = await db.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3 WHERE id = $4 RETURNING *',
      [nombre, descripcion, precio, id]
    );
    return result.rows[0];
  },

  async remove(id) {
    const result = await db.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

export default Producto;
