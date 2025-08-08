import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { Categoria } from '../../types/Categoria';

interface CategoriaTableProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

export const CategoriaTable: React.FC<CategoriaTableProps> = ({ categorias, onEdit, onDelete }) => {
  const actionBodyTemplate = (rowData: Categoria) => (
    <>
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-info" onClick={() => onEdit(rowData)} aria-label="Editar" />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => onDelete(rowData)} aria-label="Eliminar" />
    </>
  );

  return (
    <DataTable value={categorias} header="Gestión de Categorías" paginator rows={5}>
      <Column field="id" header="ID" sortable />
      <Column field="nombre" header="Nombre" sortable />
      <Column header="Acciones" body={actionBodyTemplate} />
    </DataTable>
  );
};
