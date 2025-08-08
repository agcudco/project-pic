// Importa React y hooks para manejar efectos y referencias al DOM
import React, { useEffect, useRef } from 'react';
// Importa Chart.js para renderizar gráficos
import Chart from 'chart.js/auto';
// Tipado de los datos de ventas por año
import type { SalesByYear } from '../../types/DashboardStatsData';
// Estilos globales
import "../../App.css";

// Define las props esperadas: un array de ventas por año
interface Props {
  salesByYear: SalesByYear[];
}

// Componente que renderiza un gráfico de líneas con ventas totales y cantidad por año
export const DashboardCharts: React.FC<Props> = ({ salesByYear }) => {
  // Referencia al elemento canvas donde se renderiza el gráfico
  const chartRef = useRef<HTMLCanvasElement>(null);
  // Variable para almacenar la instancia del gráfico
  let chartInstance: Chart | null = null;
  // Efecto que se ejecuta cuando cambian los datos de ventas
  useEffect(() => {
    if (chartRef.current) {
      // Destruye el gráfico anterior si existe (evita duplicados)
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Crea un nuevo gráfico de líneas con los datos de ventas
      chartInstance = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: salesByYear.map(sale => sale.year), // Años como etiquetas
          datasets: [
            {
              label: 'Ventas Totales ($)', // Línea de ingresos
              data: salesByYear.map(sale => sale.total_sales),
              borderColor: '#1E90FF',
              backgroundColor: 'rgba(30, 144, 255, 0.2)',
              fill: true,
            },
            {
              label: 'Cantidad de Ventas', // Línea de cantidad de transacciones
              data: salesByYear.map(sale => sale.sales_count),
              borderColor: '#32CD32',
              backgroundColor: 'rgba(50, 205, 50, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true, // Se adapta al tamaño del contenedor
          scales: {
            y: {
              beginAtZero: true, // El eje Y comienza en cero
            },
          },
        },
      });
    }

    // Limpieza: destruye el gráfico al desmontar o actualizar
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [salesByYear]);

  // Renderiza el contenedor y el canvas donde se dibuja el gráfico
  return (
    <div className="charts-container">
      <h2 className="charts-title">Ventas por Año</h2>
      <canvas ref={chartRef} />
    </div>
  );
};
