import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from './services/servicesLogin';
import type { Login } from './types/login';

interface IndexPageProps {
  user: Login | null;
}

const IndexPage: React.FC<IndexPageProps> = ({ user }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handlePasswordChange = async () => {
    if (!user) return;
    try {
      await updatePassword(user.id, newPassword);
      setShowDialog(false);
      setNewPassword('');
      toast.current?.show?.({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Contraseña actualizada',
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
    <div style={{
      maxWidth: 500,
      margin: '5rem auto',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      padding: '2.5rem 2rem',
      textAlign: 'center',
    }}>
      <Toast ref={toast} />
      <h1 style={{ color: '#222', fontWeight: 700 }}>¡Bienvenido al sistema!</h1>
      <p style={{ color: '#555' }}>Has iniciado sesión correctamente.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
        <Button label="Actualizar Contraseña" icon="pi pi-key" className="p-button-success" onClick={() => setShowDialog(true)} />
        <Button label="Cerrar Sesión" icon="pi pi-sign-out" className="p-button-danger" onClick={handleLogout} />
      </div>
      <Dialog header="Actualizar Contraseña" visible={showDialog} onHide={() => setShowDialog(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <InputText id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button label="Actualizar" icon="pi pi-save" onClick={handlePasswordChange} className="p-button-success mt-2" />
        </div>
      </Dialog>
    </div>
  );
};

export default IndexPage;
