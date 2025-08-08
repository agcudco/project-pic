import type { Producto } from "../../types/producto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Image } from "primereact/image";

interface Props {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

export const ProductoTable: React.FC<Props> = ({
  productos,
  onEdit,
  onDelete,
}) => {
  const actionBodyTemplate = (rowData: Producto) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-info"
          onClick={() => onEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => onDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={productos}
      paginator
      rows={5}
      stripedRows
      responsiveLayout="scroll"
    >
      <Column field="id" header="ID" sortable />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="descripcion" header="Descripción" />
      <Column field="precio_venta" header="Precio Venta" sortable />
      <Column field="costo" header="Costo" sortable />
      <Column
        field="imagen_url"
        header="Imagen"
        body={(row) => (
          <Image
            src={row.imagen_url}
            alt={row.nombre}
            width="60"
            preview
          />
        )}
      />
      <Column body={actionBodyTemplate} header="Acciones" />
    </DataTable>
  );
};
