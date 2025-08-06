import React, { useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
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
  const menu = useRef<Menu>(null);
  const toast = useRef<Toast>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const items = [
    {
      label: user.email,
      icon: 'pi pi-user',
    },
    {
      label: 'Actualizar Contraseña',
      icon: 'pi pi-key',
      command: () => setShowDialog(true),
    },
    {
      label: 'Roles',
      icon: 'pi pi-shield',
      items: user.roles.map((role) => ({
        label: role.nombre,
      })),
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => onLogout(),
    },
  ];

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
    <>
      <Toast ref={toast} />
      <Menubar
        end={
          <Button icon="pi pi-user" className="p-button-rounded p-button-info" onClick={(e) => menu.current?.toggle(e)} />
        }
      />
      <Menu model={items} popup ref={menu} />

      <Dialog header="Actualizar Contraseña" visible={showDialog} onHide={() => setShowDialog(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <InputText id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button label="Actualizar" icon="pi pi-save" onClick={handlePasswordChange} className="p-button-success mt-2" />
        </div>
      </Dialog>
    </>
  );
};

export default UserMenu;
