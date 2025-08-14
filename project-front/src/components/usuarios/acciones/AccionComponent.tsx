import React, { useRef, useState } from "react";
import type { Accion } from "../../../types/accion";
import {
    getAcciones,
    updateAccion,
    createAccion,
    deleteAccion
} from "../../../services/servicesAccion";
import { AccionTable } from "./AccionDataTable";
import { AccionForm } from "./AccionForm";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const AccionComponent: React.FC = () => {
    const [acciones, setAcciones] = useState<Accion[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedAccion, setSelectedAccion] = useState<Accion>({
        id: 0,
        nombre: "",
        id_menu: 0,
        url: "",
        icono: "",
        descripcion: "",
        activo: false,
        fecha_creacion: new Date()
    });

    const toast = useRef<Toast>(null);

    // Cargar acciones al iniciar
    React.useEffect(() => {
        loadAcciones();
    }, []);

    const loadAcciones = async () => {
        const data = await getAcciones();
        setAcciones(data);
    };

    const saveAccion = async (accion: Accion) => {
        try {
            if (acciones.find(a => a.id === accion.id)) {
                await updateAccion(accion.id, accion);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Acción actualizada exitosamente',
                    life: 3000
                });
            } else {
                await createAccion(accion);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Acción creada exitosamente',
                    life: 3000
                });
            }
            await loadAcciones();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al guardar la acción',
                life: 3000
            });
        }
    };

    const openNew = () => {
        setSelectedAccion({
            id: 0,
            nombre: "",
            id_menu: 0,
            url: "",
            icono: "",
            descripcion: "",
            activo: false,
            fecha_creacion: new Date()
        });
        setDialogVisible(true);
    };

    const confirmarDelete = (accion: Accion) => {
        confirmDialog({
            message: '¿Deseas eliminar esta acción?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteAccion(accion.id);
                    await loadAcciones();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Acción eliminada exitosamente',
                        life: 3000
                    });
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo eliminar la acción',
                        life: 3000
                    });
                }
            }
        });
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Button label="Nueva Acción" icon="pi pi-plus" onClick={openNew} className="mb-3" />

            <AccionTable
                acciones={acciones}
                onEdit={(a) => {
                    setSelectedAccion(a);
                    setDialogVisible(true);
                }}
                onDelete={confirmarDelete}
            />

            <AccionForm
                visible={dialogVisible}
                accion={selectedAccion}
                onHide={() => setDialogVisible(false)}
                onSave={saveAccion}
            />
        </div>
    );
};
