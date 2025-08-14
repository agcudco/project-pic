import type React from "react";
import type { Accion } from "../../../types/accion";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";

// Props del componente
interface AccionTableProps {
    acciones: Accion[];
    onEdit(accion: Accion): void;
    onDelete(accion: Accion): void;
}

export const AccionTable: React.FC<AccionTableProps> = ({ acciones, onEdit, onDelete }) => {

    // Botones de acción por fila
    const actionBodyTemplate = (rowData: Accion) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => onDelete(rowData)} />
        </>
    );

    // Columna para mostrar booleano "activo"
    const activoTemplate = (rowData: Accion) => (
        <span>{rowData.activo ? 'Sí' : 'No'}</span>
    );

    // Formatear la fecha
    const fechaTemplate = (rowData: Accion) => {
        const raw = rowData.fecha_creacion;

        // Asegura que sea string y transforma al formato ISO válido para JS
        const iso = typeof raw === 'string' ? raw.replace(' ', 'T') : raw;
        const fecha = new Date(iso);

        // Verificar si es válida
        if (isNaN(fecha.getTime())) return 'Fecha inválida';

        // Formato completo (ejemplo: 05/08/2025, 20:23:03)
        return fecha.toLocaleString('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };


    return (
        <DataTable value={acciones} header="Gestión de Acciones" responsiveLayout="scroll">
            <Column field="id" header="ID" />
            <Column field="nombre" header="Nombre" />
            <Column field="id_menu" header="ID Menú" />
            <Column field="url" header="URL" />
            <Column field="icono" header="Ícono" />
            <Column field="descripcion" header="Descripción" />
            <Column field="activo" header="Activo" body={activoTemplate} />
            <Column field="fecha_creacion" header="Fecha de Creación" body={fechaTemplate} />
            <Column header="Acciones" body={actionBodyTemplate} />
        </DataTable>
    );
};
