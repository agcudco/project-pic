import React from "react";
import { AvalonTable, AvalonColumn, AvalonButton, AvalonTag } from 'avalon-react-10.1.0';

export interface RolModuloDataTableProps {
  data: Array<{
    id_rol: number;
    id_modulo: number;
    rol_nombre?: string;
    modulo_nombre?: string;
    activo: boolean;
    fecha_asignacion: string;
  }>;
  loading?: boolean;
  onEdit?: (asignacion: any) => void;
  onDelete?: (id_rol: number | string, id_modulo: number | string) => void;
  onToggleEstado?: (asignacion: any) => void;
}

export const RolModuloDataTable: React.FC<RolModuloDataTableProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
  onToggleEstado
}) => {
  const estadoBodyTemplate = (rowData: any) => (
    <AvalonTag 
      value={rowData.activo ? 'Activo' : 'Inactivo'} 
      severity={rowData.activo ? 'success' : 'danger'} 
    />
  );

  const accionesBodyTemplate = (rowData: any) => (
    <div className="flex gap-2">
      <AvalonButton 
        icon="pi pi-pencil"
        className="p-button-rounded p-button-info"
        tooltip="Editar"
        tooltipOptions={{ position: 'top' }}
        onClick={() => onEdit?.(rowData)}
      />
      <AvalonButton 
        icon={rowData.activo ? 'pi pi-times' : 'pi pi-check'} 
        className={`p-button-rounded p-button-${rowData.activo ? 'danger' : 'success'}`}
        tooltip={rowData.activo ? 'Desactivar' : 'Activar'}
        tooltipOptions={{ position: 'top' }}
        onClick={() => onToggleEstado?.(rowData)}
      />
      <AvalonButton 
        icon="pi pi-trash" 
        className="p-button-rounded p-button-danger"
        tooltip="Eliminar asignación"
        tooltipOptions={{ position: 'top' }}
        onClick={() => onDelete?.(rowData.id_rol, rowData.id_modulo)}
      />
    </div>
  );

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2>Asignación de Módulos a Roles</h2>
      </div>
      
      <AvalonTable 
        value={data} 
        loading={loading}
        paginator 
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} asignaciones"
        emptyMessage="No se encontraron asignaciones"
      >
        <AvalonColumn field="rol_nombre" header="Rol" sortable filter filterPlaceholder="Buscar por rol" />
        <AvalonColumn field="modulo_nombre" header="Módulo" sortable filter filterPlaceholder="Buscar por módulo" />
        <AvalonColumn field="fecha_asignacion" header="Fecha Asignación" sortable dataType="date" />
        <AvalonColumn field="activo" header="Estado" body={estadoBodyTemplate} sortable />
        <AvalonColumn 
          body={accionesBodyTemplate} 
          style={{ minWidth: '16rem' }} 
          bodyClassName="text-center"
        />
      </AvalonTable>
    </div>
  );
};
