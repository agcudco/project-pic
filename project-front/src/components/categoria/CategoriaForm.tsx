import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import type { Categoria, CategoriaFormData } from "../../types/Categoria";

interface Props {
  visible: boolean;
  categoria?: Categoria | null;
  onHide: () => void;
  onSave: (data: CategoriaFormData) => void;
}

const CategoriaForm: React.FC<Props> = ({
  visible,
  categoria,
  onHide,
  onSave,
}) => {
  const [formData, setFormData] = useState<CategoriaFormData>({ nombre: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (categoria) setFormData({ nombre: categoria.nombre });
    else setFormData({ nombre: "" });
    setSubmitted(false);
  }, [categoria, visible]);

  const handleSave = () => {
    setSubmitted(true);
    if (formData.nombre.trim()) onSave({ nombre: formData.nombre.trim() });
  };
  const footer = (
    <>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={onHide} />
      <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
    </>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "420px" }}
      header={categoria ? "Editar Categoría" : "Nueva Categoría"}
      modal
      className="p-fluid"
      footer={footer}
      onHide={onHide}
    >
      <div className="field">
        <label htmlFor="nombre">Nombre *</label>
        <InputText
          id="nombre"
          value={formData.nombre}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ nombre: e.target.value })
          }
          required
          autoFocus
          className={submitted && !formData.nombre.trim() ? "p-invalid" : ""}
        />
        {submitted && !formData.nombre.trim() && (
          <small className="p-error">Nombre es requerido.</small>
        )}
      </div>
    </Dialog>
  );
};

export default CategoriaForm;
