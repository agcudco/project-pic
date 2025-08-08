import Dashboard from '../models/dashboardModel.js';

// Obtiene estadísticas de ventas según el rango de tiempo (mes, año, etc.)
export async function getSalesStats(req, res) {
  try {
    const { timeRange } = req.query;
    const stats = await Dashboard.getSalesStats(timeRange);
    res.json({
      success: true,
      data: stats,
      timeRange: timeRange || 'month'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Obtiene los productos más vendidos, limitado por cantidad
export async function getTopProducts(req, res) {
  try {
    const { limit } = req.query;
    const topProducts = await Dashboard.getTopProducts(limit || 5);
    res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Obtiene el número de ventas agrupadas por estado (confirmada, pendiente, etc.)
export async function getSalesByStatus(req, res) {
  try {
    const salesByStatus = await Dashboard.getSalesByStatus();
    res.json({
      success: true,
      data: salesByStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Detecta productos cuyo stock está por debajo del mínimo establecido
export async function getInventoryAlerts(req, res) {
  try {
    const alerts = await Dashboard.getInventoryAlerts();
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Genera un resumen completo del dashboard: ventas totales, por año, categorías y top producto
export async function getDashboardSummary(req, res) {
  try {
    const timeRange = req.query.timeRange || 'year';
    const [salesStats, topProducts, productsByCategory] = await Promise.all([
      Dashboard.getSalesStats(timeRange),
      Dashboard.getTopProducts(1),
      Dashboard.getProductsByCategory()
    ]);

    const totalSales = salesStats.reduce(
      (acc, curr) => ({
        total_amount: acc.total_amount + (Number(curr.total_sales) || 0),
        sales_count: acc.sales_count + (Number(curr.sales_count) || 0)
      }),
      { total_amount: 0, sales_count: 0 }
    );

    const salesByYear = salesStats.map(stat => ({
      year: stat.period ? stat.period.split('-')[0] : stat.period,
      total_sales: Number(stat.total_sales) || 0,
      sales_count: Number(stat.sales_count) || 0
    }));

    res.json({
      success: true,
      data: {
        totalSales,
        salesByYear,
        productsByCategory: productsByCategory || [],
        topProduct: topProducts[0] || null
      }
    });
  } catch (error) {
    console.error('Error en getDashboardSummary:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
