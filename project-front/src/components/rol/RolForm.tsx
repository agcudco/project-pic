import type { Rol } from "../../types/rol";
import React, { useEffect, useState } from "react";
import { AvalonDialog, AvalonInputText, AvalonButton } from 'avalon-react-10.1.0';

interface RolFormProps {
    visible: boolean;
    rol?: Rol;
    onHide: () => void;
    onSave: (rol: Rol) => void;
}

export const RolForm: React.FC<RolFormProps> = ({
    visible,
    rol,
    onHide,
    onSave,
}) => {
    const [current, setCurrent] = useState<Rol>(rol ?? { id: '', nombre: '', descripcion: '' });

    useEffect(() => {
        setCurrent(rol ?? { id: '', nombre: '', descripcion: '' });
    }, [rol]);

    const handleSave = () => {
        if (current) {
            onSave(current);
        }
        onHide();
    };

    return (
        <AvalonDialog header={rol?.id ? "Editar Rol" : "Nuevo Rol"} visible={visible} style={{ width: '30vw' }} onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="nombre">Nombre:</label>
                    <AvalonInputText id="nombre" value={current.nombre} onChange={e => setCurrent({ ...current, nombre: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="descripcion">Descripción:</label>
                    <AvalonInputText id="descripcion" value={current.descripcion} onChange={e => setCurrent({ ...current, descripcion: e.target.value })} />
                </div>
                <AvalonButton label="Guardar" icon="pi pi-check" onClick={handleSave} />
            </div>
        </AvalonDialog>
    );
};