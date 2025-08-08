import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToggleButton } from 'primereact/togglebutton';
import { classNames } from 'primereact/utils';
import type { Modulo, CreateModuloDto, UpdateModuloDto } from '../../types/modulo';

interface ModuloFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: CreateModuloDto | UpdateModuloDto) => Promise<void>;
  modulo?: Modulo | null;
  title: string;
}

const ModuloForm: React.FC<ModuloFormProps> = ({
  visible,
  onHide,
  onSubmit,
  modulo,
  title,
}) => {
  const [formData, setFormData] = useState<CreateModuloDto>({
    nombre: '',
    descripcion: '',
    estado: true,
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (modulo) {
      setFormData({
        nombre: modulo.nombre,
        descripcion: modulo.descripcion,
        estado: modulo.estado,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        estado: true,
      });
    }
    setSubmitted(false);
  }, [modulo, visible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CreateModuloDto) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (e: { value: boolean }) => {
    setFormData((prev: CreateModuloDto) => ({
      ...prev,
      estado: e.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (formData.nombre.trim()) {
      try {
        setLoading(true);
        await onSubmit(formData);
        onHide();
      } catch (error) {
        console.error('Error al guardar el módulo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isFormFieldInvalid = (name: keyof typeof formData) => {
    return submitted && !formData[name];
  };

  const getFormErrorMessage = (name: keyof typeof formData) => {
    return isFormFieldInvalid(name) && (
      <small className="p-error">
        {name === 'nombre' ? 'El nombre es requerido' : 'Este campo es requerido'}
      </small>
    );
  };

  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
        disabled={loading}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: '500px' }}
      header={title}
      modal
      className="p-fluid"
      footer={footer}
      onHide={onHide}
    >
      <form onSubmit={handleSubmit} className="p-fluid">
        <div className="field">
          <label htmlFor="nombre" className="font-bold">
            Nombre <span className="text-red-500">*</span>
          </label>
          <InputText
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={classNames({ 'p-invalid': isFormFieldInvalid('nombre') })}
            autoFocus
          />
          {getFormErrorMessage('nombre')}
        </div>

        <div className="field mt-4">
          <label htmlFor="descripcion" className="font-bold">
            Descripción
          </label>
          <InputTextarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            rows={3}
            autoResize
          />
        </div>

        <div className="field mt-4">
          <div className="flex align-items-center">
            <label htmlFor="estado" className="font-bold mr-3">
              Estado:
            </label>
            <ToggleButton
              id="estado"
              onLabel="Activo"
              offLabel="Inactivo"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              checked={formData.estado}
              onChange={(e) => handleToggleChange(e)}
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default ModuloForm;
