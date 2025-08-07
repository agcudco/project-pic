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
    <div className="login-form" style={{
      maxWidth: 400,
      margin: '4rem auto',
      padding: '2.5rem 2rem',
      borderRadius: 16,
      background: '#fff',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
    }}>
      <Toast ref={toast} />
      <span className="pi pi-user" style={{ fontSize: 48, color: '#2196F3', marginBottom: 8 }}></span>
      <h2 style={{ margin: 0, color: '#222', fontWeight: 700 }}>Iniciar Sesión</h2>
      <div className="p-field" style={{ width: '100%' }}>
        <label htmlFor="email" style={{ fontWeight: 500 }}>Correo</label>
        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} placeholder="ejemplo@email.com" />
      </div>
      <div className="p-field" style={{ width: '100%' }}>
        <label htmlFor="password" style={{ fontWeight: 500 }}>Contraseña</label>
        <Password id="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} feedback={false} style={{ width: '100%' }} inputStyle={{ width: '100%' }} toggleMask placeholder="********" />
      </div>
      <Button label="Ingresar" icon="pi pi-sign-in" onClick={handleSubmit} className="p-button-success mt-3" style={{ width: '100%' }} />
    </div>
  );
};

export default LoginForm;
