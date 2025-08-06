import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { getAllRoles } from '../../services/servicesLogin';
import type { Role } from '../../types/login';

interface LoginDataTableProps {
  onEdit: (role: Role) => void;
}

const LoginDataTable: React.FC<LoginDataTableProps> = ({ onEdit }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch {
        toast.current?.show?.({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los roles',
        });
      }
    };
    fetchRoles();
  }, []);

  return (
    <div>
      <Toast ref={toast} />
      <DataTable value={roles} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" />
        <Column field="nombre" header="Rol" />
        <Column field="descripcion" header="Descripción" />
        <Column
          header="Acciones"
          body={(rowData: Role) => (
            <Button
              label="Editar"
              icon="pi pi-pencil"
              className="p-button-rounded p-button-info"
              onClick={() => onEdit(rowData)}
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default LoginDataTable;
