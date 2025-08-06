import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { getAllRoles } from '../../services/servicesLogin';

import { Role } from '../../types/login';

interface LoginTableProps {
  onEdit: (role: Role) => void;
}

const LoginTable: React.FC<LoginTableProps> = ({ onEdit }) => {
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
          detail: 'No se pudieron cargar los roles'
        });
      }
    };
    fetchRoles();
  }, []);

  return (
    <div>
      <Toast ref={toast} />
      <DataTable value={roles} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Rol"></Column>
        <Column field="descripcion" header="Descripción"></Column>
        <Column
          header="Acciones"
          body={(rowData: Role) => (
            <Button
              label="Editar"
              icon="pi pi-pencil"
              onClick={() => onEdit(rowData)}
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default LoginTable;
