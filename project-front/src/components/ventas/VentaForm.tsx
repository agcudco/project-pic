
  //REALIZADO POR KAREN YANEZ

import React, { useState } from "react";

interface Props {
  onSubmit: (data: {
    cliente_id: number;
    productos: number[];
    cantidades: number[];
  }) => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: "400px",
    margin: "1rem auto",
    padding: "1.5rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    color: "#333",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.6rem",
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  buttonHover: {
    backgroundColor: "#005fa3",
  },
};

const VentaForm: React.FC<Props> = ({ onSubmit }) => {
  const [cliente_id, setClienteId] = useState<number>(0);
  const [productos, setProductos] = useState<string>("");
  const [cantidades, setCantidades] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productosArray = productos.split(",").map(Number);
    const cantidadesArray = cantidades.split(",").map(Number);

    onSubmit({
      cliente_id,
      productos: productosArray,
      cantidades: cantidadesArray,
    });

    setClienteId(0);
    setProductos("");
    setCantidades("");
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2 style={styles.title}>Nueva Venta</h2>

      <label style={styles.label}>ID Cliente</label>
      <input
        style={styles.input}
        type="number"
        placeholder="Ej: 1"
        value={cliente_id}
        onChange={(e) => setClienteId(Number(e.target.value))}
        required
      />

      <label style={styles.label}>IDs de productos</label>
      <input
        style={styles.input}
        type="text"
        placeholder="Ej: 1,2,3"
        value={productos}
        onChange={(e) => setProductos(e.target.value)}
        required
      />

      <label style={styles.label}>Cantidades</label>
      <input
        style={styles.input}
        type="text"
        placeholder="Ej: 2,1,5"
        value={cantidades}
        onChange={(e) => setCantidades(e.target.value)}
        required
      />

      <button
        style={styles.button}
        onMouseOver={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = "#005fa3")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = "#0077cc")
        }
        type="submit"
      >
        Guardar
      </button>
    </form>
  );
};

export default VentaForm;
