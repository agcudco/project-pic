import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import type { Categoria } from '../../types/Categoria';

interface CategoriaFormProps {
  visible: boolean;
  categoria: Categoria;
  onHide: () => void;
  onSave: (categoria: Categoria) => void;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({ visible, categoria, onHide, onSave }) => {
  const [current, setCurrent] = useState<Categoria>(categoria);

  useEffect(() => {
    setCurrent(categoria);
  }, [categoria]);

  const save = () => {
    if (!current.nombre.trim()) return; // Validación simple
    onSave(current);
    onHide();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent({ ...current, nombre: e.target.value });
  };

  return (
    <Dialog header={current.id ? 'Editar Categoría' : 'Nueva Categoría'} visible={visible} onHide={onHide}>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="nombre">Nombre:</label>
          <InputText id="nombre" value={current.nombre} onChange={handleChange} />
        </div>
        <Button label="Guardar" icon="pi pi-check" onClick={save} />
      </div>
    </Dialog>
  );
};
