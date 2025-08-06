import type { Descuento, DescuentoFormData } from '../types/descuento.js';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

export const DescuentoService = {
    // Obtener todos los descuentos
    getAllDescuentos() {
        return fetch(`${API_BASE_URL}/descuentos`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => data as Descuento[]);
    },

    // Obtener descuento por ID
    getDescuentoById(id: number) {
        return fetch(`${API_BASE_URL}/descuentos/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => data as Descuento);
    },

    // Obtener descuentos activos
    getDescuentosActivos() {
        return fetch(`${API_BASE_URL}/descuentos-activos`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => data as Descuento[]);
    },

    // Crear nuevo descuento
    createDescuento(descuento: DescuentoFormData) {
        return fetch(`${API_BASE_URL}/descuentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(descuento)
        })
            .then((res) => res.json())
            .then((data) => data as Descuento);
    },

    // Actualizar descuento
    updateDescuento(id: number, descuento: DescuentoFormData) {
        return fetch(`${API_BASE_URL}/descuentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(descuento)
        })
            .then((res) => res.json())
            .then((data) => data as Descuento);
    },

    // Eliminar descuento
    deleteDescuento(id: number) {
        return fetch(`${API_BASE_URL}/descuentos/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json());
    },

    // Activar descuento
    activarDescuento(id: number) {
        return fetch(`${API_BASE_URL}/descuentos/${id}/activar`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => data as Descuento);
    },

    // Desactivar descuento
    desactivarDescuento(id: number) {
        return fetch(`${API_BASE_URL}/descuentos/${id}/desactivar`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => data as Descuento);
    },

    // Aplicar descuento a una venta
    aplicarDescuento(ventaId: number, descuentoId: number) {
        return fetch(`${API_BASE_URL}/descuentos/aplicar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                venta_id: ventaId,
                descuento_id: descuentoId
            })
        })
            .then((res) => res.json())
            .then((data) => data as {
                descuento_aplicado: number;
                monto_final: number;
                mensaje: string;
            });
    }
};
