import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  nivel_acceso: number;
  fecha_creacion: string;
}

export const getRoles = async (): Promise<Rol[]> => {
  try {
    const response = await axios.get(`${API_URL}/rol`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener roles:', error);
    throw error;
  }
};

export const getRolById = async (id: number): Promise<Rol> => {
  try {
    const response = await axios.get(`${API_URL}/rol/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el rol con ID ${id}:`, error);
    throw error;
  }
};

export const createRol = async (rolData: Omit<Rol, 'id' | 'fecha_creacion'>): Promise<Rol> => {
  try {
    const response = await axios.post(`${API_URL}/rol`, rolData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el rol:', error);
    throw error;
  }
};

export const updateRol = async (id: number, rolData: Partial<Rol>): Promise<Rol> => {
  try {
    const response = await axios.put(`${API_URL}/rol/${id}`, rolData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el rol con ID ${id}:`, error);
    throw error;
  }
};

export const deleteRol = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/rol/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el rol con ID ${id}:`, error);
    throw error;
  }
};

export const toggleRolStatus = async (id: number, activo: boolean): Promise<Rol> => {
  try {
    const response = await axios.patch(`${API_URL}/rol/${id}/estado`, { activo });
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar el estado del rol con ID ${id}:`, error);
    throw error;
  }
};
