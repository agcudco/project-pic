// src/types/producto.ts

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  costo: number;
  imagen_url: string;
  activo: boolean;
}
