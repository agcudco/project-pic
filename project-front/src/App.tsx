import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductoComponent } from "./components/producto/ProductoComponent";
import './App.css'

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductoComponent />} />
        <Route path="/producto" element={<ProductoComponent />} />
        <Route path="/contact" element={<div>en construcción (contact)</div>} />
      </Routes>
    </Router>
  );
};

export default App
