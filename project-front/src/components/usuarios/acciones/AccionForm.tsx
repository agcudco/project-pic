
import type { Accion } from "../../../types/accion";

import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';

interface AccionFormProps {
    visible: boolean;
    accion: Accion;
    onHide(): void;
    onSave(accion: Accion): void;
}

export const AccionForm: React.FC<AccionFormProps> = ({ visible, accion, onHide, onSave }) => {
    const [current, setCurrent] = useState<Accion>(accion);

    useEffect(() => {
        setCurrent(accion);
    }, [accion]);

    const save = () => {
        onSave(current);
        onHide();
    };

    return (
        <Dialog header={accion.id ? 'Editar Acción' : 'Nueva Acción'} visible={visible} onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="nombre">Nombre:</label>
                    <InputText
                        id="nombre"
                        value={current.nombre}
                        onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
                        placeholder="Nombre de la acción"
                    />

                    <label htmlFor="id_menu">ID Menú:</label>
                    <InputText
                        id="id_menu"
                        value={current.id_menu.toString()}
                        onChange={(e) => setCurrent({ ...current, id_menu: Number(e.target.value) })}
                        placeholder="ID del menú"
                    />

                    <label htmlFor="url">URL:</label>
                    <InputText
                        id="url"
                        value={current.url}
                        onChange={(e) => setCurrent({ ...current, url: e.target.value })}
                        placeholder="Ruta URL"
                    />

                    <label htmlFor="icono">Ícono:</label>
                    <InputText
                        id="icono"
                        value={current.icono}
                        onChange={(e) => setCurrent({ ...current, icono: e.target.value })}
                        placeholder="Ícono"
                    />

                    <label htmlFor="descripcion">Descripción:</label>
                    <InputText
                        id="descripcion"
                        value={current.descripcion}
                        onChange={(e) => setCurrent({ ...current, descripcion: e.target.value })}
                        placeholder="Descripción"
                    />

                    <div className="p-field-checkbox mt-2">
                        <Checkbox
                            inputId="activo"
                            checked={current.activo}
                            onChange={(e) => setCurrent({ ...current, activo: e.checked ?? false })}
                        />
                        <label htmlFor="activo">Activo</label>
                    </div>

                    <label htmlFor="fecha_creacion">Fecha de creación:</label>
                    <Calendar
                        id="fecha_creacion"
                        value={current.fecha_creacion ? new Date(current.fecha_creacion) : undefined}
                        disabled
                        showIcon
                    />

                </div>

                <Button
                    label="Guardar"
                    icon="pi pi-check"
                    onClick={save}
                    className="mt-3"
                />
            </div>
        </Dialog>
    );
};
