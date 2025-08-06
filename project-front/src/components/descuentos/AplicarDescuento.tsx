import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { PromocionService } from '../../services/promocionService.js';
import type { Promocion, AplicarDescuentoRequest } from '../../types/promocion.js';

interface AplicarDescuentoProps {
    visible: boolean;
    onHide: () => void;
    promocionesActivas: Promocion[];
    onDescuentoAplicado?: (descuento: number, montoFinal: number) => void;
}

const AplicarDescuento: React.FC<AplicarDescuentoProps> = ({
    visible,
    onHide,
    promocionesActivas,
    onDescuentoAplicado
}) => {
    const [ventaId, setVentaId] = useState<number>(0);
    const [promocionId, setPromocionId] = useState<number | null>(null);
    const [montoBase, setMontoBase] = useState<number>(100);
    const [cantidad, setCantidad] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

    const promocionOptions = promocionesActivas.map((promo: Promocion) => ({
        label: `${promo.nombre} (${promo.tipo} - ${promo.valor}${promo.tipo === 'producto' && promo.valor <= 1 ? '%' : ''})`,
        value: promo.id
    }));

    const handleAplicarDescuento = async () => {
        if (!ventaId || !promocionId) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor completa todos los campos requeridos',
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);
            const request: AplicarDescuentoRequest = {
                venta_id: ventaId,
                promocion_id: promocionId,
                monto_base: montoBase,
                cantidad: cantidad
            };

            const response = await PromocionService.aplicarDescuento(request);

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `Descuento aplicado: $${response.descuento_aplicado}. ${response.mensaje}`,
                life: 5000
            });

            if (onDescuentoAplicado) {
                onDescuentoAplicado(response.descuento_aplicado, response.monto_final);
            }

            // Limpiar formulario
            setVentaId(0);
            setPromocionId(null);
            setMontoBase(100);
            setCantidad(1);
            
            onHide();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al aplicar el descuento',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const dialogFooter = (
        <>
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                outlined 
                onClick={onHide} 
                disabled={loading}
            />
            <Button 
                label="Aplicar Descuento" 
                icon="pi pi-check" 
                onClick={handleAplicarDescuento} 
                loading={loading}
            />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                style={{ width: '500px' }}
                header="Aplicar Descuento"
                modal
                className="p-fluid"
                footer={dialogFooter}
                onHide={onHide}
            >
                <div className="field">
                    <label htmlFor="ventaId">ID de Venta *</label>
                    <InputNumber
                        id="ventaId"
                        value={ventaId}
                        onValueChange={(e: any) => setVentaId(e.value || 0)}
                        placeholder="Ingresa el ID de la venta"
                        min={1}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="promocion">Promoción *</label>
                    <Dropdown
                        id="promocion"
                        value={promocionId}
                        options={promocionOptions}
                        onChange={(e: any) => setPromocionId(e.value)}
                        placeholder="Selecciona una promoción"
                        emptyMessage="No hay promociones activas"
                    />
                </div>

                <div className="field">
                    <label htmlFor="montoBase">Monto Base</label>
                    <InputNumber
                        id="montoBase"
                        value={montoBase}
                        onValueChange={(e: any) => setMontoBase(e.value || 0)}
                        mode="currency"
                        currency="USD"
                        locale="en-US"
                        min={0}
                    />
                    <small>Monto sobre el cual se calculará el descuento</small>
                </div>

                <div className="field">
                    <label htmlFor="cantidad">Cantidad</label>
                    <InputNumber
                        id="cantidad"
                        value={cantidad}
                        onValueChange={(e: any) => setCantidad(e.value || 1)}
                        min={1}
                    />
                    <small>Cantidad de productos (para descuentos por cantidad)</small>
                </div>

                <div className="field">
                    <small className="text-muted">
                        * Campos requeridos. El descuento se calculará según el tipo de promoción seleccionada.
                    </small>
                </div>
            </Dialog>
        </>
    );
};

export default AplicarDescuento;
