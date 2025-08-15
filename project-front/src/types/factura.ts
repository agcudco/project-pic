export interface Factura {
  id: number;
  venta_id: number;
  tipo: string;
  numero: string;
  fecha_emision: string; // formato ISO date
  monto_total: number | string;
}
