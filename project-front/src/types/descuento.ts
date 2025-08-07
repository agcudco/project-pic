// Tipos para Descuentos
export interface Descuento {
    id?: number;
    nombre: string;
    valor: number; // Cambiado de porcentaje a valor
    tipo: 'monto_fijo' | 'porcentaje' | 'producto' | 'categoria' | 'monto_total' | 'cantidad';
    activo: boolean;
    descripcion?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}

export interface DescuentoFormData {
    nombre: string;
    valor: number; // Cambiado de porcentaje a valor
    tipo: 'monto_fijo' | 'porcentaje' | 'producto' | 'categoria' | 'monto_total' | 'cantidad';
    activo: boolean;
    descripcion?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}
