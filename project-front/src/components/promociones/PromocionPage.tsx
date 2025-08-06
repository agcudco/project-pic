import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { PromocionService } from '../../services/promocionService.js';
import PromocionList from './PromocionList.js';
import PromocionForm from './PromocionForm.js';
import type { Promocion, PromocionFormData } from '../../types/promocion.js';

const PromocionPage: React.FC = () => {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(false);
    const [promocionDialog, setPromocionDialog] = useState(false);
    const [deletePromocionDialog, setDeletePromocionDialog] = useState(false);
    const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadPromociones();
    }, []);

    const loadPromociones = () => {
        setLoading(true);
        PromocionService.getAllPromociones()
            .then((data) => {
                setPromociones(data);
            })
            .catch(() => {
                showError('Error al cargar promociones');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const showSuccess = (message: string) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: message,
            life: 3000
        });
    };

    const showError = (message: string) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        });
    };

    const openNew = () => {
        setSelectedPromocion(null);
        setPromocionDialog(true);
    };

    const hideDialog = () => {
        setPromocionDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeletePromocionDialog(false);
    };

    const handleSave = (promocionData: PromocionFormData) => {
        if (selectedPromocion?.id) {
            PromocionService.updatePromocion(selectedPromocion.id, promocionData)
                .then(() => {
                    showSuccess('Promoción actualizada correctamente');
                    loadPromociones();
                    hideDialog();
                })
                .catch(() => {
                    showError('Error al actualizar la promoción');
                });
        } else {
            PromocionService.createPromocion(promocionData)
                .then(() => {
                    showSuccess('Promoción creada correctamente');
                    loadPromociones();
                    hideDialog();
                })
                .catch(() => {
                    showError('Error al crear la promoción');
                });
        }
    };

    const handleEdit = (promocion: Promocion) => {
        setSelectedPromocion(promocion);
        setPromocionDialog(true);
    };

    const handleDelete = (promocion: Promocion) => {
        setSelectedPromocion(promocion);
        setDeletePromocionDialog(true);
    };

    const confirmDelete = () => {
        if (selectedPromocion?.id) {
            PromocionService.deletePromocion(selectedPromocion.id)
                .then(() => {
                    loadPromociones();
                    hideDeleteDialog();
                    setSelectedPromocion(null);
                    showSuccess('Promoción eliminada correctamente');
                })
                .catch(() => {
                    showError('Error al eliminar la promoción');
                });
        }
    };

    const handleToggleStatus = (promocion: Promocion) => {
        if (!promocion.id) return;

        if (promocion.activa) {
            PromocionService.desactivarPromocion(promocion.id)
                .then(() => {
                    showSuccess('Promoción desactivada');
                    loadPromociones();
                })
                .catch(() => {
                    showError('Error al desactivar la promoción');
                });
        } else {
            PromocionService.activarPromocion(promocion.id)
                .then(() => {
                    showSuccess('Promoción activada');
                    loadPromociones();
                })
                .catch(() => {
                    showError('Error al activar la promoción');
                });
        }
    };

    const openAplicarDescuento = () => {
        // Funcionalidad para aplicar descuentos removida
        showSuccess('Funcionalidad de aplicar descuentos disponible en versión completa');
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button 
                    label="Nueva Promoción" 
                    icon="pi pi-plus" 
                    severity="success" 
                    onClick={openNew} 
                />
                <Button 
                    label="Aplicar Descuento" 
                    icon="pi pi-percentage" 
                    severity="info" 
                    onClick={openAplicarDescuento} 
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button 
                label="Actualizar" 
                icon="pi pi-refresh" 
                className="p-button-help" 
                onClick={loadPromociones} 
            />
        );
    };

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={confirmDelete} />
        </>
    );

    return (
        <div className="promocion-page">
            <Toast ref={toast} />
            
            <div className="card">
                <h1>Gestión de Promociones y Descuentos</h1>
                
                <Toolbar 
                    className="mb-4" 
                    left={leftToolbarTemplate} 
                    right={rightToolbarTemplate}
                />

                <PromocionList
                    promociones={promociones}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <PromocionForm
                visible={promocionDialog}
                promocion={selectedPromocion}
                onHide={hideDialog}
                onSave={handleSave}
            />

            <Dialog
                visible={deletePromocionDialog}
                style={{ width: '450px' }}
                header="Confirmar Eliminación"
                modal
                footer={deleteDialogFooter}
                onHide={hideDeleteDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedPromocion && (
                        <span>
                            ¿Estás seguro de que quieres eliminar la promoción <b>{selectedPromocion.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default PromocionPage;
