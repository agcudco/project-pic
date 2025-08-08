export interface Venta {
  id: number; 
  cliente_nombre: string;
  total: number | string;
  estado: string;
  fecha_hora: string;
}