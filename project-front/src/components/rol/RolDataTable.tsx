import type React from "react";
import type { Rol } from "../../types/rol";
import { AvalonTable, AvalonColumn, AvalonButton } from 'avalon-react-10.1.0';

interface RolTableProps {
    roles: Rol[];
    onEdit(rol: Rol): void;
    onDelete(rol: Rol): void;
}

export const RolDataTable: React.FC<RolTableProps> = ({ roles, onEdit, onDelete }) => {
    const actionBodyTemplate = (rowData: Rol) => (
        <>
            <AvalonButton icon="pi pi-pencil" onClick={() => onEdit(rowData)} />
            <AvalonButton icon="pi pi-trash" onClick={() => onDelete(rowData)} className="p-button-danger" />
        </>
    );

    return (
        <AvalonTable value={roles} header="Gestión de Roles">
            <AvalonColumn field="id" header="Id" />
            <AvalonColumn field="nombre" header="Nombre" />
            <AvalonColumn field="descripcion" header="Descripción" />
            <AvalonColumn header="Acciones" body={actionBodyTemplate} />
        </AvalonTable>
    );
};