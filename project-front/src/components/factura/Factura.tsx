// Realizado por Elian Collaguazo
import React, { useEffect, useState } from "react";
import type { Factura } from "../../types/factura";

import {
  getFacturas,
  createFactura,
  deleteFactura,
  updateFactura,
  getFacturaDetalles,
} from "../../services/servicesFactura";

const FacturaComponent: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);
  const [facturaDetalles, setFacturaDetalles] = useState<any[] | null>(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);

  const loadFacturas = async () => {
    try {
      const data = await getFacturas();
      setFacturas(data);
    } catch (err) {
      console.error("Error al cargar facturas:", err);
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const handleCreate = async (facturaData: {
    venta_id: number;
    tipo: string;
    numero: string;
    fecha_emision: string;
    monto_total: number;
  }) => {
    await createFactura(facturaData);
    loadFacturas();
  };

  const handleEdit = async (factura: Factura) => {
    const nuevoTipo = prompt("Nuevo tipo:", factura.tipo);
    const nuevoNumero = prompt("Nuevo número:", factura.numero);
    const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD):", factura.fecha_emision);
    const nuevoMonto = prompt("Nuevo monto total:", factura.monto_total.toString());
    if (!nuevoTipo || !nuevoNumero || !nuevaFecha || !nuevoMonto) return;

    await updateFactura(factura.id, {
      tipo: nuevoTipo,
      numero: nuevoNumero,
      fecha_emision: nuevaFecha,
      monto_total: parseFloat(nuevoMonto),
    });
    loadFacturas();
  };

  const handleViewDetails = async (factura: Factura) => {
    const detalles = await getFacturaDetalles(factura.id);
    setFacturaSeleccionada(factura);
    setFacturaDetalles(detalles);
  };

  const handleDelete = async (numero: string) => {
    if (confirm(`¿Seguro que deseas eliminar la factura N° ${numero}?`)) {
      await deleteFactura((facturas.find(f => f.numero === numero) as any).id);
      loadFacturas();
    }
  };

  return (
    <div>
      <h1>Gestión de Facturas</h1>
      {/* Aquí podrías poner un formulario FacturaForm si lo tienes */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#0077cc", color: "#fff" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Venta ID</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tipo</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Número</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Fecha</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Monto</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{factura.id}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{factura.venta_id}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{factura.tipo}</td>
              <td style={{ padding: "10px", border: "1px solid rgba(221, 221, 221, 1)" }}>{factura.numero}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{factura.fecha_emision}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>${factura.monto_total}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <button onClick={() => handleDelete(factura.numero)}>🗑️ Eliminar</button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {facturaDetalles && facturaSeleccionada && (
        <div
          style={{
            padding: "1.5rem",
            background: "#f1f3f5",
            marginTop: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>
            🧾 Detalles de Factura N°: {facturaSeleccionada.numero}
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#0077cc", color: "#fff" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Concepto</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {facturaDetalles.map((det, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {det.concepto || "N/D"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ${Number(det.monto || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <button
              onClick={() => setFacturaDetalles(null)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ❌ Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturaComponent;
