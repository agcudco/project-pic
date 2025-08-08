import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface RolModulo {
  id_rol: number;
  id_modulo: number;
  rol_nombre?: string;
  modulo_nombre?: string;
  activo: boolean;
  fecha_asignacion: string;
}

// Obtener todas las asignaciones rol-módulo
export const getRolModulos = async (): Promise<RolModulo[]> => {
  try {
    const response = await axios.get(`${API_URL}/rolmodulo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las asignaciones rol-módulo:', error);
    throw error;
  }
};

// Obtener módulos por rol
export const getModulosByRol = async (id_rol: number): Promise<RolModulo[]> => {
  try {
    const response = await axios.get(`${API_URL}/rolmodulo/rol/${id_rol}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los módulos del rol ${id_rol}:`, error);
    throw error;
  }
};

// Obtener roles por módulo
export const getRolesByModulo = async (id_modulo: number): Promise<RolModulo[]> => {
  try {
    const response = await axios.get(`${API_URL}/rolmodulo/modulo/${id_modulo}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los roles del módulo ${id_modulo}:`, error);
    throw error;
  }
};

// Obtener una asignación específica
export const getRolModulo = async (
  id_rol: number, 
  id_modulo: number
): Promise<RolModulo> => {
  try {
    const response = await axios.get(`${API_URL}/rolmodulo/${id_rol}/${id_modulo}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener la asignación rol ${id_rol} - módulo ${id_modulo}:`,
      error
    );
    throw error;
  }
};

// Verificar si existe una asignación
export const existeRolModulo = async (
  id_rol: number, 
  id_modulo: number
): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${API_URL}/rolmodulo/existe/${id_rol}/${id_modulo}`
    );
    return response.data.existe;
  } catch (error) {
    console.error(
      `Error al verificar la asignación rol ${id_rol} - módulo ${id_modulo}:`,
      error
    );
    throw error;
  }
};

// Crear una nueva asignación rol-módulo
export const createRolModulo = async (data: {
  id_rol: number;
  id_modulo: number;
  activo?: boolean;
}): Promise<RolModulo> => {
  try {
    const response = await axios.post(`${API_URL}/rolmodulo`, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear la asignación rol-módulo:', error);
    throw error;
  }
};

// Actualizar una asignación existente
export const updateRolModulo = async (
  id_rol: number, 
  id_modulo: number, 
  data: Partial<RolModulo>
): Promise<RolModulo> => {
  try {
    const response = await axios.put(
      `${API_URL}/rolmodulo/${id_rol}/${id_modulo}`, 
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al actualizar la asignación rol ${id_rol} - módulo ${id_modulo}:`, 
      error
    );
    throw error;
  }
};

// Eliminar una asignación
export const deleteRolModulo = async (
  id_rol: number, 
  id_modulo: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/rolmodulo/${id_rol}/${id_modulo}`);
  } catch (error) {
    console.error(
      `Error al eliminar la asignación rol ${id_rol} - módulo ${id_modulo}:`, 
      error
    );
    throw error;
  }
};

// Cambiar el estado de una asignación (activo/inactivo)
export const toggleRolModuloStatus = async (
  id_rol: number, 
  id_modulo: number, 
  activo: boolean
): Promise<RolModulo> => {
  try {
    const response = await axios.patch(
      `${API_URL}/rolmodulo/${id_rol}/${id_modulo}/estado`, 
      { activo }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al cambiar el estado de la asignación rol ${id_rol} - módulo ${id_modulo}:`, 
      error
    );
    throw error;
  }
};
