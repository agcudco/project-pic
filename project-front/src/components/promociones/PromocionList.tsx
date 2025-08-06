import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import type { Promocion } from '../../types/promocion.js';

interface PromocionListProps {
    promociones: Promocion[];
    loading: boolean;
    onEdit: (promocion: Promocion) => void;
    onDelete: (promocion: Promocion) => void;
    onToggleStatus: (promocion: Promocion) => void;
}

const PromocionList: React.FC<PromocionListProps> = ({
    promociones,
    loading,
    onEdit,
    onDelete,
    onToggleStatus
}) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null);

    const actionBodyTemplate = (rowData: Promocion) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    className="mr-2" 
                    onClick={() => onEdit(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    severity="danger" 
                    onClick={() => onDelete(rowData)} 
                />
                <Button 
                    icon={rowData.activa ? "pi pi-eye-slash" : "pi pi-eye"} 
                    rounded 
                    outlined 
                    severity={rowData.activa ? "warning" : "success"}
                    onClick={() => onToggleStatus(rowData)} 
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
            <h4 className="m-0">Lista de Promociones</h4>
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

    return (
        <div className="card">
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
    );
};

export default PromocionList;
