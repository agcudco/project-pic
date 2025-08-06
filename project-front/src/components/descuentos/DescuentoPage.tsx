import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DescuentoService } from '../../services/descuentoService.js';
import type { Descuento, DescuentoFormData } from '../../types/descuento.js';
import DescuentoList from './DescuentoList.js';
import DescuentoForm from './DescuentoForm.js';

const DescuentoPage: React.FC = () => {
    const [descuentos, setDescuentos] = useState<Descuento[]>([]);
    const [loading, setLoading] = useState(false);
    const [descuentoDialog, setDescuentoDialog] = useState(false);
    const [deleteDescuentoDialog, setDeleteDescuentoDialog] = useState(false);
    const [selectedDescuento, setSelectedDescuento] = useState<Descuento | null>(null);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadDescuentos();
    }, []);

    const loadDescuentos = () => {
        setLoading(true);
        DescuentoService.getAllDescuentos()
            .then((data) => {
                setDescuentos(data);
            })
            .catch(() => {
                showError('Error al cargar descuentos');
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
        setSelectedDescuento(null);
        setDescuentoDialog(true);
    };

    const hideDialog = () => {
        setDescuentoDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDescuentoDialog(false);
    };

    const handleSave = (descuentoData: DescuentoFormData) => {
        if (selectedDescuento?.id) {
            DescuentoService.updateDescuento(selectedDescuento.id, descuentoData)
                .then(() => {
                    showSuccess('Descuento actualizado correctamente');
                    loadDescuentos();
                    hideDialog();
                })
                .catch(() => {
                    showError('Error al actualizar el descuento');
                });
        } else {
            DescuentoService.createDescuento(descuentoData)
                .then(() => {
                    showSuccess('Descuento creado correctamente');
                    loadDescuentos();
                    hideDialog();
                })
                .catch(() => {
                    showError('Error al crear el descuento');
                });
        }
    };

    const handleEdit = (descuento: Descuento) => {
        setSelectedDescuento(descuento);
        setDescuentoDialog(true);
    };

    const handleDelete = (descuento: Descuento) => {
        setSelectedDescuento(descuento);
        setDeleteDescuentoDialog(true);
    };

    const confirmDelete = () => {
        if (selectedDescuento?.id) {
            DescuentoService.deleteDescuento(selectedDescuento.id)
                .then(() => {
                    loadDescuentos();
                    hideDeleteDialog();
                    setSelectedDescuento(null);
                    showSuccess('Descuento eliminado correctamente');
                })
                .catch(() => {
                    showError('Error al eliminar el descuento');
                });
        }
    };

    const handleToggleStatus = (descuento: Descuento) => {
        if (!descuento.id) return;

        if (descuento.activo) {
            DescuentoService.desactivarDescuento(descuento.id)
                .then(() => {
                    showSuccess('Descuento desactivado');
                    loadDescuentos();
                })
                .catch(() => {
                    showError('Error al desactivar el descuento');
                });
        } else {
            DescuentoService.activarDescuento(descuento.id)
                .then(() => {
                    showSuccess('Descuento activado');
                    loadDescuentos();
                })
                .catch(() => {
                    showError('Error al activar el descuento');
                });
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button 
                    label="Nuevo Descuento" 
                    icon="pi pi-plus" 
                    severity="success" 
                    onClick={openNew} 
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
                onClick={loadDescuentos} 
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
        <div className="descuento-page">
            <Toast ref={toast} />
            
            <div className="card">
                <h1>Gestión de Descuentos</h1>
                
                <Toolbar 
                    className="mb-4" 
                    left={leftToolbarTemplate} 
                    right={rightToolbarTemplate}
                />

                <DescuentoList
                    descuentos={descuentos}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <DescuentoForm
                visible={descuentoDialog}
                descuento={selectedDescuento}
                onHide={hideDialog}
                onSave={handleSave}
            />

            <Dialog
                visible={deleteDescuentoDialog}
                style={{ width: '450px' }}
                header="Confirmar Eliminación"
                modal
                footer={deleteDialogFooter}
                onHide={hideDeleteDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedDescuento && (
                        <span>
                            ¿Estás seguro de que quieres eliminar el descuento <b>{selectedDescuento.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default DescuentoPage;
