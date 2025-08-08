import React from 'react';
import type { Rol } from '../../types/rol';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';

interface RolDataTableProps {
  roles: Rol[];
  onEdit: (rol: Rol) => void;
  onDelete: (rol: Rol) => void;
  loading?: boolean;
}

export const RolDataTable: React.FC<RolDataTableProps> = ({ 
  roles, 
  onEdit, 
  onDelete,
  loading = false
}) => {
  const actionBodyTemplate = (rowData: Rol) => (
    <div className="flex gap-2">
      <Tooltip target=".edit-btn" />
      <Button 
        icon="pi pi-pencil" 
        className="p-button-rounded p-button-text edit-btn" 
        data-pr-tooltip="Editar"
        data-pr-position="top"
        onClick={() => onEdit(rowData)} 
      />
      <Tooltip target=".delete-btn" />
      <Button 
        icon="pi pi-trash" 
        className="p-button-rounded p-button-text p-button-danger delete-btn" 
        data-pr-tooltip="Eliminar"
        data-pr-position="top"
        onClick={() => onDelete(rowData)} 
      />
    </div>
  );

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h3 className="m-0">Lista de Roles</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <input 
          type="search" 
          className="p-inputtext p-component" 
          placeholder="Buscar..." 
          // onInput={(e) => setGlobalFilter(e.currentTarget.value)} 
        />
      </span>
    </div>
  );

  return (
    <div className="card">
      <DataTable 
        value={roles} 
        header={header}
        paginator 
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={loading}
        emptyMessage="No se encontraron roles"
        className="p-datatable-sm"
        stripedRows
        removableSort
        showGridlines
      >
        <Column field="id" header="ID" sortable style={{ width: '10%' }} />
        <Column field="name" header="Nombre" sortable style={{ width: '30%' }} />
        <Column field="description" header="Descripción" sortable style={{ width: '45%' }} />
        <Column 
          body={actionBodyTemplate} 
          style={{ width: '15%', textAlign: 'center' }} 
          bodyClassName="text-center"
        />
      </DataTable>
    </div>
  );
};