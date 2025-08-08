import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { updatePassword } from '../services/loginService';
import { Toast } from 'primereact/toast';

export default function LoginForm({ user }) {
    const [nuevaContrasenia, setNuevaContrasenia] = useState('');
    const toast = React.useRef(null);

    const handleSubmit = async () => {
        try {
            await updatePassword(user.id, nuevaContrasenia);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <h3>Actualizar Contraseña para {user?.email || 'Usuario'}</h3>
            <span className="p-float-label">
                <InputText id="nuevaContrasenia" value={nuevaContrasenia} onChange={(e) => setNuevaContrasenia(e.target.value)} />
                <label htmlFor="nuevaContrasenia">Nueva Contraseña</label>
            </span>
            <Button label="Guardar" icon="pi pi-save" className="p-button-success mt-2" onClick={handleSubmit} />
        </div>
    );
}
