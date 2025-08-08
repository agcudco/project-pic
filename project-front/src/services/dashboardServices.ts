// Importa los tipos de datos que se usarán en las respuestas
import type { DashboardStatsData, ProductByCategory, SalesByYear, TopProduct } from '../types/DashboardStatsData';

// URL base de la API del dashboard
const API_URL = 'http://localhost:3000/api/dashboard';

// Obtiene el resumen completo del dashboard (ventas totales, top producto, categorías, ventas por año)
export const getDashboardStats = async (): Promise<DashboardStatsData> => {
  try {
    const response = await fetch(`${API_URL}/summary?timeRange=year`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    console.log('Respuesta de getDashboardStats:', json); // Para depuración

    if (json.data && json.data.topProduct) {
      json.data.topProduct.total_revenue = Number(json.data.topProduct.total_revenue);
    }

    return json.data || {
      totalSales: { total_amount: 0, sales_count: 0 },
      salesByYear: [],
      productsByCategory: [],
      topProduct: null,
    };
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    throw error;
  }
};


// Obtiene las estadísticas de ventas agrupadas por año
export const getSalesByYear = async (): Promise<SalesByYear[]> => {
  try {
    const response = await fetch(`${API_URL}/sales-stats?timeRange=year`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    console.log('Respuesta de getSalesByYear:', json); // Para depuración
    return json.data.map((item: any) => ({
      year: item.period,
      total_sales: item.total_sales,
      sales_count: item.sales_count,
    }));
  } catch (error) {
    console.error('Error en getSalesByYear:', error);
    throw error;
  }
};

// Obtiene el número de productos agrupados por categoría
export const getProductsByCategory = async (): Promise<ProductByCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/products-by-category`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    console.log('Respuesta de getProductsByCategory:', json); // Para depuración
    return json.data || [];
  } catch (error) {
    console.error('Error en getProductsByCategory:', error);
    throw error;
  }
};

// Obtiene el producto más vendido (limitado a uno)
export const getTopProduct = async (): Promise<TopProduct | null> => {
  try {
    const response = await fetch(`${API_URL}/top-products?limit=1`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    console.log('Respuesta de getTopProduct:', json); // Para depuración
    return json.data[0] || null;
  } catch (error) {
    console.error('Error en getTopProduct:', error);
    throw error;
  }
};
