import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import PromocionList from './PromocionList.js';
import AplicarDescuento from './AplicarDescuento.js';
import { PromocionService } from '../../services/promocionService.js';
import type { Promocion } from '../../types/promocion.js';

const DescuentosPage: React.FC = () => {
    const [showAplicarDescuento, setShowAplicarDescuento] = useState(false);
    const [promocionesActivas, setPromocionesActivas] = useState<Promocion[]>([]);

    useEffect(() => {
        loadPromocionesActivas();
    }, []);

    const loadPromocionesActivas = async () => {
        try {
            const data = await PromocionService.getPromocionesActivas();
            setPromocionesActivas(data);
        } catch (error) {
            console.error('Error al cargar promociones activas:', error);
        }
    };

    const handleDescuentoAplicado = (descuento: number, montoFinal: number) => {
        console.log(`Descuento aplicado: $${descuento}, Monto final: $${montoFinal}`);
        // Aquí podrías actualizar algún estado global o mostrar una notificación
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h2>Gestión de Descuentos y Promociones</h2>
                        <Button
                            label="Aplicar Descuento"
                            icon="pi pi-percentage"
                            onClick={() => setShowAplicarDescuento(true)}
                            className="p-button-success"
                        />
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="grid mb-4">
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="text-center">
                                <h3 className="text-2xl font-bold text-primary">{promocionesActivas.length}</h3>
                                <p className="text-gray-600">Promociones Activas</p>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="text-center">
                                <h3 className="text-2xl font-bold text-green-500">
                                    {promocionesActivas.filter(p => p.tipo === 'producto').length}
                                </h3>
                                <p className="text-gray-600">Descuentos por Producto</p>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="text-center">
                                <h3 className="text-2xl font-bold text-blue-500">
                                    {promocionesActivas.filter(p => p.tipo === 'categoria').length}
                                </h3>
                                <p className="text-gray-600">Descuentos por Categoría</p>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="text-center">
                                <h3 className="text-2xl font-bold text-purple-500">
                                    {promocionesActivas.filter(p => p.tipo === 'monto_total').length}
                                </h3>
                                <p className="text-gray-600">Descuentos por Monto</p>
                            </Card>
                        </div>
                    </div>

                    {/* Lista de promociones */}
                    <PromocionList />

                    {/* Diálogo para aplicar descuento */}
                    <AplicarDescuento
                        visible={showAplicarDescuento}
                        onHide={() => setShowAplicarDescuento(false)}
                        promocionesActivas={promocionesActivas}
                        onDescuentoAplicado={handleDescuentoAplicado}
                    />
                </div>
            </div>
        </div>
    );
};

export default DescuentosPage;
