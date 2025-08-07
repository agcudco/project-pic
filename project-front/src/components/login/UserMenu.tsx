import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { updatePassword } from '../../services/servicesLogin';
import type { Login } from '../../types/login';
import { InputText } from 'primereact/inputtext';

interface UserMenuProps {
  user: Login;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const toast = useRef<Toast>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = async () => {
    try {
      await updatePassword(user.id, newPassword);
      setShowDialog(false);
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
    <div className="user-menu p-p-4 text-center">
      <Toast ref={toast} />
      <h2>Bienvenido {user.email} {user.roles?.map((role) => role.nombre).join(', ') || 'Sin roles'}</h2>
      <p>Tus roles: {user.roles?.map((role) => role.nombre).join(', ') || 'Sin roles'}</p>

      <Button label="Actualizar Contraseña" icon="pi pi-key" onClick={() => setShowDialog(true)} className="p-button-success m-2" />
      <Button label="Cerrar Sesión" icon="pi pi-sign-out" onClick={onLogout} className="p-button-danger m-2" />

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

export default UserMenu;
