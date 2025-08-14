import React from "react";
import { Routes, Route } from "react-router-dom";
import CategoriaPage from "./components/categoria/CategoriaPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoriaPage />} />
    </Routes>
  );
};

export default App;
