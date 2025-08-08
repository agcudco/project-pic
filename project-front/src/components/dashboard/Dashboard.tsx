// Importa React y hooks para manejar estado y efectos secundarios
import React, { useState, useEffect } from 'react';
// Componente que muestra estadísticas generales del dashboard
import { DashboardStats } from './DashboardStats';
// Componente que muestra gráficos de ventas por año
import { DashboardCharts } from './DashboardCharts';
// Función que obtiene los datos del dashboard desde el backend
import { getDashboardStats } from '../../services/dashboardServices';
// Tipado de los datos esperados en el dashboard
import type { DashboardStatsData } from '../../types/DashboardStatsData';
// Estilos globales de la aplicación
import "../../App.css";

// Componente principal del dashboard
const Dashboard: React.FC = () => {
// Estado para guardar las estadísticas del dashboard
const [stats, setStats] = useState<DashboardStatsData | null>(null);
// Estado para controlar si los datos están cargando
const [loading, setLoading] = useState(true);
// Estado para manejar errores en la carga de datos
const [error, setError] = useState<string | null>(null);
// Efecto que se ejecuta al montar el componente para cargar datos del dashboard
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Llama al servicio para obtener las estadísticas
        const data = await getDashboardStats();
        setStats(data);         // Guarda los datos en el estado
        setLoading(false);      // Finaliza la carga
      } catch (err) {
        // Maneja errores si la petición falla
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar las estadísticas';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchStats(); // Ejecuta la función de carga
  }, []);

  // ⏳ Muestra mensaje de carga mientras se obtienen los datos
  if (loading) return <div>Cargando...</div>;

  // Muestra mensaje de error si ocurre algún problema
  if (error) return <div>{error}</div>;

  // Renderiza el dashboard con estadísticas y gráficos si los datos están disponibles
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard de Ventas</h1>
      {stats && (
        <>
          <DashboardStats stats={stats} />
          <DashboardCharts salesByYear={stats.salesByYear} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
