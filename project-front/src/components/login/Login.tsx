import React, { useState, useContext } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, contrasenia);
      navigate('/roles');
    } catch (err) {
      setError('Credenciales incorrectas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <Card title="Iniciar Sesión" className="login-card">
        <form onSubmit={handleLogin} className="login-form">
          <span className="p-float-label">
            <InputText id="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            <label htmlFor="email">Correo electrónico</label>
          </span>
          <span className="p-float-label" style={{ marginTop: '1.5rem' }}>
            <Password id="password" value={contrasenia} onChange={e => setContrasenia(e.target.value)} feedback={false} toggleMask />
            <label htmlFor="password">Contraseña</label>
          </span>
          {error && <div className="login-error">{error}</div>}
          <Button label="Ingresar" icon="pi pi-sign-in" loading={loading} className="login-btn" />
        </form>
      </Card>
    </div>
  );
};

export default Login;
