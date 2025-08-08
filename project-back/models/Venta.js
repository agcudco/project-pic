

//REALIZADO POR JAMES MENA 
import pool from '../config/db.js';

class Venta {
  constructor({ id, cliente_nombre, total, estado, fecha_hora }) {
    this.id = id;
    this.cliente_nombre = cliente_nombre;
    this.total = total;
    this.estado = estado;
    this.fecha_hora = fecha_hora;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_ventas()');
    return result.rows.map(row => new Venta(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_venta_por_id($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Venta(result.rows[0]);
  }
  //REALIZADO POR ELIAN COLLAGUAZO

   static async getDetallesByVentaId(id) {
    const result = await pool.query('SELECT * FROM ver_detalle_venta_limpia($1)', [id]);
    return result.rows;
  }

  static async getFacturaByVentaId(id) {
  const result = await pool.query('SELECT * FROM ver_factura_simple($1)', [id]);
  return result.rows;
  }


  static async create(data) {
  const { cliente_id, productos, cantidades } = data;

  if (!cliente_id || !productos || !cantidades) {
    throw new Error("Datos incompletos para registrar venta");
  }

  return await pool.query(
    'SELECT registrar_venta($1, $2, $3)',
    [cliente_id, productos, cantidades]
  );
}

  static async update(id, data) {
    const { estado, total } = data;
    await pool.query(
      'SELECT actualizar_venta($1, $2, $3)',
      [id, estado, total]
    );
    return { message: 'Venta actualizada correctamente' };
  }

  static async remove(id) {
    const result = await pool.query('SELECT anular_venta($1)', [id]);
    return result.rows[0].anular_venta || true;
  }
}

export default Venta;