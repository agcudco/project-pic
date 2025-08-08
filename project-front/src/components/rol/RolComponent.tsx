import type React from "react";
import { useState, useRef, useEffect } from 'react';
import type { Rol } from '../../types/rol';
import { getRoles, addRol, updateRol, deleteRol } from '../../services/servicesRol';
import { RolDataTable } from './RolDataTable';
import { RolForm } from './RolForm';
import { AvalonButton, AvalonToast, AvalonConfirmDialog, avalonConfirmDialog } from 'avalon-react-10.1.0';

export const RolComponent: React.FC = () => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedRol, setSelectedRol] = useState<Rol>({ id: '', nombre: '', descripcion: '' });
    const toast = useRef<any>(null);

    // Cargar roles al montar
    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (e) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles', life: 3000 });
        }
    };

    const saveRol = async (rol: Rol) => {
        try {
            if (rol.id) {
                await updateRol(rol);
                toast.current?.show({ severity: 'success', summary: 'Rol Actualizado', detail: 'Rol actualizado exitosamente', life: 3000 });
            } else {
                await addRol({ nombre: rol.nombre, descripcion: rol.descripcion });
                toast.current?.show({ severity: 'success', summary: 'Rol Creado', detail: 'Rol creado exitosamente', life: 3000 });
            }
            cargarRoles();
            setDialogVisible(false);
        } catch (e) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el rol', life: 3000 });
        }
    };

    const openNew = () => {
        setSelectedRol({ id: '', nombre: '', descripcion: '' });
        setDialogVisible(true);
    };

    const confirmedDelete = (rol: Rol) => {
        avalonConfirmDialog({
            message: '¿Deseas eliminar este rol?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteRol(rol.id);
                    cargarRoles();
                    toast.current?.show({ severity: 'success', summary: 'Rol Eliminado', detail: 'Rol eliminado exitosamente', life: 3000 });
                } catch (e) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el rol', life: 3000 });
                }
            }
        });
    };

    return (
        <div>
            <AvalonToast ref={toast} />
            <AvalonConfirmDialog />
            <AvalonButton label="Nuevo Rol" icon="pi pi-plus" onClick={openNew} />
            <RolDataTable
                roles={roles}
                onEdit={(r) => {
                    setSelectedRol(r);
                    setDialogVisible(true);
                }}
                onDelete={confirmedDelete}
            />
            <RolForm
                visible={dialogVisible}
                rol={selectedRol}
                onHide={() => setDialogVisible(false)}
                onSave={saveRol}
            />
        </div>
    );
};