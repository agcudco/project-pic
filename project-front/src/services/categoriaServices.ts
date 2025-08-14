import type { Categoria, CategoriaFormData } from "../types/Categoria";

// Configuración base de la API
const API_BASE_URL = "http://localhost:3000/api";

export const CategoriaService = {
  // Obtener todas las categorías
  async getAll(): Promise<Categoria[]> {
    const res = await fetch(`${API_BASE_URL}/categoria`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Error al obtener categorías");
    return (await res.json()) as Categoria[];
  },

  // Obtener categoría por ID
  async getById(id: number): Promise<Categoria> {
    const res = await fetch(`${API_BASE_URL}/categoria/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 404) throw new Error("Categoría no encontrada");
    if (!res.ok) throw new Error("Error al obtener la categoría");
    return (await res.json()) as Categoria;
  },

  // Buscar categorías (backend: /categoria/search?q=...)
  async search(q: string): Promise<Categoria[]> {
    const url = new URL(`${API_BASE_URL}/categoria/search`);
    if (q) url.searchParams.set("q", q);
    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Error en búsqueda de categorías");
    return (await res.json()) as Categoria[];
  },

  // Crear nueva categoría
  async create(payload: CategoriaFormData): Promise<Categoria> {
    const res = await fetch(`${API_BASE_URL}/categoria`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Error al crear la categoría");
    }
    return (await res.json()) as Categoria;
  },

  // Actualizar categoría
  async update(id: number, payload: CategoriaFormData): Promise<Categoria> {
    const res = await fetch(`${API_BASE_URL}/categoria/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 404) throw new Error("Categoría no encontrada");
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Error al actualizar la categoría");
    }
    return (await res.json()) as Categoria;
  },

  // Eliminar categoría
  async remove(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/categoria/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 404) throw new Error("Categoría no encontrada");
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Error al eliminar la categoría");
    }
  },
};
