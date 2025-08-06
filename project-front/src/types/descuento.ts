// Tipos para Descuentos
export interface Descuento {
    id?: number;
    nombre: string;
    porcentaje: number;
    tipo: 'fijo' | 'porcentaje';
    activo: boolean;
}

export interface DescuentoFormData {
    nombre: string;
    porcentaje: number;
    tipo: 'fijo' | 'porcentaje';
    activo: boolean;
}
