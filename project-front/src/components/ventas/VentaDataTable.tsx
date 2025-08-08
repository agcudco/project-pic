  //REALIZADO POR ELIAN COLLAGUAZO

import React from "react";
import type { Venta } from "../../types/venta";

interface Props {
  ventas: Venta[];
  onEdit: (venta: Venta) => void;
  onDelete: (fecha: string) => void;
  onViewDetails: (venta: Venta) => void; // <-- nuevo
    onFactura: (venta: Venta) => void; // <-- nuevo

}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "1rem",
  },
  empty: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
  },
  th: {
    padding: "10px 15px",
    textAlign: "left",
    backgroundColor: "#0077cc",
    color: "white",
  },
  td: {
    padding: "10px 15px",
    borderBottom: "1px solid #ddd",
  },
  rowHover: {
    cursor: "pointer",
  },
  button: {
    padding: "6px 12px",
    border: "none",
    cursor: "pointer",
    marginRight: "5px",
    fontWeight: "bold",
    borderRadius: "4px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "black",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
  },
};

const VentaDataTable: React.FC<Props> = ({ ventas, onEdit, onDelete,onViewDetails,onFactura }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Lista de Ventas</h2>
      {ventas.length === 0 ? (
        <p style={styles.empty}>No hay ventas registradas.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, index) => (
                <tr key={index} style={styles.rowHover}>
                  <td style={styles.td}>{venta.cliente_nombre}</td>
                  <td style={styles.td}>${Number(venta.total).toFixed(2)}</td>
                  <td style={styles.td}>{venta.estado}</td>
                  <td style={styles.td}>
                    {venta.fecha_hora
                      ? new Date(venta.fecha_hora).toLocaleString()
                      : "Sin fecha"}
                  </td>
                  <td style={styles.td}>
                  <button
                  style={{ ...styles.button, backgroundColor: "#17a2b8", color: "white" }}
                  onClick={() => onViewDetails(venta)}
                  >
                🔍 Detalles
                  </button>
                    <button
                      style={{ ...styles.button, ...styles.deleteButton }}
                      onClick={() => onDelete(venta.fecha_hora)}
                    >
                      ❌ Anular
                    </button>
                    <button
  style={{ ...styles.button, backgroundColor: "#28a745", color: "white" }}
  onClick={() => onFactura(venta)}
>
  🧾 Factura
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VentaDataTable;
