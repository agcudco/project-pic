// Importa React y el tipo de datos que se espera recibir
import React from 'react';
import type { DashboardStatsData } from '../../types/DashboardStatsData';
// Estilos globales
import "../../App.css";

// Define las props esperadas: estadísticas generales del dashboard
interface Props {
  stats: DashboardStatsData;
}

// Componente que muestra métricas clave del dashboard: ventas totales, top producto y categorías
export const DashboardStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="stats-container">
      <h2>Estadísticas Generales</h2>

      {/* Contenedor de tarjetas con estadísticas */}
      <div className="stats-grid">

        {/* Tarjeta de total de ventas */}
        <div className="stats-card">
          <h3 className="stats-card-title">Total de Ventas</h3>
          {stats.totalSales ? (
            <>
              <p>Monto: ${stats.totalSales.total_amount.toFixed(2)}</p>
              <p>Ventas: {stats.totalSales.sales_count}</p>
            </>
          ) : (
            <p>No hay datos de ventas disponibles</p>
          )}
        </div>

        {/* Tarjeta del producto más vendido */}
        <div className="stats-card">
          <h3 className="stats-card-title">Producto Más Vendido</h3>
          {stats.topProduct ? (
            <>
              <p>Nombre: {stats.topProduct.nombre}</p>
              <p>Cantidad: {stats.topProduct.total_quantity}</p>
              <p>Ingresos: ${stats.topProduct.total_revenue.toFixed(2)}</p>
            </>
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </div>

        {/* Tarjeta de productos agrupados por categoría */}
        <div className="stats-card">
          <h3 className="stats-card-title">Productos por Categoría</h3>
          {stats.productsByCategory && stats.productsByCategory.length > 0 ? (
            stats.productsByCategory.map(category => (
              <p key={category.category_name}>
                {category.category_name}: {category.product_count} productos
              </p>
            ))
          ) : (
            <p>No hay categorías disponibles</p>
          )}
        </div>

      </div>
    </div>
  );
};
