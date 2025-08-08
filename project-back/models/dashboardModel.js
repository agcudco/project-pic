import pool from '../config/db.js';

class Dashboard {
  // Obtiene estadísticas de ventas agrupadas por día, semana, mes o año según el rango de tiempo
  static async getSalesStats(timeRange = 'month') {
    let query;
    switch(timeRange) {
      case 'day':
        query = `
          SELECT DATE(fecha_hora) as period, SUM(total) as total_sales, COUNT(*) as sales_count
          FROM ventas.venta
          WHERE fecha_hora >= CURRENT_DATE - INTERVAL '30 days'
            AND estado = 'confirmada'
          GROUP BY DATE(fecha_hora)
          ORDER BY period DESC
        `;
        break;
      case 'week':
        query = `
          SELECT DATE_TRUNC('week', fecha_hora) as period, SUM(total) as total_sales, COUNT(*) as sales_count
          FROM ventas.venta
          WHERE fecha_hora >= CURRENT_DATE - INTERVAL '12 weeks'
            AND estado = 'confirmada'
          GROUP BY DATE_TRUNC('week', fecha_hora)
          ORDER BY period DESC
        `;
        break;
      case 'year':
        query = `
          SELECT EXTRACT(YEAR FROM fecha_hora)::text as period, SUM(total) as total_sales, COUNT(*) as sales_count
          FROM ventas.venta
          WHERE fecha_hora >= CURRENT_DATE - INTERVAL '5 years'
            AND estado = 'confirmada'
          GROUP BY EXTRACT(YEAR FROM fecha_hora)
          ORDER BY period DESC
        `;
        break;
      case 'month':
      default:
        query = `
          SELECT TO_CHAR(fecha_hora, 'YYYY-MM') as period, SUM(total) as total_sales, COUNT(*) as sales_count
          FROM ventas.venta
          WHERE fecha_hora >= CURRENT_DATE - INTERVAL '12 months'
            AND estado = 'confirmada'
          GROUP BY TO_CHAR(fecha_hora, 'YYYY-MM')
          ORDER BY period DESC
        `;
    }
    
    const result = await pool.query(query);
    return result.rows;
  }

  // Obtiene los productos más vendidos, ordenados por ingresos generados
  static async getTopProducts(limit = 5) {
    const query = `
      SELECT p.id, p.nombre, SUM(vd.cantidad) as total_quantity, SUM(vd.cantidad * vd.precio_unitario) as total_revenue
      FROM ventas.venta_detalle vd
      JOIN ventas.producto p ON vd.producto_id = p.id
      JOIN ventas.venta v ON vd.venta_id = v.id
      WHERE v.estado = 'confirmada'
      GROUP BY p.id, p.nombre
      ORDER BY total_revenue DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  // Agrupa las ventas por estado y calcula el total y cantidad por cada uno
  static async getSalesByStatus() {
    const query = `
      SELECT estado, COUNT(*) as count, SUM(total) as total_amount
      FROM ventas.venta
      GROUP BY estado
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Identifica productos cuyo stock actual está por debajo del mínimo permitido
  static async getInventoryAlerts() {
    const query = `
      SELECT p.id, p.nombre, i.stock_actual, i.stock_minimo, s.nombre as sucursal
      FROM ventas.inventario i
      JOIN ventas.producto p ON i.producto_id = p.id
      JOIN ventas.sucursal s ON i.sucursal_id = s.id
      WHERE i.stock_actual <= i.stock_minimo
      ORDER BY i.stock_actual ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Cuenta cuántos productos hay por cada categoría registrada
  static async getProductsByCategory() {
    const query = `
      SELECT
        c.nombre AS category_name,
        COUNT(p.id) AS product_count
      FROM ventas.categoria c
      LEFT JOIN ventas.producto_categoria pc ON c.id = pc.categoria_id
      LEFT JOIN ventas.producto p ON pc.producto_id = p.id
      GROUP BY c.nombre
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default Dashboard;
