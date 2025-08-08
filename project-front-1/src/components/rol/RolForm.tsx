import type { Rol } from '../../types/rol';
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Message } from 'primereact/message';

interface RolFormProps {
    visible: boolean;
    rol?: Partial<Rol>;
    onHide: () => void;
    onSave: (rol: Partial<Rol>) => void;
}

export const RolForm: React.FC<RolFormProps> = ({
    visible,
    rol,
    onHide,
    onSave,
}) => {
    const [current, setCurrent] = useState<Partial<Rol>>({ name: '', description: '' });
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(rol || { name: '', description: '' });
        setSubmitted(false);
    }, [rol, visible]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        
        // Validar campos requeridos
        if (current.name && current.name.trim()) {
            onSave(current);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrent(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return current.name && current.name.trim() !== '';
    };

    const getFormErrorMessage = (name: keyof Rol) => {
        return submitted && !current[name] && (
            <Message 
                severity="error" 
                text={`${name === 'name' ? 'Nombre' : 'Descripción'} es requerido`} 
                className="mt-1"
            />
        );
    };

    const dialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                className="p-button-text" 
                onClick={onHide} 
            />
            <Button 
                label="Guardar" 
                icon="pi pi-check" 
                onClick={handleSave} 
                disabled={!isFormValid()}
            />
        </div>
    );

    return (
        <Dialog 
            header={current?.id ? "Editar Rol" : "Nuevo Rol"} 
            visible={visible} 
            style={{ width: '450px' }} 
            modal 
            className="p-fluid"
            footer={dialogFooter} 
            onHide={onHide}
        >
            <form onSubmit={handleSave}>
                <div className="field">
                    <label htmlFor="name" className="font-medium">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="name"
                        name="name"
                        value={current.name || ''}
                        onChange={handleChange}
                        className={classNames({ 'p-invalid': submitted && !current.name })}
                        autoFocus
                    />
                    {getFormErrorMessage('name')}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-medium">
                        Descripción
                    </label>
                    <InputText
                        id="description"
                        name="description"
                        value={current.description || ''}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>
            </form>
        </Dialog>
    );
};