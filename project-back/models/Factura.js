// REALIZADO POR JAMES MENA
import pool from '../config/db.js';

class Factura {
  constructor({ id, venta_id, tipo, numero, fecha_emision, monto_total }) {
    this.id = id;
    this.venta_id = venta_id;
    this.tipo = tipo;
    this.numero = numero;
    this.fecha_emision = fecha_emision;
    this.monto_total = monto_total;
  }

  // Obtener todas las facturas
  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_facturas()');
    return result.rows.map(row => new Factura(row));
  }

  // Obtener factura por ID
  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_factura_por_id($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Factura(result.rows[0]);
  }

  // Obtener detalles de la factura (productos de la venta asociada)
  static async getDetallesByFacturaId(id) {
    const result = await pool.query('SELECT * FROM ver_detalle_factura($1)', [id]);
    return result.rows;
  }

  // Crear una factura nueva
  static async create(data) {
    const { venta_id, tipo, numero, fecha_emision, monto_total } = data;

    if (!venta_id || !tipo || !numero || !fecha_emision || !monto_total) {
      throw new Error("Datos incompletos para registrar factura");
    }

    return await pool.query(
      'SELECT registrar_factura($1, $2, $3, $4, $5)',
      [venta_id, tipo, numero, fecha_emision, monto_total]
    );
  }

  // Actualizar una factura
  static async update(id, data) {
    const { tipo, numero, fecha_emision, monto_total } = data;
    await pool.query(
      'SELECT actualizar_factura($1, $2, $3, $4, $5)',
      [id, tipo, numero, fecha_emision, monto_total]
    );
    return { message: 'Factura actualizada correctamente' };
  }

  // Eliminar (o anular) una factura
  static async remove(id) {
    const result = await pool.query('SELECT anular_factura($1)', [id]);
    return result.rows[0].anular_factura || true;
  }
}

export default Factura;
