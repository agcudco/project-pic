import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Modulo {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecha_creacion: string;
}

export const getModulos = async (): Promise<Modulo[]> => {
  try {
    const response = await axios.get(`${API_URL}/modulo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    throw error;
  }
};

export const getModuloById = async (id: number): Promise<Modulo> => {
  try {
    const response = await axios.get(`${API_URL}/modulo/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el módulo con ID ${id}:`, error);
    throw error;
  }
};

export const createModulo = async (moduloData: Omit<Modulo, 'id' | 'fecha_creacion'>): Promise<Modulo> => {
  try {
    const response = await axios.post(`${API_URL}/modulo`, moduloData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el módulo:', error);
    throw error;
  }
};

export const updateModulo = async (id: number, moduloData: Partial<Modulo>): Promise<Modulo> => {
  try {
    const response = await axios.put(`${API_URL}/modulo/${id}`, moduloData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el módulo con ID ${id}:`, error);
    throw error;
  }
};

export const deleteModulo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/modulo/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el módulo con ID ${id}:`, error);
    throw error;
  }
};

export const toggleModuloStatus = async (id: number, activo: boolean): Promise<Modulo> => {
  try {
    const response = await axios.patch(`${API_URL}/modulo/${id}/estado`, { activo });
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar el estado del módulo con ID ${id}:`, error);
    throw error;
  }
};
