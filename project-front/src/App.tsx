import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AccionComponent } from "./components/usuarios/acciones/AccionComponent"; // Asegúrate de que esta ruta sea correcta


export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<div>En construcción</div>} />
        <Route path='/accion' element={<AccionComponent />} />
        <Route path='/contact' element={<div>En construcción (contact)</div>} />
      </Routes>
    </Router>
  );
};

export default App;
