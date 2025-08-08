  //REALIZADO POR JAMES MENA

import type { Venta } from "../types/venta";

const API_URL = 'http://localhost:3000/api/venta';

export const getVentas = async (): Promise<Venta[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener las ventas");
  return await res.json();
};

export const getVentaById = async (id: number): Promise<Venta> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error al obtener la venta con ID ${id}`);
  return await res.json();
};

export const createVenta = async (venta: {
  cliente_id: number;
  productos: number[];
  cantidades: number[];
}): Promise<any> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  });
  if (!res.ok) throw new Error("Error al crear la venta");
  return await res.json();
};
export const getVentaDetalles = async (id: number): Promise<any[]> => {
  const res = await fetch(`http://localhost:3000/api/venta/${id}/detalles`);
  if (!res.ok) throw new Error(`Error al obtener los detalles de la venta con ID ${id}`);
  return await res.json();
};


export const getFacturaVenta = async (id: number): Promise<string> => {
  const res = await fetch(`http://localhost:3000/api/venta/${id}/factura`);
  if (!res.ok) throw new Error(`Error al obtener la factura de la venta con ID ${id}`);
  return await res.text(); // asumiendo que devuelve HTML
};


export const updateVenta = async (
  id: number,
  data: { estado: string; total: number }
): Promise<any> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error al actualizar la venta con ID ${id}`);
  return await res.json();
};

export const deleteVenta = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error al eliminar la venta con ID ${id}`);
};
