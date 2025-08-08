import type { Producto } from "../types/producto";

const BASE_URL = "http://localhost:3000/api"; // Cambia esto si tu backend usa otro puerto o dominio

// Obtener todos los productos activos
export const getProductos = async (): Promise<Producto[]> => {
  const res = await fetch(`${BASE_URL}/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};

// Obtener un producto por ID
export const getProductoById = async (id: number): Promise<Producto> => {
  const res = await fetch(`${BASE_URL}/productos/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
};

// Crear nuevo producto
export const addProducto = async (producto: Producto): Promise<Producto> => {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

// Actualizar producto existente
export const updateProducto = async (producto: Producto): Promise<Producto> => {
  const res = await fetch(`${BASE_URL}/productos/${producto.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};

// Eliminar (baja lógica) producto
export const deleteProducto = async (producto: Producto): Promise<void> => {
  const res = await fetch(`${BASE_URL}/productos/${producto.id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
};

// Filtrar productos con paginación
export const filterProductos = async ({
  nombre,
  precio_min,
  precio_max,
  limit = 10,
  offset = 0,
}: {
  nombre?: string;
  precio_min?: number;
  precio_max?: number;
  limit?: number;
  offset?: number;
}): Promise<Producto[]> => {
  const query = new URLSearchParams();
  if (nombre) query.append("nombre", nombre);
  if (precio_min !== undefined)
    query.append("precio_min", precio_min.toString());
  if (precio_max !== undefined)
    query.append("precio_max", precio_max.toString());
  query.append("limit", limit.toString());
  query.append("offset", offset.toString());

  const res = await fetch(`${BASE_URL}/productos/filtrar?${query.toString()}`);
  if (!res.ok) throw new Error("Error al filtrar productos");
  return res.json();
};
