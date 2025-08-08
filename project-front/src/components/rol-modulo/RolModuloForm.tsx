import React, { useState, useEffect } from 'react';
import { 
  AvalonDialog, 
  AvalonDropdown, 
  AvalonButton,
  AvalonMessage
} from 'avalon-react-10.1.0';

export interface RolModuloFormProps {
  visible: boolean;
  roles: Array<{
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    nivel_acceso: number;
    fecha_creacion: string;
  }>;
  modulos: Array<{
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    fecha_creacion: string;
  }>;
  loading?: boolean;
  onHide: () => void;
  onSubmit: (rolId: string | number, moduloId: string | number) => void;
  asignacion?: {
    id_rol: number;
    id_modulo: number;
    rol_nombre?: string;
    modulo_nombre?: string;
    activo: boolean;
    fecha_asignacion: string;
  } | null;
}

export const RolModuloForm: React.FC<RolModuloFormProps> = ({
  visible,
  roles,
  modulos,
  loading = false,
  onHide,
  onSubmit,
  asignacion
}) => {
  const [selectedRol, setSelectedRol] = useState<string | number>('');
  const [selectedModulo, setSelectedModulo] = useState<string | number>('');
  const [submitted, setSubmitted] = useState(false);

  // Resetear o cargar datos del formulario
  useEffect(() => {
    if (visible) {
      if (asignacion) {
        setSelectedRol(asignacion.id_rol);
        setSelectedModulo(asignacion.id_modulo);
      } else {
        setSelectedRol('');
        setSelectedModulo('');
      }
      setSubmitted(false);
    }
  }, [visible, asignacion]);

  const handleSubmit = () => {
    setSubmitted(true);
    
    if (selectedRol && selectedModulo) {
      onSubmit(selectedRol, selectedModulo);
      // No cerramos el formulario aquí, dejamos que el componente padre lo maneje
      // después de que la operación sea exitosa
    } else {
      AvalonMessage.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000
      });
    }
  };
  
  const getRolNombre = (id: number | string): string => {
    const rol = roles.find(r => r.id === id || r.id.toString() === id);
    return rol ? rol.nombre : '';
  };
  
  const getModuloNombre = (id: number | string): string => {
    const modulo = modulos.find(m => m.id === id || m.id.toString() === id);
    return modulo ? modulo.nombre : '';
  };
  
  // Interfaz para las opciones del dropdown
  interface DropdownOption {
    label: string;
    value: number | string;
  }

  const rolOptions = roles
    .filter(rol => rol.activo) // Solo roles activos
    .map(rol => ({
      label: rol.nombre,
      value: rol.id
    }));

  const moduloOptions = modulos
    .filter(modulo => modulo.activo) // Solo módulos activos
    .map(modulo => ({
      label: modulo.nombre,
      value: modulo.id
    }));

  return (
    <AvalonDialog 
      header={asignacion ? 'Editar Asignación' : 'Asignar Módulo a Rol'}
      visible={visible} 
      style={{ width: '30vw', maxWidth: '500px' }} 
      onHide={onHide}
      modal
      footer={
        <div>
          <AvalonButton 
            label="Cancelar" 
            icon="pi pi-times" 
            className="p-button-text" 
            onClick={onHide} 
          />
          <AvalonButton 
            label={asignacion ? 'Actualizar' : 'Asignar'} 
            icon="pi pi-check" 
            onClick={handleSubmit} 
            loading={loading}
            disabled={loading}
          />
        </div>
      }
    >
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="rol">Rol *</label>
          <AvalonDropdown
            id="rol"
            value={selectedRol}
            options={rolOptions}
            optionLabel="label"
            optionValue="value"
            valueTemplate={(option: { value: number | string }) => (
              <div>{getRolNombre(option.value)}</div>
            )}
            itemTemplate={(option: DropdownOption) => (
              <div>{option.label}</div>
            )}
            onChange={(e: { value: number | string }) => setSelectedRol(e.value)}
            placeholder="Seleccione un rol"
            className={submitted && !selectedRol ? 'p-invalid' : ''}
            disabled={loading}
          />
          {submitted && !selectedRol && <small className="p-error">El rol es requerido</small>}
        </div>
        
        <div className="p-field">
          <label htmlFor="modulo">Módulo *</label>
          <AvalonDropdown
            id="modulo"
            value={selectedModulo}
            options={moduloOptions}
            optionLabel="label"
            optionValue="value"
            valueTemplate={(option: { value: number | string }) => (
              <div>{getModuloNombre(option.value)}</div>
            )}
            itemTemplate={(option: DropdownOption) => (
              <div>{option.label}</div>
            )}
            onChange={(e: { value: number | string }) => setSelectedModulo(e.value)}
            placeholder="Seleccione un módulo"
            className={submitted && !selectedModulo ? 'p-invalid' : ''}
            disabled={loading}
          />
          {submitted && !selectedModulo && <small className="p-error">El módulo es requerido</small>}
        </div>
      </div>
    </AvalonDialog>
  );
};
