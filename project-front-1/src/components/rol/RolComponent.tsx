import React, { useState, useRef, useEffect } from 'react';
import type { Rol } from '../../types/rol';
import { 
  getRoles, 
  getRolById, 
  createRol, 
  updateRol, 
  deleteRol 
} from '../../services/servicesRol';
import { RolDataTable } from './RolDataTable';
import { RolForm } from './RolForm';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';

export const RolComponent: React.FC = () => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [selectedRol, setSelectedRol] = useState<Partial<Rol>>({
        name: '',
        description: '',
    });

    const toast = useRef<Toast>(null);

    // Cargar roles al montar el componente
    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            showError('Error al cargar los roles');
        } finally {
            setLoading(false);
        }
    };

    const saveRol = async (rolData: Partial<Rol>) => {
        try {
            if (rolData.id) {
                await updateRol(rolData.id, rolData);
                showSuccess('Rol actualizado exitosamente');
            } else {
                await createRol(rolData as Omit<Rol, 'id'>);
                showSuccess('Rol creado exitosamente');
            }
            await loadRoles();
            setDialogVisible(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error';
            showError(rolData.id ? `Error al actualizar el rol: ${errorMessage}` : `Error al crear el rol: ${errorMessage}`);
        }
    };

    const showSuccess = (message: string) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: message,
            life: 3000,
        });
    };

    const showError = (message: string) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000,
        });
    };

    const openNew = () => {
        setSelectedRol({ name: '', description: '' });
        setDialogVisible(true);
    };

    const openEdit = (rol: Rol) => {
        setSelectedRol({ ...rol });
        setDialogVisible(true);
    };

    const handleDelete = (rol: Rol) => {
        confirmDialog({
            message: '¿Está seguro de que desea eliminar este rol?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    if (!rol.id) {
                        throw new Error('ID de rol no válido');
                    }
                    await deleteRol(rol.id);
                    showSuccess('Rol eliminado exitosamente');
                    await loadRoles();
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                    showError(`Error al eliminar el rol: ${errorMessage}`);
                }
            },
            reject: () => {}
        });
    };

    if (loading) {
        return (
            <div className="card flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Roles</h2>
                <Button 
                    label="Nuevo Rol" 
                    icon="pi pi-plus" 
                    className="p-button-success"
                    onClick={openNew} 
                />
            </div>
            
            <div className="card">
                <RolDataTable 
                    roles={roles} 
                    onEdit={openEdit} 
                    onDelete={handleDelete} 
                />
            </div>

            <RolForm 
                visible={dialogVisible} 
                rol={selectedRol} 
                onHide={() => setDialogVisible(false)} 
                onSave={saveRol} 
            />
        </div>
    );
};