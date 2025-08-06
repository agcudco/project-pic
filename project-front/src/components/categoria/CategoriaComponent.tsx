import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import type { Categoria } from '../../types/Categoria';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../../services/CategoriaServices';
import { CategoriaTable } from './CategoriaTable';
import { CategoriaForm } from './CategoriaForm';

export const CategoriaComponent: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<Categoria>({ id: 0, nombre: '' });
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
  };

  const saveCategoria = async (categoria: Categoria) => {
    try {
      if (categoria.id && categoria.id !== 0) {
        const updated = await updateCategoria(categoria);
        setCategorias(categorias.map(c => (c.id === updated.id ? updated : c)));
        toast.current?.show({ severity: 'success', summary: 'Actualizado', detail: 'Categoría actualizada correctamente', life: 3000 });
      } else {
        const created = await createCategoria({ nombre: categoria.nombre });
        setCategorias([...categorias, created]);
        toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Categoría creada correctamente', life: 3000 });
      }
      setDialogVisible(false);
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
  };

  const confirmDelete = (categoria: Categoria) => {
    confirmDialog({
      message: `¿Seguro que deseas eliminar la categoría "${categoria.nombre}"?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteCategoria(categoria.id);
          setCategorias(categorias.filter(c => c.id !== categoria.id));
          toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Categoría eliminada correctamente', life: 3000 });
        } catch (error: any) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        }
      },
    });
  };

  const openNew = () => {
    setCurrentCategoria({ id: 0, nombre: '' });
    setDialogVisible(true);
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Button label="Nueva Categoría" icon="pi pi-plus" onClick={openNew} />
      <CategoriaTable
        categorias={categorias}
        onEdit={(c) => {
          setCurrentCategoria(c);
          setDialogVisible(true);
        }}
        onDelete={confirmDelete}
      />
      <CategoriaForm
        visible={dialogVisible}
        categoria={currentCategoria}
        onHide={() => setDialogVisible(false)}
        onSave={saveCategoria}
      />
    </div>
  );
};
