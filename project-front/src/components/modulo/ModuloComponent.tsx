import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import ModuloDataTable from './ModuloDataTable';
import ModuloForm from './ModuloForm';
import type { Modulo, CreateModuloDto, UpdateModuloDto } from '../../types/modulo';
import { getAllModulos, createModulo, updateModulo } from '../../services/moduloService';

const ModuloComponent: React.FC = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentModulo, setCurrentModulo] = useState<Modulo | null>(null);
  const toast = React.useRef<Toast>(null);

  const fetchModulos = async () => {
    try {
      setLoading(true);
      const data = await getAllModulos();
      setModulos(data);
    } catch (error) {
      showError('Error al cargar los módulos');
      console.error('Error fetching modulos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModulos();
  }, []);

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  };

  const handleCreate = () => {
    setCurrentModulo(null);
    setShowForm(true);
  };

  const handleEdit = (modulo: Modulo) => {
    setCurrentModulo(modulo);
    setShowForm(true);
  };

  const handleSubmit = async (data: CreateModuloDto | UpdateModuloDto) => {
    try {
      if (currentModulo) {
        // Actualizar módulo existente
        await updateModulo(currentModulo.id, data as UpdateModuloDto);
        showSuccess('Módulo actualizado correctamente');
      } else {
        // Crear nuevo módulo
        await createModulo(data as CreateModuloDto);
        showSuccess('Módulo creado correctamente');
      }
      fetchModulos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el módulo';
      showError(errorMessage);
      throw error;
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nuevo Módulo"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={handleCreate}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-4">Gestión de Módulos</h2>
      
      <Toolbar className="mb-4" left={leftToolbarTemplate} />
      
      <ModuloDataTable 
        modulos={modulos} 
        onEdit={handleEdit} 
        onRefresh={fetchModulos}
      />

      <ModuloForm
        visible={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleSubmit}
        modulo={currentModulo}
        title={currentModulo ? 'Editar Módulo' : 'Nuevo Módulo'}
      />
    </div>
  );
};

export default ModuloComponent;
