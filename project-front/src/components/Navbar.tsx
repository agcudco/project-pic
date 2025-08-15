import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  return (
    <nav style={{
      background: '#2c3e50',
      padding: '16px 0',
      marginBottom: 32,
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32
      }}>
        <Link
          to="/ventas-descuento"
          style={{
            color: location.pathname === '/ventas-descuento' ? '#27ae60' : '#fff',
            fontWeight: 600,
            fontSize: 18,
            textDecoration: 'none',
            padding: '8px 20px',
            borderRadius: 8,
            background: location.pathname === '/ventas-descuento' ? '#eafaf1' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          Descuentos en Ventas
        </Link>
        <Link
          to="/categorias-descuento"
          style={{
            color: location.pathname === '/categorias-descuento' ? '#27ae60' : '#fff',
            fontWeight: 600,
            fontSize: 18,
            textDecoration: 'none',
            padding: '8px 20px',
            borderRadius: 8,
            background: location.pathname === '/categorias-descuento' ? '#eafaf1' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          Descuentos en Categorías
        </Link>
        <Link
          to="/productos-descuento"
          style={{
            color: location.pathname === '/productos-descuento' ? '#27ae60' : '#fff',
            fontWeight: 600,
            fontSize: 18,
            textDecoration: 'none',
            padding: '8px 20px',
            borderRadius: 8,
            background: location.pathname === '/productos-descuento' ? '#eafaf1' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          Descuentos en Productos
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
