// Exportar todos los componentes de descuentos
export { default as DescuentosPage } from './DescuentosPage.js';
export { default as PromocionList } from './PromocionList.js';
export { default as AplicarDescuento } from './AplicarDescuento.js';

// Re-exportar tipos si es necesario
export type { Promocion, PromocionFormData, AplicarDescuentoRequest, AplicarDescuentoResponse } from '../../types/promocion.js';
