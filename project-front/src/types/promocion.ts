// Tipos para Promociones/Descuentos
export interface Promocion {
  id?: number;
  nombre: string;
  tipo: 'producto' | 'categoria' | 'monto_total' | 'cantidad';
  valor: number;
  condicion_json?: any;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

export interface PromocionFormData {
  nombre: string;
  tipo: 'producto' | 'categoria' | 'monto_total' | 'cantidad';
  valor: number;
  condicion_json?: any;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

export interface AplicarDescuentoRequest {
  venta_id: number;
  promocion_id: number;
  monto_base?: number;
  cantidad?: number;
}

export interface AplicarDescuentoResponse {
  descuento_aplicado: number;
  monto_final: number;
  mensaje: string;
}
