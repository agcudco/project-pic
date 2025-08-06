import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { updatePassword } from '../../services/servicesLogin';
import type { Login } from '../../types/login';

interface LoginFormProps {
  user: Login;
}

const LoginForm: React.FC<LoginFormProps> = ({ user }) => {
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const toast = useRef<Toast>(null);

  const handleSubmit = async () => {
    try {
      await updatePassword(user.id, nuevaContrasenia);
      toast.current?.show?.({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Contraseña actualizada correctamente',
      });
    } catch {
      toast.current?.show?.({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar la contraseña',
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <h3>Actualizar Contraseña para {user.email}</h3>
      <span className="p-float-label">
        <InputText
          id="nuevaContrasenia"
          value={nuevaContrasenia}
          onChange={(e) => setNuevaContrasenia(e.target.value)}
        />
        <label htmlFor="nuevaContrasenia">Nueva Contraseña</label>
      </span>
      <Button
        label="Guardar"
        icon="pi pi-save"
        className="p-button-success mt-2"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default LoginForm;
