import React from 'react'
import './App.css'


import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { UsuarioComponent } from './components/usuarios/UsuarioComponent'

//estilo
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/usuarios" element={<UsuarioComponent />} />
      </Routes>
    </Router>
  )
}



export default App;