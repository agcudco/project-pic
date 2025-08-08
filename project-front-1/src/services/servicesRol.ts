import type { Rol } from '../types/rol';

// Asegúrate de que esta URL coincida con la de tu backend
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene todos los roles
 */
export const getRoles = async (): Promise<Rol[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener los roles');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getRoles:', error);
        throw error;
    }
};

/**
 * Obtiene un rol por su ID
 */
export const getRolById = async (id: string): Promise<Rol> => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener el rol');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getRolById:', error);
        throw error;
    }
};

/**
 * Crea un nuevo rol
 */
export const createRol = async (rolData: Omit<Rol, 'id'>): Promise<Rol> => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rolData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear el rol');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en createRol:', error);
        throw error;
    }
};

/**
 * Actualiza un rol existente
 */
export const updateRol = async (id: string, rolData: Partial<Rol>): Promise<Rol> => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rolData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el rol');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en updateRol:', error);
        throw error;
    }
};

/**
 * Elimina un rol
 */
export const deleteRol = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar el rol');
        }
    } catch (error) {
        console.error('Error en deleteRol:', error);
        throw error;
    }
};

// Funciones para la gestión de módulos (opcionales, según necesidad)
export const getModulosByRol = async (rolId: string) => {
    // Implementar según sea necesario
};

export const assignModuloToRol = async (rolId: string, moduloId: string) => {
    // Implementar según sea necesario
};

export const removeModuloFromRol = async (rolId: string, moduloId: string) => {
    // Implementar según sea necesario
};