import React, { useState, useContext } from 'react';
import type { RefObject } from 'react';         // tipo-only import
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { AuthContext } from '../../context/AuthContext';

interface Props {
  // RefObject que puede contener Toast o null
  toast: RefObject<Toast | null>;
}

const Login: React.FC<Props> = ({ toast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Login correcto',
        life: 2000
      });
      navigate('/roles');
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: 3000
      });
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
      <form onSubmit={handleSubmit} className="p-card p-p-4" style={{ width: '320px' }}>
        <h2 className="p-text-center">Iniciar Sesión</h2>

        <label htmlFor="username">Usuario</label>
        <InputText
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-mb-3"
          placeholder="usuario"
        />

        <label htmlFor="password">Contraseña</label>
        <InputText
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-mb-4"
          placeholder="********"
        />

        <Button
          type="submit"
          label="Entrar"
          icon="pi pi-sign-in"
          className="p-button-rounded p-button-block"
        />
      </form>
    </div>
  );
};

export default Login;
