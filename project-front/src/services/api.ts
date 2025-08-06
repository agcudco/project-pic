// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Configuración axios o fetch personalizada
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función helper para manejar respuestas
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  return response.json();
};

// Función helper para hacer peticiones
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};
