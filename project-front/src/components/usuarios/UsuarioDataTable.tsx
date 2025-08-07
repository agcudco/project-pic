import React from 'react';
import type { Usuario } from '../../types/Usuario';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

export const UsuarioTable: React.FC<UsuarioTableProps> = ({ usuarios, onEdit, onDelete }) => {
  const actionBodyTemplate = (rowData: Usuario) => (
    <>
      <Button icon="pi pi-pencil" onClick={() => onEdit(rowData)} className="p-button-text" />
      <Button icon="pi pi-trash" onClick={() => onDelete(rowData)} className="p-button-text p-button-danger" />
    </>
  );

  return (
    <div className="card">
      <DataTable value={usuarios} tableStyle={{ minWidth: '60rem' }} header="Lista de Usuarios">
        <Column field="id" header="ID" />
        <Column field="cedula" header="Cédula" />
        <Column field="nombres" header="Nombres" />
        <Column field="apellidos" header="Apellidos" />
        <Column field="email" header="Email" />
        <Column field="telefono" header="Teléfono" />
        <Column body={actionBodyTemplate} header="Acciones" style={{ textAlign: 'center' }} />
      </DataTable>
    </div>
  );
};
