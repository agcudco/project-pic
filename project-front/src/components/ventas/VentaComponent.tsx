import React, { useEffect, useState } from "react";
import VentaForm from "./VentaForm";
import VentaDataTable from "./VentaDataTable";
import type { Venta } from "../../types/venta";

import {
  getVentas,
  createVenta,
  deleteVenta,
  updateVenta,
  getVentaDetalles,
  getFacturaVenta
} from "../../services/servicesVenta";

const VentaComponent: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventaDetalles, setVentaDetalles] = useState<any[] | null>(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
  const [infoFactura, setInfoFactura] = useState<{
    numero_factura: string;
    fecha_emision: string;
    nombre_cliente: string;
    email_cliente: string;
    monto_total: number;
  } | null>(null);

  const loadVentas = async () => {
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
    }
  };

  useEffect(() => {
    loadVentas();
  }, []);

  const handleCreate = async (ventaData: {
    cliente_id: number;
    productos: number[];
    cantidades: number[];
  }) => {
    await createVenta(ventaData);
    loadVentas();
  };

  const handleEdit = async (venta: Venta) => {
    const nuevoEstado = prompt("Nuevo estado:", venta.estado);
    const nuevoTotal = prompt("Nuevo total:", venta.total.toString());
    if (!nuevoEstado || !nuevoTotal) return;

    await updateVenta((venta as any).id, {
      estado: nuevoEstado,
      total: parseFloat(nuevoTotal),
    });
    loadVentas();
  };

  const handleViewDetails = async (venta: Venta) => {
    const detalles = await getVentaDetalles((venta as any).id);
      

    setVentaSeleccionada(venta);
    setVentaDetalles(detalles);
    setInfoFactura(null); // limpiar info de factura
  };

  const handleDelete = async (fecha: string) => {
    if (confirm(`¿Seguro que deseas anular la venta con fecha ${fecha}?`)) {
      await deleteVenta((ventas.find(v => v.fecha_hora === fecha) as any).id);
      loadVentas();
    }
  };

 const handleVerFactura = async (venta: Venta) => {
  try {
    const data = (await getFacturaVenta((venta as any).id) as unknown) as {
      venta: any;
      detalles?: any[]; // <- opcional para que podamos validar
    };

    setVentaSeleccionada(data.venta);
    setVentaDetalles(data.detalles ?? []);

    if (Array.isArray(data.detalles) && data.detalles.length > 0) {
      const detalle = data.detalles[0];
      setInfoFactura({
        numero_factura: detalle.numero_factura,
        fecha_emision: detalle.fecha_emision,
        nombre_cliente: detalle.nombre_cliente,
        email_cliente: detalle.email_cliente,
        monto_total: detalle.monto_total
      });
    } else {
      console.warn("No hay detalles en la factura");
      setInfoFactura(null); // o un objeto vacío si prefieres
    }
  } catch (err) {
    console.error("Error al obtener factura:", err);
  }
};

  return (
    <div>
      <h1>Gestión de Ventas</h1>
      <VentaForm onSubmit={handleCreate} />
      <VentaDataTable
        ventas={ventas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onFactura={handleVerFactura}
      />

      {ventaDetalles && ventaSeleccionada && (
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
          {infoFactura ? (
            <>
              <h3 style={{ marginBottom: "1rem", color: "#333" }}>
                🧾 Factura N° {infoFactura.numero_factura}
              </h3>
              <p><b>Cliente:</b> {infoFactura.nombre_cliente}</p>
              <p><b>Email:</b> {infoFactura.email_cliente}</p>
              <p><b>Fecha emisión:</b> {new Date(infoFactura.fecha_emision).toLocaleDateString()}</p>
              <p><b>Monto total:</b> ${Number(infoFactura.monto_total).toFixed(2)}</p>
              <p><b>Estado:</b> {ventaSeleccionada.estado}</p>
            </>
          ) : (
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              📝 Detalles de Venta - Cliente: {ventaSeleccionada.cliente_nombre}
            </h3>
          )}

          <h4>📦 Productos</h4>
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
                <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>
                  Producto
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>
                  Cantidad
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>
                  Precio Unitario
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc", textAlign: "left" }}>
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {ventaDetalles.map((det, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {det.nombre_producto || det.producto || "N/D"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {det.cantidad}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ${Number(det.precio_unitario).toFixed(2)}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ${Number(det.subtotal_producto || det.subtotal || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <button
              onClick={() => {
                setVentaDetalles(null);
                setVentaSeleccionada(null);
                setInfoFactura(null);
              }}
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

export default VentaComponent;