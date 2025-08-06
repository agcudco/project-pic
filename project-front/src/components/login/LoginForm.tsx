import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { login } from '../../services/servicesLogin';
import type { Login } from '../../types/login';

interface LoginFormProps {
  onLogin: (user: Login) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const toast = useRef<Toast>(null);

  const handleSubmit = async () => {
    try {
      const user = await login(email, contrasenia);
      onLogin(user);
      toast.current?.show?.({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Sesión iniciada correctamente',
      });
    } catch {
      toast.current?.show?.({
        severity: 'error',
        summary: 'Error',
        detail: 'Credenciales inválidas',
      });
    }
  };

  return (
    <div className="login-form">
      <Toast ref={toast} />
      <h2>Iniciar Sesión</h2>
      <div className="p-field">
        <label htmlFor="email">Correo</label>
        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="p-field">
        <label htmlFor="password">Contraseña</label>
        <Password id="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} feedback={false} />
      </div>
      <Button label="Ingresar" icon="pi pi-sign-in" onClick={handleSubmit} className="p-button-success mt-3" />
    </div>
  );
};

export default LoginForm;
