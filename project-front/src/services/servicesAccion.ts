// services/accionService.ts
import type { Accion } from "../types/accion";

const API_URL = "http://localhost:3000/api/acciones";

// Obtener todas las acciones
export const getAcciones = async (): Promise<Accion[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener las acciones");
  return await response.json();
};

// Obtener una acción por su ID
export const getAccionById = async (id: number): Promise<Accion> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener la acción");

  return await response.json();
};

// Crear una nueva acción (sin el campo `id`, que se genera automáticamente)
export const createAccion = async (accion: Omit<Accion, 'id'>): Promise<Accion> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(accion)
  });
  if (!response.ok) throw new Error("Error al crear la acción");

  return await response.json();
};

// Actualizar una acción
export const updateAccion = async (id: number, accion: Omit<Accion, 'id'>): Promise<Accion> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(accion)
  });
  if (!response.ok) throw new Error("Error al actualizar la acción");

  return await response.json();
};

// Eliminar una acción
export const deleteAccion = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Error al eliminar la acción");
};
