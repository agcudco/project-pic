import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import VentaTestPage from './components/VentaTestPage';
import CategoriaDescuentoPage from './components/CategoriaDescuentoPage';
import ProductoDescuentoPage from './components/ProductoDescuentoPage';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/ventas-descuento" element={<VentaTestPage />} />
        <Route path="/categorias-descuento" element={<CategoriaDescuentoPage />} />
        <Route path="/productos-descuento" element={<ProductoDescuentoPage />} />
        <Route path="*" element={<Navigate to="/ventas-descuento" replace />} />
      </Routes>
    </>
  );
};

export default App;
