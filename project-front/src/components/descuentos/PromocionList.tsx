import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { PromocionService } from '../../services/promocionService.js';
import type { Promocion, PromocionFormData } from '../../types/promocion.js';

const PromocionList: React.FC = () => {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [promocionDialog, setPromocionDialog] = useState(false);
    const [deletePromocionDialog, setDeletePromocionDialog] = useState(false);
    const [promocion, setPromocion] = useState<PromocionFormData>({
        nombre: '',
        tipo: 'producto',
        valor: 0,
        fecha_inicio: '',
        fecha_fin: '',
        activa: true
    });
    const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

    const tiposPromocion = [
        { label: 'Producto', value: 'producto' },
        { label: 'Categoría', value: 'categoria' },
        { label: 'Monto Total', value: 'monto_total' },
        { label: 'Cantidad', value: 'cantidad' }
    ];

    useEffect(() => {
        loadPromociones();
    }, []);

    const loadPromociones = async () => {
        try {
            setLoading(true);
            const data = await PromocionService.getAllPromociones();
            setPromociones(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cargar promociones',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setPromocion({
            nombre: '',
            tipo: 'producto',
            valor: 0,
            fecha_inicio: '',
            fecha_fin: '',
            activa: true
        });
        setSubmitted(false);
        setPromocionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPromocionDialog(false);
    };

    const hideDeletePromocionDialog = () => {
        setDeletePromocionDialog(false);
    };

    const savePromocion = async () => {
        setSubmitted(true);

        if (promocion.nombre.trim()) {
            try {
                if (selectedPromocion?.id) {
                    await PromocionService.updatePromocion(selectedPromocion.id, promocion);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Promoción actualizada',
                        life: 3000
                    });
                } else {
                    await PromocionService.createPromocion(promocion);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Promoción creada',
                        life: 3000
                    });
                }
                
                loadPromociones();
                hideDialog();
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al guardar la promoción',
                    life: 3000
                });
            }
        }
    };

    const editPromocion = (promocionToEdit: Promocion) => {
        setPromocion({
            nombre: promocionToEdit.nombre,
            tipo: promocionToEdit.tipo,
            valor: promocionToEdit.valor,
            condicion_json: promocionToEdit.condicion_json,
            fecha_inicio: promocionToEdit.fecha_inicio,
            fecha_fin: promocionToEdit.fecha_fin,
            activa: promocionToEdit.activa
        });
        setSelectedPromocion(promocionToEdit);
        setPromocionDialog(true);
    };

    const confirmDeletePromocion = (promocionToDelete: Promocion) => {
        setSelectedPromocion(promocionToDelete);
        setDeletePromocionDialog(true);
    };

    const deletePromocion = async () => {
        if (selectedPromocion?.id) {
            try {
                await PromocionService.deletePromocion(selectedPromocion.id);
                loadPromociones();
                setDeletePromocionDialog(false);
                setSelectedPromocion(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Promoción eliminada',
                    life: 3000
                });
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al eliminar la promoción',
                    life: 3000
                });
            }
        }
    };

    const togglePromocionStatus = async (promocion: Promocion) => {
        if (!promocion.id) return;

        try {
            if (promocion.activa) {
                await PromocionService.desactivarPromocion(promocion.id);
            } else {
                await PromocionService.activarPromocion(promocion.id);
            }
            loadPromociones();
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `Promoción ${promocion.activa ? 'desactivada' : 'activada'}`,
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cambiar el estado de la promoción',
                life: 3000
            });
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nueva" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={() => {}} />
        );
    };

    const actionBodyTemplate = (rowData: Promocion) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    className="mr-2" 
                    onClick={() => editPromocion(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    severity="danger" 
                    onClick={() => confirmDeletePromocion(rowData)} 
                />
                <Button 
                    icon={rowData.activa ? "pi pi-eye-slash" : "pi pi-eye"} 
                    rounded 
                    outlined 
                    severity={rowData.activa ? "warning" : "success"}
                    onClick={() => togglePromocionStatus(rowData)} 
                />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Promocion) => {
        return (
            <span className={`px-2 py-1 rounded text-sm ${rowData.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {rowData.activa ? 'Activa' : 'Inactiva'}
            </span>
        );
    };

    const valorBodyTemplate = (rowData: Promocion) => {
        return (
            <span>
                {rowData.tipo === 'monto_total' || rowData.tipo === 'producto' ? '$' : ''}{rowData.valor}
                {rowData.tipo === 'producto' && rowData.valor <= 1 ? '%' : ''}
            </span>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Promociones</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText 
                    type="search" 
                    onInput={(e: any) => setGlobalFilter(e.currentTarget.value)} 
                    placeholder="Buscar..." 
                />
            </span>
        </div>
    );

    const promocionDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={savePromocion} />
        </>
    );

    const deletePromocionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeletePromocionDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deletePromocion} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    value={promociones}
                    selection={selectedPromocion}
                    onSelectionChange={(e: any) => setSelectedPromocion(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} promociones"
                    globalFilter={globalFilter}
                    header={header}
                    loading={loading}
                >
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="tipo" header="Tipo" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="valor" header="Valor" body={valorBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="fecha_inicio" header="Fecha Inicio" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="fecha_fin" header="Fecha Fin" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="activa" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog
                visible={promocionDialog}
                style={{ width: '450px' }}
                header="Detalles de Promoción"
                modal
                className="p-fluid"
                footer={promocionDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText
                        id="nombre"
                        value={promocion.nombre}
                        onChange={(e: any) => setPromocion({ ...promocion, nombre: e.target.value })}
                        required
                        autoFocus
                        className={submitted && !promocion.nombre ? 'p-invalid' : ''}
                    />
                    {submitted && !promocion.nombre && <small className="p-error">Nombre es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="tipo">Tipo</label>
                    <Dropdown
                        id="tipo"
                        value={promocion.tipo}
                        options={tiposPromocion}
                        onChange={(e: any) => setPromocion({ ...promocion, tipo: e.value })}
                        placeholder="Selecciona un tipo"
                    />
                </div>

                <div className="field">
                    <label htmlFor="valor">Valor</label>
                    <InputNumber
                        id="valor"
                        value={promocion.valor}
                        onValueChange={(e: any) => setPromocion({ ...promocion, valor: e.value || 0 })}
                        mode="decimal"
                        minFractionDigits={0}
                        maxFractionDigits={2}
                    />
                </div>

                <div className="field">
                    <label htmlFor="fecha_inicio">Fecha Inicio</label>
                    <Calendar
                        id="fecha_inicio"
                        value={promocion.fecha_inicio ? new Date(promocion.fecha_inicio) : null}
                        onChange={(e: any) => setPromocion({ ...promocion, fecha_inicio: e.value?.toISOString().split('T')[0] || '' })}
                        dateFormat="yy-mm-dd"
                        showIcon
                    />
                </div>

                <div className="field">
                    <label htmlFor="fecha_fin">Fecha Fin</label>
                    <Calendar
                        id="fecha_fin"
                        value={promocion.fecha_fin ? new Date(promocion.fecha_fin) : null}
                        onChange={(e: any) => setPromocion({ ...promocion, fecha_fin: e.value?.toISOString().split('T')[0] || '' })}
                        dateFormat="yy-mm-dd"
                        showIcon
                    />
                </div>

                <div className="field-checkbox">
                    <Checkbox
                        id="activa"
                        checked={promocion.activa}
                        onChange={(e: any) => setPromocion({ ...promocion, activa: e.checked || false })}
                    />
                    <label htmlFor="activa" className="ml-2">Activa</label>
                </div>
            </Dialog>

            <Dialog
                visible={deletePromocionDialog}
                style={{ width: '450px' }}
                header="Confirmar"
                modal
                footer={deletePromocionDialogFooter}
                onHide={hideDeletePromocionDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedPromocion && (
                        <span>
                            ¿Estás seguro de que quieres eliminar <b>{selectedPromocion.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default PromocionList;
