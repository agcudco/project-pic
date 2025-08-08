import type { Producto } from "../../types/producto";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";

interface Props {
  visible: boolean;
  producto: Producto;
  onHide: () => void;
  onSave: (producto: Producto) => void;
}

export const ProductoForm: React.FC<Props> = ({
  visible,
  producto,
  onHide,
  onSave,
}) => {
  const [formData, setFormData] = useState<Producto>({ ...producto });

  useEffect(() => {
    setFormData({ ...producto });
  }, [producto]);

  const handleChange = (
    field: keyof Producto,
    value: string | number | boolean
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("imagen_url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (formData.precio_venta < formData.costo) {
      alert("❌ El precio de venta no puede ser menor al costo.");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog
      header={formData.id ? "Editar Producto" : "Nuevo Producto"}
      visible={visible}
      style={{ width: "500px" }}
      onHide={onHide}
      modal
      footer={
        <div>
          <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
        </div>
      }
    >
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="descripcion">Descripción</label>
          <InputText
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="precio_venta">Precio Venta</label>
          <InputNumber
            id="precio_venta"
            value={formData.precio_venta}
            onValueChange={(e) => handleChange("precio_venta", e.value ?? 0)}
            mode="currency"
            currency="USD"
            locale="es-EC"
            min={0}
          />
        </div>

        <div className="field">
          <label htmlFor="costo">Costo</label>
          <InputNumber
            id="costo"
            value={formData.costo}
            onValueChange={(e) => handleChange("costo", e.value ?? 0)}
            mode="currency"
            currency="USD"
            locale="es-EC"
            min={0}
          />
        </div>

        <div className="field">
          <label htmlFor="imagen">Imagen del producto</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {formData.imagen_url && (
            <img
              src={formData.imagen_url}
              alt="Vista previa"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
};
