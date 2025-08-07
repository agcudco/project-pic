import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

import type { Usuario } from '../../types/Usuario';
import { UsuarioForm } from './UsuarioForm';
import { UsuarioTable } from './UsuarioDataTable';
import { usuarioService } from '../../services/servicesUsuario';

export const UsuarioComponent: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario>({
    id: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    contrasenia: '',
    id_rol: 1,
    tipo_cliente: '',
    razon_social: ''
  });

  const toast = useRef<Toast>(null);

  const loadUsuarios = async () => {
    try {
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const saveUsuario = async (usuario: Usuario) => {
    try {
      if (usuario.id === 0) {
        await usuarioService.create(usuario);
        toast.current?.show({ severity: 'success', summary: 'Usuario creado' });
      } else {
        await usuarioService.update(usuario.id, usuario);
        toast.current?.show({ severity: 'success', summary: 'Usuario actualizado' });
      }
      loadUsuarios();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el usuario' });
    }
  };

  const confirmDelete = (usuario: Usuario) => {
    confirmDialog({
      message: `¿Deseas eliminar al usuario ${usuario.nombres} ${usuario.apellidos}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await usuarioService.delete(usuario.id);
          toast.current?.show({ severity: 'success', summary: 'Usuario eliminado' });
          loadUsuarios();
        } catch (error) {
          toast.current?.show({ severity: 'error', summary: 'Error al eliminar' });
        }
      },
    });
  };

  const openNew = () => {
    setSelectedUsuario({
      id: 0,
      cedula: '',
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      contrasenia: '',
      id_rol: 1, 
      tipo_cliente: '',
      razon_social: ''
    });
    setDialogVisible(true);
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={openNew} />
      <UsuarioTable usuarios={usuarios} onEdit={(u) => {
        setSelectedUsuario(u);
        setDialogVisible(true);
      }} onDelete={confirmDelete} />
      <UsuarioForm visible={dialogVisible} usuario={selectedUsuario} onHide={() => setDialogVisible(false)} onSave={saveUsuario} />
    </div>
  );
};
