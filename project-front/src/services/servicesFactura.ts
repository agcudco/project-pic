import type { Factura } from "../types/factura";

const API_URL = "http://localhost:3000/api/factura";



export const getFacturas = async (): Promise<Factura[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener las facturas");
  return await res.json();
};

export const getFacturaById = async (id: number): Promise<Factura> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error al obtener la factura con ID ${id}`);
  return await res.json();
};

export const createFactura = async (factura: {
  venta_id: number;
  tipo: string;
  numero: string;
  fecha_emision: string; // formato "YYYY-MM-DD"
  monto_total: number;
}): Promise<any> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(factura),
  });
  if (!res.ok) throw new Error("Error al crear la factura");
  return await res.json();
};

export const getFacturaDetalles = async (id: number): Promise<any[]> => {
  const res = await fetch(`${API_URL}/${id}/detalles`);
  if (!res.ok) throw new Error(`Error al obtener los detalles de la factura con ID ${id}`);
  return await res.json();
};

export const updateFactura = async (
  id: number,
  data: {
    tipo: string;
    numero: string;
    fecha_emision: string; // formato "YYYY-MM-DD"
    monto_total: number;
  }
): Promise<any> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error al actualizar la factura con ID ${id}`);
  return await res.json();
};

export const deleteFactura = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error al eliminar la factura con ID ${id}`);
};
