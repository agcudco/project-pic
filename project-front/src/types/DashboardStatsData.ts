// Representa las estadísticas de ventas agrupadas por año
export interface SalesByYear {
  year: string;              
  total_sales: number;       // Monto total vendido en ese año
  sales_count: number;       // Número total de ventas realizadas
}

// Representa la cantidad de productos agrupados por categoría
export interface ProductByCategory {
  category_name: string;     // Nombre de la categoría 
  product_count: number;     // Número de productos en esa categoría
}

// Representa el producto más vendido en el periodo
export interface TopProduct {
  id: number;                // ID único del producto
  nombre: string;            // Nombre del producto
  total_quantity: number;    // Cantidad total vendida
  total_revenue: number;     // Ingresos generados por ese producto
}

// Representa el conjunto completo de estadísticas del dashboard
export interface DashboardStatsData {
  totalSales: {
    total_amount: number;    // Monto total de todas las ventas
    sales_count: number;     // Número total de ventas
  };
  salesByYear: SalesByYear[];               // Lista de ventas por año
  productsByCategory: ProductByCategory[];  // Lista de productos por categoría
  topProduct: TopProduct | null;            // Producto más vendido
}
