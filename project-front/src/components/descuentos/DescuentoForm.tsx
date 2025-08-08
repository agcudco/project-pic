import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import type { Descuento, DescuentoFormData } from '../../types/descuento.js';

interface DescuentoFormProps {
    visible: boolean;
    descuento?: Descuento | null;
    onHide: () => void;
    onSave: (descuento: DescuentoFormData) => void;
}

const DescuentoForm: React.FC<DescuentoFormProps> = ({
    visible,
    descuento,
    onHide,
    onSave
}) => {
    const [formData, setFormData] = useState<DescuentoFormData>({
        nombre: '',
        porcentaje: 0,
        tipo: 'porcentaje',
        activo: true
    });
    const [submitted, setSubmitted] = useState(false);

    const tiposDescuento = [
        { label: 'Porcentaje', value: 'porcentaje' },
        { label: 'Monto Fijo', value: 'fijo' }
    ];

    useEffect(() => {
        if (descuento) {
            setFormData({
                nombre: descuento.nombre,
                porcentaje: descuento.porcentaje,
                tipo: descuento.tipo,
                activo: descuento.activo
            });
        } else {
            setFormData({
                nombre: '',
                porcentaje: 0,
                tipo: 'porcentaje',
                activo: true
            });
        }
        setSubmitted(false);
    }, [descuento, visible]);

    const handleSave = () => {
        setSubmitted(true);
        if (formData.nombre.trim()) {
            onSave(formData);
        }
    };

    const handleHide = () => {
        setSubmitted(false);
        onHide();
    };

    const footer = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={handleHide} />
            <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header={descuento ? "Editar Descuento" : "Nuevo Descuento"}
            modal
            className="p-fluid"
            footer={footer}
            onHide={handleHide}
        >
            <div className="field">
                <label htmlFor="nombre">Nombre *</label>
                <InputText
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e: any) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    autoFocus
                    className={submitted && !formData.nombre ? 'p-invalid' : ''}
                />
                {submitted && !formData.nombre && <small className="p-error">Nombre es requerido.</small>}
            </div>

            <div className="field">
                <label htmlFor="tipo">Tipo *</label>
                <Dropdown
                    id="tipo"
                    value={formData.tipo}
                    options={tiposDescuento}
                    onChange={(e: any) => setFormData({ ...formData, tipo: e.value })}
                    placeholder="Selecciona un tipo"
                />
            </div>

            <div className="field">
                <label htmlFor="porcentaje">
                    {formData.tipo === 'porcentaje' ? 'Porcentaje (%)' : 'Monto Fijo ($)'} *
                </label>
                <InputNumber
                    id="porcentaje"
                    value={formData.porcentaje}
                    onValueChange={(e: any) => setFormData({ ...formData, porcentaje: e.value || 0 })}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    min={0}
                    max={formData.tipo === 'porcentaje' ? 100 : undefined}
                />
            </div>
        </Dialog>
    );
};

export default DescuentoForm;
