import { pool } from '../config/db.js';
// Listar productos con descuento aplicado (unión con promociones)
export async function getProductosConDescuento(req, res) {
  try {
    const result = await pool.query(`
      SELECT p.id as producto_id, p.nombre as producto_nombre, pr.id as promocion_id, pr.nombre as promocion_nombre, pr.valor, pr.fecha_inicio, pr.fecha_fin
      FROM producto p
      JOIN promocion_producto pp ON p.id = pp.producto_id
      JOIN promocion pr ON pp.promocion_id = pr.id
      ORDER BY p.nombre, pr.fecha_inicio DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function getAllProductos(req, res) {
  try {
    const result = await pool.query('SELECT * FROM ventas.producto');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
