import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  AvalonToast, 
  AvalonConfirmDialog
} from 'avalon-react';
import { RolModuloDataTable } from './RolModuloDataTable';
import { RolModuloForm } from './RolModuloForm';
import { 
  getRolModulos, 
  createRolModulo, 
  updateRolModulo, 
  deleteRolModulo,
  toggleRolModuloStatus
} from '../../services/servicesRolModulo';
import { getRoles } from '../../services/servicesRol';
import { getModulos } from '../../services/servicesModulo';

// Interfaces locales para evitar conflictos
interface IRol {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  nivel_acceso: number;
  fecha_creacion: string;
}

interface IModulo {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
}

interface IRolModulo {
  id_rol: number;
  id_modulo: number;
  rol_nombre?: string;
  modulo_nombre?: string;
  activo: boolean;
  fecha_asignacion: string;
}

export const RolModuloComponent: React.FC = () => {
  // Estados
  const [asignaciones, setAsignaciones] = useState<IRolModulo[]>([]);
  const [roles, setRoles] = useState<IRol[]>([]);
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<IRolModulo | null>(null);
  const toast = useRef<any>(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);
  
  // Eliminamos parseId ya que no se está usando

  // Función para cargar todos los datos necesarios
  const cargarDatos = async () => {
    setLoading(true);
    
    try {
      // Cargar roles, módulos y asignaciones en paralelo
      const [rolesData, modulosData, asignacionesData] = await Promise.all([
        getRoles(),
        getModulos(),
        getRolModulos()
      ]);
      
      setRoles(rolesData);
      setModulos(modulosData);
      setAsignaciones(asignacionesData);
      
    } catch (err) {
      console.error('Error al cargar datos:', err);
      mostrarError('Error al cargar los datos. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAsignar = () => {
    setSelectedAsignacion(null);
    setShowForm(true);
  };

  const handleDesasignar = async (id_rol: string | number, id_modulo: string | number) => {
    const rolId = typeof id_rol === 'string' ? parseInt(id_rol, 10) : id_rol;
    const moduloId = typeof id_modulo === 'string' ? parseInt(id_modulo, 10) : id_modulo;
    
    try {
      setLoading(true);
      
      // Verificar si la asignación existe antes de intentar eliminarla
      const asignacionExiste = asignaciones.some(a => 
        a.id_rol === rolId && a.id_modulo === moduloId
      );
      
      if (!asignacionExiste) {
        mostrarError('La asignación que intenta eliminar no existe');
        return;
      }
      
      await deleteRolModulo(rolId, moduloId);
      await cargarDatos();
      mostrarExito('Módulo desasignado correctamente');
    } catch (error: unknown) {
      console.error('Error al desasignar módulo:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          mostrarError('La asignación no existe o ya fue eliminada');
        } else {
          mostrarError('Error al desasignar el módulo');
        }
      } else {
        mostrarError('Error de conexión. Por favor, intente nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (rolModulo: IRolModulo) => {
    try {
      setLoading(true);
      await toggleRolModuloStatus(rolModulo.id_rol, rolModulo.id_modulo, !rolModulo.activo);
      await cargarDatos();
      mostrarExito(`Módulo ${!rolModulo.activo ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error al cambiar estado del módulo:', error);
      mostrarError('Error al cambiar el estado del módulo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (rolId: string | number, moduloId: string | number) => {
    try {
      setLoading(true);
      
      // Convertir a números si son strings
      const rolIdNum = typeof rolId === 'string' ? parseInt(rolId, 10) : rolId;
      const moduloIdNum = typeof moduloId === 'string' ? parseInt(moduloId, 10) : moduloId;
      
      // Validar que el rol y el módulo existen
      const rolExiste = roles.some(r => r.id === rolIdNum);
      const moduloExiste = modulos.some(m => m.id === moduloIdNum);
      
      if (!rolExiste) {
        mostrarError('El rol seleccionado no existe');
        return;
      }
      
      if (!moduloExiste) {
        mostrarError('El módulo seleccionado no existe');
        return;
      }

      if (selectedAsignacion) {
        // Validar si la asignación ya existe (para actualización)
        const existeOtraAsignacion = asignaciones.some(a => 
          a.id_rol === rolIdNum && 
          a.id_modulo === moduloIdNum &&
          (a.id_rol !== selectedAsignacion.id_rol || a.id_modulo !== selectedAsignacion.id_modulo)
        );
        
        if (existeOtraAsignacion) {
          mostrarError('Ya existe una asignación con este rol y módulo');
          return;
        }
        
        // Actualizar asignación existente
        await updateRolModulo(selectedAsignacion.id_rol, selectedAsignacion.id_modulo, { 
          activo: true 
        });
      } else {
        // Validar si ya existe la asignación (para creación)
        const existeAsignacion = asignaciones.some(a => 
          a.id_rol === rolIdNum && a.id_modulo === moduloIdNum
        );
        
        if (existeAsignacion) {
          mostrarError('Esta asignación ya existe');
          return;
        }
        
        // Crear nueva asignación
        await createRolModulo({
          id_rol: rolIdNum,
          id_modulo: moduloIdNum,
          activo: true
        });
      }
      
      setShowForm(false);
      await cargarDatos();
      mostrarExito(`Módulo ${selectedAsignacion ? 'actualizado' : 'asignado'} correctamente`);
    } catch (error: unknown) {
      console.error('Error al guardar la asignación:', error);
      
      // Manejar errores específicos
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          mostrarError('Esta asignación ya existe en el sistema');
        } else if (error.response?.status === 404) {
          mostrarError('No se encontró el recurso solicitado');
        } else {
          mostrarError('Error al guardar la asignación');
        }
      } else {
        mostrarError('Error de conexión. Por favor, intente nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const mostrarError = (mensaje: string) => {
    if (toast.current) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: mensaje,
        life: 3000
      });
    }
  };

  const mostrarExito = (mensaje: string) => {
    if (toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: mensaje,
        life: 3000
      });
    }
  };

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Módulos por Rol</h1>
        <button 
          className="p-button p-button-primary"
          onClick={handleAsignar}
          disabled={loading}
        >
          <i className="pi pi-plus mr-2"></i>
          Asignar Módulo
        </button>
      </div>

      <RolModuloDataTable 
        data={asignaciones}
        onEdit={(asignacion) => {
          setSelectedAsignacion(asignacion);
          setShowForm(true);
        }}
        onDelete={handleDesasignar}
        onToggleEstado={handleToggleEstado}
        loading={loading}
      />

      <RolModuloForm
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedAsignacion(null);
        }}
        onSubmit={handleSubmit}
        asignacion={selectedAsignacion}
        roles={roles}
        modulos={modulos}
        loading={loading}
      />

      <AvalonToast ref={toast} />
      <AvalonConfirmDialog />
    </div>
  );
}
