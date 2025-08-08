// src/services/CategoriaServices.ts
import type { Categoria } from '../types/Categoria';

const API_URL = '/api/categoria';

export const getCategorias = async (): Promise<Categoria[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return await res.json();
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Categoría no encontrada');
  return await res.json();
};

export const createCategoria = async (categoria: Partial<Categoria>): Promise<Categoria> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });
  if (!res.ok) throw new Error('Error al crear categoría');
  return await res.json();
};

export const updateCategoria = async (categoria: Categoria): Promise<Categoria> => {
  const res = await fetch(`${API_URL}/${categoria.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });
  if (!res.ok) throw new Error('Error al actualizar categoría');
  return await res.json();
};

export const deleteCategoria = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar categoría');
};
