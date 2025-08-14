import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import type { Categoria } from "../../types/Categoria";

interface Props {
  categorias: Categoria[];
  loading: boolean;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

const CategoriaList: React.FC<Props> = ({
  categorias,
  loading,
  onEdit,
  onDelete,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const actionTemplate = (row: Categoria) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        onClick={() => onEdit(row)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => onDelete(row)}
      />
    </div>
  );

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Lista de Categorías</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={categorias}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
        globalFilter={globalFilter}
        header={header}
        loading={loading}
        emptyMessage="No hay categorías"
      >
        <Column field="id" header="#" sortable style={{ width: "6rem" }} />
        <Column
          field="nombre"
          header="Nombre"
          sortable
          style={{ minWidth: "14rem" }}
        />
        <Column
          body={actionTemplate}
          exportable={false}
          style={{ minWidth: "10rem" }}
        />
      </DataTable>
    </div>
  );
};

export default CategoriaList;
