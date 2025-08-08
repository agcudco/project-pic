import type { Promocion, PromocionFormData, AplicarDescuentoRequest, AplicarDescuentoResponse } from '../types/promocion.js';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

export const PromocionService = {
  // Obtener todas las promociones
  getAllPromociones() {
    return fetch(`${API_BASE_URL}/promociones`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => data as Promocion[]);
  },

  // Obtener promoción por ID
  getPromocionById(id: number) {
    return fetch(`${API_BASE_URL}/promociones/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => data as Promocion);
  },

  // Obtener promociones activas
  getPromocionesActivas() {
    return fetch(`${API_BASE_URL}/promociones-activas`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => data as Promocion[]);
  },

  // Obtener promociones vigentes (por fechas)
  getPromocionesVigentes() {
    return fetch(`${API_BASE_URL}/promociones-vigentes`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => data as Promocion[]);
  },

  // Obtener promociones por tipo
  getPromocionesPorTipo(tipo: string) {
    return fetch(`${API_BASE_URL}/promociones/tipo/${tipo}`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => data as Promocion[]);
  },

  // Crear nueva promoción
  createPromocion(data: PromocionFormData) {
    return fetch(`${API_BASE_URL}/promociones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((data) => data as Promocion);
  },

  // Actualizar promoción
  updatePromocion(id: number, data: PromocionFormData) {
    return fetch(`${API_BASE_URL}/promociones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((data) => data as Promocion);
  },

  // Eliminar promoción
  deletePromocion(id: number) {
    return fetch(`${API_BASE_URL}/promociones/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json());
  },

  // Activar promoción
  activarPromocion(id: number) {
    return fetch(`${API_BASE_URL}/promociones/${id}/activar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => data as Promocion);
  },

  // Desactivar promoción
  desactivarPromocion(id: number) {
    return fetch(`${API_BASE_URL}/promociones/${id}/desactivar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => data as Promocion);
  },

  // Aplicar descuento
  aplicarDescuento(data: AplicarDescuentoRequest) {
    return fetch(`${API_BASE_URL}/promociones/aplicar-descuento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((data) => data as AplicarDescuentoResponse);
  }
};
