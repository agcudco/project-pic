import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import type { Descuento } from '../../types/descuento.js';

interface DescuentoListProps {
    descuentos: Descuento[];
    loading: boolean;
    onEdit: (descuento: Descuento) => void;
    onDelete: (descuento: Descuento) => void;
    onToggleStatus: (descuento: Descuento) => void;
}

const DescuentoList: React.FC<DescuentoListProps> = ({
    descuentos,
    loading,
    onEdit,
    onDelete,
    onToggleStatus
}) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedDescuento, setSelectedDescuento] = useState<Descuento | null>(null);

    const actionBodyTemplate = (rowData: Descuento) => {
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
                    icon={rowData.activo ? "pi pi-eye-slash" : "pi pi-eye"} 
                    rounded 
                    outlined 
                    severity={rowData.activo ? "warning" : "success"}
                    onClick={() => onToggleStatus(rowData)} 
                />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Descuento) => {
        return (
            <span className={`px-2 py-1 rounded text-sm ${rowData.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {rowData.activo ? 'Activo' : 'Inactivo'}
            </span>
        );
    };

    const valorBodyTemplate = (rowData: Descuento) => {
        return (
            <span>
                {rowData.tipo === 'fijo' ? '$' : ''}{rowData.porcentaje}
                {rowData.tipo === 'porcentaje' ? '%' : ''}
            </span>
        );
    };

    const tipoBodyTemplate = (rowData: Descuento) => {
        return (
            <span className={`px-2 py-1 rounded text-sm ${rowData.tipo === 'porcentaje' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                {rowData.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto Fijo'}
            </span>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Lista de Descuentos</h4>
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
                value={descuentos}
                selection={selectedDescuento}
                onSelectionChange={(e: any) => setSelectedDescuento(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} descuentos"
                globalFilter={globalFilter}
                header={header}
                loading={loading}
            >
                <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="tipo" header="Tipo" body={tipoBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                <Column field="porcentaje" header="Valor" body={valorBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                <Column field="activo" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>
    );
};

export default DescuentoList;
