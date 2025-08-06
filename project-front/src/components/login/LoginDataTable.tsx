import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { getAllRoles } from '../services/loginService';
import { Toast } from 'primereact/toast';

export default function LoginTable({ onEdit }) {
    const [roles, setRoles] = useState([]);
    const toast = React.useRef(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const { data } = await getAllRoles();
                setRoles(data);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles' });
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
                <Column body={(rowData) => (
                    <Button label="Ver Usuarios" icon="pi pi-users" onClick={() => onEdit(rowData)} />
                )} header="Acciones"></Column>
            </DataTable>
        </div>
    );
}
