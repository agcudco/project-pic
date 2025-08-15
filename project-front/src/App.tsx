// REALIZADO POR JAMES MENA

import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import VentaComponent from './components/ventas/VentaComponent';
import Factura from "./components/factura/Factura";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* Componente de ventas */}
      <VentaComponent />

      {/* Componente de factura */}
      <Factura />
    </>
  );
}

export default App;
