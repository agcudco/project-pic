import type { Usuario } from '../types/Usuario';
import type { Rol } from '../types/Usuario';

const API_URL = 'http://localhost:3000/api/usuarios';
const API_ROLES_URL = 'http://localhost:3000/api/roles';

export const usuarioService = {
  async getAll(): Promise<Usuario[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching usuarios');
    return response.json();
  },

  async getById(id: number): Promise<Usuario> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error fetching usuario');
    return response.json();
  },

  async create(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });
    
    if (!response.ok) {
      let errorMessage = 'Error creating usuario';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // Si no se puede parsear el JSON, usar mensaje por defecto
        errorMessage = `HTTP Error ${response.status}`;
      }
      
      console.error('Error creating usuario:', errorMessage);
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error('Error updating usuario');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting usuario');
  },

  async getRoles(): Promise<Rol[]> {
    const response = await fetch(API_ROLES_URL);
    if (!response.ok) throw new Error('Error fetching roles');
    return response.json();
  },


};