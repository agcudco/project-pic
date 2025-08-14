import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { CategoriaService } from "../../services/categoriaServices";
import type { Categoria, CategoriaFormData } from "../../types/Categoria";
import CategoriaList from "./CategoriaList";
import CategoriaForm from "./CategoriaForm";

const CategoriaPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<Categoria | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const showSuccess = (msg: string) =>
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: msg,
      life: 3000,
    });
  const showError = (msg: string) =>
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 3000,
    });

  const loadCategorias = () => {
    setLoading(true);
    CategoriaService.getAll()
      .then(setCategorias)
      .catch(() => showError("Error al cargar categorías"))
      .finally(() => setLoading(false));
  };

  const openNew = () => {
    setSelected(null);
    setCategoryDialog(true);
  };

  const hideDialog = () => setCategoryDialog(false);
  const hideDeleteDialog = () => setDeleteDialog(false);

  const handleSave = (data: CategoriaFormData) => {
    if (selected?.id) {
      CategoriaService.update(selected.id, data)
        .then(() => {
          showSuccess("Categoría actualizada correctamente");
          loadCategorias();
          hideDialog();
        })
        .catch((e: Error) =>
          showError(e.message || "Error al actualizar la categoría")
        );
    } else {
      CategoriaService.create(data)
        .then(() => {
          showSuccess("Categoría creada correctamente");
          loadCategorias();
          hideDialog();
        })
        .catch((e: Error) =>
          showError(e.message || "Error al crear la categoría")
        );
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setSelected(categoria);
    setCategoryDialog(true);
  };

  const handleDelete = (categoria: Categoria) => {
    setSelected(categoria);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selected?.id) return;
    CategoriaService.remove(selected.id)
      .then(() => {
        showSuccess("Categoría eliminada correctamente");
        loadCategorias();
        hideDeleteDialog();
        setSelected(null);
      })
      .catch((e: Error) =>
        showError(e.message || "Error al eliminar la categoría")
      );
  };

  const leftToolbarTemplate = () => (
    <div className="flex flex-wrap gap-2">
      <Button
        label="Nueva Categoría"
        icon="pi pi-plus"
        severity="success"
        onClick={openNew}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <Button
      label="Actualizar"
      icon="pi pi-refresh"
      className="p-button-help"
      onClick={loadCategorias}
    />
  );

  const deleteDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={confirmDelete}
      />
    </>
  );

  return (
    <div className="categoria-page">
      <Toast ref={toast} />

      <div className="card">
        <h1>Gestión de Categorías</h1>
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />

        <CategoriaList
          categorias={categorias}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CategoriaForm
        visible={categoryDialog}
        categoria={selected}
        onHide={hideDialog}
        onSave={handleSave}
      />

      <Dialog
        visible={deleteDialog}
        style={{ width: "450px" }}
        header="Confirmar Eliminación"
        modal
        footer={deleteDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selected && (
            <span>
              ¿Estás seguro de que quieres eliminar la categoría{" "}
              <b>{selected.nombre}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default CategoriaPage;
