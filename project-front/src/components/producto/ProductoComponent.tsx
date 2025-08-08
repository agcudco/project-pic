import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Producto } from "../../types/producto";
import {
  getProductos,
  addProducto,
  updateProducto,
  deleteProducto,
} from "../../services/servicesProducto";
import { ProductoTable } from "./ProductoDataTable";
import { ProductoForm } from "./ProductoForm";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const ProductoComponent: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto>({
    id: 0,
    nombre: "",
    descripcion: "",
    precio_venta: 0,
    costo: 0,
    imagen_url: "",
    activo: true,
  });
  const toast = useRef<Toast>(null);

  // Cargar productos desde la API
  const loadProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error al cargar productos",
        detail: (error as Error).message,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const saveProducto = async (producto: Producto) => {
    try {
      const exists = productos.find((p) => p.id === producto.id);

      if (exists) {
        const updated = await updateProducto(producto);
        toast.current?.show({
          severity: "success",
          summary: "Producto actualizado",
          detail: "Producto actualizado correctamente",
          life: 3000,
        });
      } else {
        const created = await addProducto(producto);
        toast.current?.show({
          severity: "success",
          summary: "Producto guardado",
          detail: "Producto guardado correctamente",
          life: 3000,
        });
      }

      await loadProductos();
      setDialogVisible(false);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: (error as Error).message,
        life: 3000,
      });
    }
  };

  const confirmDelete = (producto: Producto) => {
    confirmDialog({
      message: "¿Deseas eliminar este producto?",
      header: "Confirmación",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteProducto(producto);
          await loadProductos();
          toast.current?.show({
            severity: "success",
            summary: "Producto eliminado",
            detail: "Producto eliminado correctamente",
            life: 3000,
          });
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: (error as Error).message,
            life: 3000,
          });
        }
      },
    });
  };

  const openNew = () => {
    setSelectedProducto({
      id: 0, // se generará en backend
      nombre: "",
      descripcion: "",
      precio_venta: 0,
      costo: 0,
      imagen_url: "",
      activo: true,
    });
    setDialogVisible(true);
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Button
        label="Nuevo"
        icon="pi pi-plus"
        onClick={openNew}
        className="mb-3"
      />
      <ProductoTable
        productos={productos}
        onEdit={(p) => {
          setSelectedProducto(p);
          setDialogVisible(true);
        }}
        onDelete={confirmDelete}
      />
      <ProductoForm
        visible={dialogVisible}
        producto={selectedProducto}
        onHide={() => setDialogVisible(false)}
        onSave={saveProducto}
      />
    </div>
  );
};
