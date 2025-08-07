import React, { useEffect, useState } from 'react';
import type { Rol, Usuario } from '../../types/Usuario';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { usuarioService } from '../../services/servicesUsuario';
import { Dropdown } from 'primereact/dropdown';

interface UsuarioFormProps {
  visible: boolean;
  usuario: Usuario;
  onHide: () => void;
  onSave: (usuario: Usuario) => Promise<void | boolean>;
}

interface ValidationErrors {
  cedula?: string;
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  contrasenia?: string;
  id_rol?: string;
  tipo_cliente?: string;
  razon_social?: string;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ visible, usuario, onHide, onSave }) => {
  const [current, setCurrent] = useState<Usuario>(usuario);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  useEffect(() => {
    setCurrent(usuario);
    setErrors({});
    setServerError('');
  }, [usuario]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await usuarioService.getRoles();
        setRoles(roles);
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // Limpiar razón social cuando cambia el tipo de cliente
  useEffect(() => {
    if (current.tipo_cliente !== 'empresa') {
      setCurrent(prev => ({ ...prev, razon_social: '' }));
    }
  }, [current.tipo_cliente]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar cédula
    if (!current.cedula?.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d{8,10}$/.test(current.cedula.trim())) {
      newErrors.cedula = 'La cédula debe tener entre 8 y 10 dígitos';
    }

    // Validar nombres
    if (!current.nombres?.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    } else if (current.nombres.trim().length < 2) {
      newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
    }

    // Validar apellidos
    if (!current.apellidos?.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    } else if (current.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!current.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(current.email.trim())) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Validar teléfono
    if (!current.telefono?.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(current.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    // Validar contraseña (solo para usuarios nuevos)
    if (!usuario.id) {
      if (!current.contrasenia?.trim()) {
        newErrors.contrasenia = 'La contraseña es requerida';
      }
    }

    // Validar rol
    if (!current.id_rol) {
      newErrors.id_rol = 'Debe seleccionar un rol';
    }

    // Validar tipo de cliente
    if (!current.tipo_cliente) {
      newErrors.tipo_cliente = 'Debe seleccionar un tipo de cliente';
    }

    // Validar razón social si es empresa
    if (current.tipo_cliente === 'empresa') {
      if (!current.razon_social?.trim()) {
        newErrors.razon_social = 'La razón social es requerida para empresas';
      } else if (current.razon_social.trim().length < 3) {
        newErrors.razon_social = 'La razón social debe tener al menos 3 caracteres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    setServerError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Limpiar datos antes de enviar
      const dataToSave = {
        ...current,
        cedula: current.cedula?.trim(),
        nombres: current.nombres?.trim(),
        apellidos: current.apellidos?.trim(),
        email: current.email?.trim(),
        telefono: current.telefono?.trim(),
        contrasenia: current.contrasenia?.trim(),
        razon_social: current.tipo_cliente === 'empresa'
          ? (current.razon_social?.trim() || '')
          : ''
      };

      // Llamar a onSave y esperar a que se complete
      const result = await onSave(dataToSave);
      
      // Solo cerrar el modal si no hay errores
      if (result !== false) {
        onHide();
      }
    } catch (error: any) {
      // Manejar errores del backend
      let errorMessage = 'Ocurrió un error al guardar el usuario';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Manejar errores específicos
      if (errorMessage.toLowerCase().includes('email') && 
          (errorMessage.toLowerCase().includes('duplicate') || 
           errorMessage.toLowerCase().includes('duplicado') ||
           errorMessage.toLowerCase().includes('exists') ||
           errorMessage.toLowerCase().includes('existe'))) {
        setErrors({ ...errors, email: 'Este email ya está registrado' });
      } else if (errorMessage.toLowerCase().includes('cedula') && 
                 (errorMessage.toLowerCase().includes('duplicate') || 
                  errorMessage.toLowerCase().includes('duplicado') ||
                  errorMessage.toLowerCase().includes('exists') ||
                  errorMessage.toLowerCase().includes('existe'))) {
        setErrors({ ...errors, cedula: 'Esta cédula ya está registrada' });
      } else {
        setServerError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof Usuario, value: any) => {
    setCurrent({ ...current, [field]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (field in errors) {
      setErrors({ ...errors, [field as keyof ValidationErrors]: undefined });
    }
    
    // Limpiar error del servidor
    if (serverError) {
      setServerError('');
    }
  };

  return (
    <Dialog 
      header={usuario.id ? "Editar Usuario" : "Nuevo Usuario"} 
      visible={visible} 
      onHide={onHide}
      style={{ width: '500px' }}
      modal
    >
      <div className="p-fluid">
        {serverError && (
          <Message severity="error" text={serverError} className="mb-3" />
        )}

        <div className="p-field mb-3">
          <label htmlFor="cedula">Cédula *</label>
          <InputText 
            id="cedula" 
            value={current.cedula || ''} 
            onChange={(e) => handleFieldChange('cedula', e.target.value)}
            className={errors.cedula ? 'p-invalid' : ''}
            maxLength={10}
          />
          {errors.cedula && <small className="p-error">{errors.cedula}</small>}
        </div>

        <div className="p-field mb-3">
          <label htmlFor="nombres">Nombres *</label>
          <InputText 
            id="nombres" 
            value={current.nombres || ''} 
            onChange={(e) => handleFieldChange('nombres', e.target.value)}
            className={errors.nombres ? 'p-invalid' : ''}
          />
          {errors.nombres && <small className="p-error">{errors.nombres}</small>}
        </div>

        <div className="p-field mb-3">
          <label htmlFor="apellidos">Apellidos *</label>
          <InputText 
            id="apellidos" 
            value={current.apellidos || ''} 
            onChange={(e) => handleFieldChange('apellidos', e.target.value)}
            className={errors.apellidos ? 'p-invalid' : ''}
          />
          {errors.apellidos && <small className="p-error">{errors.apellidos}</small>}
        </div>

        <div className="p-field mb-3">
          <label htmlFor="email">Email *</label>
          <InputText 
            id="email" 
            type="email"
            value={current.email || ''} 
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={errors.email ? 'p-invalid' : ''}
          />
          {errors.email && <small className="p-error">{errors.email}</small>}
        </div>

        <div className="p-field mb-3">
          <label htmlFor="telefono">Teléfono *</label>
          <InputText 
            id="telefono" 
            value={current.telefono || ''} 
            onChange={(e) => handleFieldChange('telefono', e.target.value)}
            className={errors.telefono ? 'p-invalid' : ''}
            maxLength={10}
          />
          {errors.telefono && <small className="p-error">{errors.telefono}</small>}
        </div>

        <div className="p-field mb-3">
          <label htmlFor="contrasenia">
            Contraseña {!usuario.id && '*'}
          </label>
          <InputText 
            id="contrasenia" 
            type="password" 
            value={current.contrasenia || ''} 
            onChange={(e) => handleFieldChange('contrasenia', e.target.value)}
            className={errors.contrasenia ? 'p-invalid' : ''}
            placeholder={usuario.id ? 'Dejar vacío para mantener la actual' : ''}
          />
          {errors.contrasenia && <small className="p-error">{errors.contrasenia}</small>}
        </div>

        <div className="p-field mb-3">
          <label htmlFor="id_rol">Rol *</label>
          <Dropdown
            id="id_rol"
            value={current.id_rol}
            options={roles}
            onChange={(e) => handleFieldChange('id_rol', e.value)}
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccione un rol"
            className={errors.id_rol ? 'p-invalid' : ''}
          />
          {errors.id_rol && <small className="p-error">{errors.id_rol}</small>}
        </div>

        <div className="p-field mb-3">
          <label htmlFor="tipo_cliente">Tipo Cliente *</label>
          <Dropdown
            id="tipo_cliente"
            value={current.tipo_cliente}
            options={[
              { label: 'Persona', value: 'persona' },
              { label: 'Empresa', value: 'empresa' }
            ]}
            onChange={(e) => handleFieldChange('tipo_cliente', e.value)}
            placeholder="Seleccione tipo"
            className={errors.tipo_cliente ? 'p-invalid' : ''}
          />
          {errors.tipo_cliente && <small className="p-error">{errors.tipo_cliente}</small>}
        </div>

        {current.tipo_cliente === 'empresa' && (
          <div className="p-field mb-3">
            <label htmlFor="razon_social">Razón Social *</label>
            <InputText 
              id="razon_social" 
              value={current.razon_social || ''} 
              onChange={(e) => handleFieldChange('razon_social', e.target.value)}
              className={errors.razon_social ? 'p-invalid' : ''}
            />
            {errors.razon_social && <small className="p-error">{errors.razon_social}</small>}
          </div>
        )}

        <div className="p-field pt-3">
          <Button 
            label="Guardar" 
            icon="pi pi-check" 
            onClick={save} 
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </Dialog>
  );
};