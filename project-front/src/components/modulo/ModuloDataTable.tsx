import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import type { Modulo } from '../../types/modulo';
import { deleteModulo } from '../../services/moduloService';

interface ModuloDataTableProps {
  modulos: Modulo[];
  onEdit: (modulo: Modulo) => void;
  onRefresh: () => void;
}

const ModuloDataTable: React.FC<ModuloDataTableProps> = ({ modulos, onEdit, onRefresh }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = React.useRef<Toast>(null);

  const handleDelete = (id: number) => {
    confirmDialog({
      message: '¿Está seguro de eliminar este módulo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: async () => {
        try {
          setLoading(true);
          await deleteModulo(id);
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Módulo eliminado correctamente',
            life: 3000,
          });
          onRefresh();
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error instanceof Error ? error.message : 'Error al eliminar el módulo',
            life: 3000,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const statusBodyTemplate = (rowData: Modulo) => {
    return (
      <span className={`p-tag ${rowData.estado ? 'p-tag-success' : 'p-tag-danger'}`}>
        {rowData.estado ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: Modulo) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text p-button-sm"
          onClick={() => onEdit(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-sm p-button-danger"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Eliminar"
          tooltipOptions={{ position: 'top' }}
          loading={loading}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          value={modulos}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} módulos"
          loading={loading}
          emptyMessage="No se encontraron módulos"
          responsiveLayout="scroll"
        >
          <Column field="id" header="ID" sortable style={{ width: '10%' }} />
          <Column field="nombre" header="Nombre" sortable style={{ width: '25%' }} />
          <Column field="descripcion" header="Descripción" sortable style={{ width: '40%' }} />
          <Column 
            field="estado" 
            header="Estado" 
            body={statusBodyTemplate} 
            style={{ width: '15%' }} 
            sortable 
          />
          <Column 
            body={actionBodyTemplate} 
            style={{ width: '10%', textAlign: 'center' }}
            exportable={false}
          />
        </DataTable>
      </div>
    </>
  );
};

export default ModuloDataTable;
