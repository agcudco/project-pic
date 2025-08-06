import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import type { Promocion, PromocionFormData } from '../../types/promocion.js';

interface PromocionFormProps {
    visible: boolean;
    promocion?: Promocion | null;
    onHide: () => void;
    onSave: (promocion: PromocionFormData) => void;
}

const PromocionForm: React.FC<PromocionFormProps> = ({
    visible,
    promocion,
    onHide,
    onSave
}) => {
    const [formData, setFormData] = useState<PromocionFormData>({
        nombre: '',
        tipo: 'producto',
        valor: 0,
        fecha_inicio: '',
        fecha_fin: '',
        activa: true
    });
    const [submitted, setSubmitted] = useState(false);

    const tiposPromocion = [
        { label: 'Producto', value: 'producto' },
        { label: 'Categoría', value: 'categoria' },
        { label: 'Monto Total', value: 'monto_total' },
        { label: 'Cantidad', value: 'cantidad' }
    ];

    useEffect(() => {
        if (promocion) {
            setFormData({
                nombre: promocion.nombre,
                tipo: promocion.tipo,
                valor: promocion.valor,
                condicion_json: promocion.condicion_json,
                fecha_inicio: promocion.fecha_inicio,
                fecha_fin: promocion.fecha_fin,
                activa: promocion.activa
            });
        } else {
            setFormData({
                nombre: '',
                tipo: 'producto',
                valor: 0,
                fecha_inicio: '',
                fecha_fin: '',
                activa: true
            });
        }
        setSubmitted(false);
    }, [promocion, visible]);

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
            header={promocion ? "Editar Promoción" : "Nueva Promoción"}
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
                    options={tiposPromocion}
                    onChange={(e: any) => setFormData({ ...formData, tipo: e.value })}
                    placeholder="Selecciona un tipo"
                />
            </div>

            <div className="field">
                <label htmlFor="valor">Valor *</label>
                <InputNumber
                    id="valor"
                    value={formData.valor}
                    onValueChange={(e: any) => setFormData({ ...formData, valor: e.value || 0 })}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    min={0}
                />
            </div>

            <div className="field">
                <label htmlFor="fecha_inicio">Fecha Inicio *</label>
                <Calendar
                    id="fecha_inicio"
                    value={formData.fecha_inicio ? new Date(formData.fecha_inicio) : null}
                    onChange={(e: any) => setFormData({ ...formData, fecha_inicio: e.value?.toISOString().split('T')[0] || '' })}
                    dateFormat="yy-mm-dd"
                    showIcon
                />
            </div>

            <div className="field">
                <label htmlFor="fecha_fin">Fecha Fin *</label>
                <Calendar
                    id="fecha_fin"
                    value={formData.fecha_fin ? new Date(formData.fecha_fin) : null}
                    onChange={(e: any) => setFormData({ ...formData, fecha_fin: e.value?.toISOString().split('T')[0] || '' })}
                    dateFormat="yy-mm-dd"
                    showIcon
                />
            </div>

            <div className="field-checkbox">
                <Checkbox
                    id="activa"
                    checked={formData.activa}
                    onChange={(e: any) => setFormData({ ...formData, activa: e.checked || false })}
                />
                <label htmlFor="activa" className="ml-2">Activa</label>
            </div>
        </Dialog>
    );
};

export default PromocionForm;
