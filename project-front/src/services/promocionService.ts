import { apiRequest } from './api.js';
import type { Promocion, PromocionFormData, AplicarDescuentoRequest, AplicarDescuentoResponse } from '../types/promocion.js';

export class PromocionService {
  // Obtener todas las promociones
  static async getAllPromociones(): Promise<Promocion[]> {
    return apiRequest('/promociones');
  }

  // Obtener promoción por ID
  static async getPromocionById(id: number): Promise<Promocion> {
    return apiRequest(`/promociones/${id}`);
  }

  // Obtener promociones activas
  static async getPromocionesActivas(): Promise<Promocion[]> {
    return apiRequest('/promociones-activas');
  }

  // Obtener promociones vigentes (por fechas)
  static async getPromocionesVigentes(): Promise<Promocion[]> {
    return apiRequest('/promociones-vigentes');
  }

  // Obtener promociones por tipo
  static async getPromocionesPorTipo(tipo: string): Promise<Promocion[]> {
    return apiRequest(`/promociones/tipo/${tipo}`);
  }

  // Crear nueva promoción
  static async createPromocion(data: PromocionFormData): Promise<Promocion> {
    return apiRequest('/promociones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Actualizar promoción
  static async updatePromocion(id: number, data: PromocionFormData): Promise<Promocion> {
    return apiRequest(`/promociones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Eliminar promoción
  static async deletePromocion(id: number): Promise<void> {
    return apiRequest(`/promociones/${id}`, {
      method: 'DELETE',
    });
  }

  // Activar promoción
  static async activarPromocion(id: number): Promise<Promocion> {
    return apiRequest(`/promociones/${id}/activar`, {
      method: 'PATCH',
    });
  }

  // Desactivar promoción
  static async desactivarPromocion(id: number): Promise<Promocion> {
    return apiRequest(`/promociones/${id}/desactivar`, {
      method: 'PATCH',
    });
  }

  // Aplicar descuento
  static async aplicarDescuento(data: AplicarDescuentoRequest): Promise<AplicarDescuentoResponse> {
    return apiRequest('/promociones/aplicar-descuento', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
