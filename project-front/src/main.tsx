import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'primereact/resources/themes/saga-blue/theme.css';  // tema PrimeReact, ajusta si usas otro
import 'primereact/resources/primereact.min.css';           // estilos PrimeReact
import 'primeicons/primeicons.css';                         // iconos PrimeReact
import './index.css';                                        // tus estilos globales

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
