import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

type Producto = { id: number; nombre: string };
type Promocion = { id: number; nombre: string; tipo?: string };
type ProductoConDescuento = { productoId: number; promocionId: number };

const ProductoDescuentoPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [editandoPromocion, setEditandoPromocion] = useState<number | null>(null);
  const [nombreEditPromocion, setNombreEditPromocion] = useState('');
  const [showCrearProducto, setShowCrearProducto] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [editandoProducto, setEditandoProducto] = useState<number | null>(null);
  const [nombreEditProducto, setNombreEditProducto] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [productosConDescuento, setProductosConDescuento] = useState<ProductoConDescuento[]>([]);

  // DEBUG: mostrar productos con descuento
  useEffect(() => {
    console.log('productosConDescuento', productosConDescuento);
  }, [productosConDescuento]);

  const cargarDatos = () => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(() => { setProductos([]); setError('Error cargando productos'); });

    fetch('/api/promociones')
      .then(res => res.json())
      .then(data => {
        const promos = Array.isArray(data) ? data.filter((p: any) => p.tipo === 'producto') : [];
        setPromociones(promos);
      })
      .catch(() => { setPromociones([]); setError('Error cargando promociones'); });

    fetch('/api/productos-con-descuento')
      .then(res => res.json())
      .then(data => setProductosConDescuento(Array.isArray(data) ? data : []))
      .catch(() => { setProductosConDescuento([]); setError('Error cargando productos con descuento'); });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const aplicarDescuento = () => {
    if (!productoSeleccionado || !promocionSeleccionada) return;
    fetch('/api/promociones/aplicar-descuento-producto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId: productoSeleccionado, promocionId: promocionSeleccionada })
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message);
        cargarDatos();
      });
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: 32,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}
    >
      {error && (
        <div style={{ background: '#fdecea', color: '#e74c3c', padding: 16, borderRadius: 8, marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: 24 }}>
        Aplicar descuento/promoción a producto
      </h2>

      {/* Selector de producto */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Selecciona un producto:
          </label>
          <select
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
            onChange={e => setProductoSeleccionado(e.target.value === '' ? null : Number(e.target.value))}
            value={productoSeleccionado ?? ''}
          >
            <option value=''>-- Selecciona --</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>

          <button
            style={{
              background: '#27ae60',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 8
            }}
            onClick={() => setShowCrearProducto(true)}
          >
            Crear
          </button>

          {productoSeleccionado !== null && (
            <button
              style={{
                background: '#2980b9',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 14px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 8
              }}
              onClick={() => {
                setEditandoProducto(productoSeleccionado);
                setNombreEditProducto(productos.find(p => p.id === productoSeleccionado)?.nombre || '');
              }}
            >
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Tabla de productos */}
      <div style={{ marginBottom: 24 }}>
        <table style={{ width: '100%', background: '#f9f9f9', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#f1f3f6', color: '#34495e' }}>
              <th style={{ padding: 8 }}>Producto</th>
              <th style={{ padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ padding: 12, color: '#888' }}>
                  No hay productos.
                </td>
              </tr>
            ) : (
              productos.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#f6f8fa' }}>
                  <td style={{ padding: 8 }}>{p.nombre}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      style={{
                        marginRight: 8,
                        background: '#f1c40f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title='Editar'
                      onClick={() => {
                        setEditandoProducto(p.id);
                        setNombreEditProducto(p.nombre);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      style={{
                        background: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title='Eliminar'
                      onClick={async () => {
                        if (window.confirm('¿Eliminar producto?')) {
                          await fetch(`/api/productos/${p.id}`, { method: 'DELETE' });
                          cargarDatos();
                          if (productoSeleccionado === p.id) setProductoSeleccionado(null);
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales crear/editar producto */}
      {showCrearProducto && (
        <div style={{ background: '#fff', border: '2px solid #27ae60', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px #27ae6022', maxWidth: 400 }}>
          <h4 style={{ margin: '0 0 12px' }}>Crear nuevo producto</h4>
          <input
            type='text'
            placeholder='Nombre del producto'
            value={nuevoProducto}
            onChange={e => setNuevoProducto(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
              onClick={async () => {
                if (nuevoProducto.trim().length < 2) return;
                await fetch('/api/productos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nuevoProducto }) });
                setNuevoProducto('');
                setShowCrearProducto(false);
                cargarDatos();
              }}
            >
              Crear
            </button>
            <button
              style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setShowCrearProducto(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {editandoProducto !== null && (
        <div style={{ background: '#fff', border: '2px solid #2980b9', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px #2980b922', maxWidth: 400 }}>
          <h4 style={{ margin: '0 0 12px' }}>Editar producto</h4>
          <input
            type='text'
            value={nombreEditProducto}
            onChange={e => setNombreEditProducto(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
              onClick={async () => {
                if (nombreEditProducto.trim().length < 2) return;
                await fetch(`/api/productos/${editandoProducto}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nombreEditProducto }) });
                setEditandoProducto(null);
                setNombreEditProducto('');
                cargarDatos();
              }}
            >
              Guardar
            </button>
            <button
              style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setEditandoProducto(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Selector y edición de promoción */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Selecciona una promoción:</label>
          <select
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
            onChange={e => setPromocionSeleccionada(e.target.value === '' ? null : Number(e.target.value))}
            value={promocionSeleccionada ?? ''}
          >
            <option value=''>-- Selecciona --</option>
            {promociones.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <button
          style={{
            background: '#2980b9',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 14px',
            fontWeight: 600,
            cursor: promocionSeleccionada ? 'pointer' : 'not-allowed',
            opacity: promocionSeleccionada ? 1 : 0.5,
            marginBottom: 8
          }}
          disabled={!promocionSeleccionada}
          onClick={() => {
            if (!promocionSeleccionada) return;
            setEditandoPromocion(promocionSeleccionada);
            setNombreEditPromocion(promociones.find(p => p.id === promocionSeleccionada)?.nombre || '');
          }}
        >
          Editar
        </button>
      </div>

      {editandoPromocion !== null && (
        <div style={{ background: '#fff', border: '2px solid #2980b9', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px #2980b922', maxWidth: 400 }}>
          <h4 style={{ margin: '0 0 12px' }}>Editar promoción</h4>
          <input
            type='text'
            value={nombreEditPromocion}
            onChange={e => setNombreEditPromocion(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
              onClick={async () => {
                if (nombreEditPromocion.trim().length < 2) return;
                await fetch(`/api/promociones/${editandoPromocion}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nombreEditPromocion }) });
                setEditandoPromocion(null);
                setNombreEditPromocion('');
                cargarDatos();
              }}
            >
              Guardar
            </button>
            <button
              style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setEditandoPromocion(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <Button
        label='Aplicar descuento/promoción'
        onClick={aplicarDescuento}
        style={{ width: '100%', background: '#2c3e50', border: 'none', borderRadius: 6, fontWeight: 600, marginBottom: 24 }}
      />

      {mensaje && (
        <div style={{ marginTop: 0, background: '#eafaf1', color: '#27ae60', padding: 12, borderRadius: 8, textAlign: 'center', fontWeight: 500, marginBottom: 24 }}>
          {mensaje}
        </div>
      )}

      {/* Productos con descuento */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: '#2c3e50', marginBottom: 16 }}>Productos con descuento aplicado</h3>
        <table style={{ width: '100%', background: '#f9f9f9', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#f1f3f6', color: '#34495e' }}>
              <th style={{ padding: 8 }}>Producto</th>
              <th style={{ padding: 8 }}>Promoción</th>
              <th style={{ padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosConDescuento.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 12, color: '#888', textAlign: 'center' }}>
                  No hay productos con descuento aplicado.
                </td>
              </tr>
            ) : (
              productosConDescuento.map((pd, i) => {
                try {
                  const productoId = (pd as any).productoId ?? (pd as any).producto_id;
                  const promocionId = (pd as any).promocionId ?? (pd as any).promocion_id;
                  const productoNombre = productos.find(p => p.id === productoId)?.nombre || 'N/A';
                  const promocionNombre = promociones.find(p => p.id === promocionId)?.nombre || 'N/A';
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f6f8fa' }}>
                      <td style={{ padding: 8 }}>{productoNombre}</td>
                      <td style={{ padding: 8 }}>{promocionNombre}</td>
                      <td style={{ padding: 8 }}>
                        {/* Acciones futuras */}
                      </td>
                    </tr>
                  );
                } catch {
                  return (
                    <tr key={i} style={{ background: '#fdecea', color: '#e74c3c' }}>
                      <td colSpan={3}>Error mostrando producto con descuento</td>
                    </tr>
                  );
                }
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductoDescuentoPage;
