

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';



// Editar promoción
// (debe ir después del import)

// Página para aplicar y ver descuentos por categoría
const CategoriaDescuentoPage: React.FC = () => {
  // Estados para edición de promoción (deben ir aquí)
  const [editandoPromocion, setEditandoPromocion] = useState<number|null>(null);
  const [nombreEditPromocion, setNombreEditPromocion] = useState('');
  const [categorias, setCategorias] = useState<Array<{id: number, nombre: string}>>([]);
  // Crear/editar categoría
  const [showCrearCategoria, setShowCrearCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editandoCategoria, setEditandoCategoria] = useState<number|null>(null);
  const [nombreEditCategoria, setNombreEditCategoria] = useState('');
  const [promociones, setPromociones] = useState<Array<{id: number, nombre: string}>>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [categoriasConDescuento, setCategoriasConDescuento] = useState<any[]>([]);

  // Cargar categorías, promociones y categorías con descuento
  const cargarDatos = () => {
    fetch('/api/categoria')
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => setCategorias([]));
    fetch('/api/promociones')
      .then(res => res.json())
      .then(data => setPromociones(data))
      .catch(() => setPromociones([]));
    fetch('/api/categorias-con-descuento')
      .then(res => res.json())
      .then(data => setCategoriasConDescuento(Array.isArray(data) ? data : []))
      .catch(() => setCategoriasConDescuento([]));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const aplicarDescuento = () => {
    if (!categoriaSeleccionada || !promocionSeleccionada) return;
    fetch('/api/promociones/aplicar-descuento-categoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoriaId: categoriaSeleccionada, promocionId: promocionSeleccionada })
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message);
        cargarDatos();
      });
  };

  return (
  <div style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: 32,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <h2 style={{textAlign: 'center', color: '#2c3e50', marginBottom: 24}}>Aplicar descuento/promoción a categoría</h2>
      <div style={{marginBottom: 20, display: 'flex', alignItems: 'flex-end', gap: 12}}>
        <div style={{flex: 1}}>
          <label style={{display: 'block', marginBottom: 8, fontWeight: 500}}>Selecciona una categoría:</label>
          <select
            style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8}}
            onChange={e => setCategoriaSeleccionada(Number(e.target.value))}
            value={categoriaSeleccionada ?? ''}
          >
            <option value=''>-- Selecciona --</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <button
          style={{background:'#27ae60', color:'#fff', border:'none', borderRadius:6, padding:'8px 14px', fontWeight:600, cursor:'pointer', marginBottom:8}}
          onClick={()=>setShowCrearCategoria(true)}
        >Crear</button>
        <button
          style={{background:'#2980b9', color:'#fff', border:'none', borderRadius:6, padding:'8px 14px', fontWeight:600, cursor: categoriaSeleccionada ? 'pointer' : 'not-allowed', opacity: categoriaSeleccionada ? 1 : 0.5, marginBottom:8}}
          disabled={!categoriaSeleccionada}
          onClick={()=>{
            if(!categoriaSeleccionada) return;
            setEditandoCategoria(categoriaSeleccionada);
            setNombreEditCategoria(categorias.find(c=>c.id===categoriaSeleccionada)?.nombre||'');
          }}
        >Editar</button>
      </div>
      {/* Tabla de detalles de categorías */}
      <div style={{marginBottom: 24}}>
        <table style={{width:'100%',background:'#f9f9f9',borderRadius:8}}>
          <thead>
            <tr style={{background:'#f1f3f6',color:'#34495e'}}>
              <th style={{padding:8}}>Categoría</th>
              <th style={{padding:8}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr><td colSpan={2} style={{padding:12,color:'#888'}}>No hay categorías.</td></tr>
            ) : (
              categorias.map((c,i)=>(
                <tr key={c.id} style={{background:i%2===0?'#fff':'#f6f8fa'}}>
                  <td style={{padding:8}}>{c.nombre}</td>
                  <td style={{padding:8}}>
                    <button style={{marginRight:8,background:'#f1c40f',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}} title="Editar" onClick={()=>{
                      setEditandoCategoria(c.id);
                      setNombreEditCategoria(c.nombre);
                    }}>Editar</button>
                    <button style={{background:'#e74c3c',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}} title="Eliminar" onClick={async()=>{
                      if(window.confirm('¿Eliminar categoría?')){
                        await fetch(`/api/categorias/${c.id}`,{method:'DELETE'});
                        cargarDatos();
                        if(categoriaSeleccionada===c.id) setCategoriaSeleccionada(null);
                      }
                    }}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal/inline para crear categoría */}
      {showCrearCategoria && (
        <div style={{background:'#fff', border:'2px solid #27ae60', borderRadius:10, padding:20, marginBottom:16, boxShadow:'0 2px 12px #27ae6022', maxWidth:400}}>
          <h4 style={{margin:'0 0 12px'}}>Crear nueva categoría</h4>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={nuevaCategoria}
            onChange={e=>setNuevaCategoria(e.target.value)}
            style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginBottom:8}}
          />
          <div style={{display:'flex',gap:8}}>
            <button
              style={{background:'#27ae60',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}}
              onClick={async()=>{
                if(nuevaCategoria.trim().length<2)return;
                await fetch('/api/categorias',{
                  method:'POST',headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({nombre:nuevaCategoria})
                });
                setNuevaCategoria('');setShowCrearCategoria(false);cargarDatos();
              }}
            >Crear</button>
            <button style={{background:'#eee',color:'#333',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}} onClick={()=>setShowCrearCategoria(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal/inline para editar categoría */}
      {editandoCategoria && (
        <div style={{background:'#fff', border:'2px solid #2980b9', borderRadius:10, padding:20, marginBottom:16, boxShadow:'0 2px 12px #2980b922', maxWidth:400}}>
          <h4 style={{margin:'0 0 12px'}}>Editar categoría</h4>
          <input
            type="text"
            value={nombreEditCategoria}
            onChange={e=>setNombreEditCategoria(e.target.value)}
            style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginBottom:8}}
          />
          <div style={{display:'flex',gap:8}}>
            <button
              style={{background:'#2980b9',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}}
              onClick={async()=>{
                if(nombreEditCategoria.trim().length<2)return;
                await fetch(`/api/categorias/${editandoCategoria}`,{
                  method:'PUT',headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({nombre:nombreEditCategoria})
                });
                setEditandoCategoria(null);setNombreEditCategoria('');cargarDatos();
              }}
            >Guardar</button>
            <button style={{background:'#eee',color:'#333',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}} onClick={()=>setEditandoCategoria(null)}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{marginBottom: 20, display: 'flex', alignItems: 'flex-end', gap: 12}}>
        <div style={{flex: 1}}>
          <label style={{display: 'block', marginBottom: 8, fontWeight: 500}}>Selecciona una promoción:</label>
          <select
            style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8}}
            onChange={e => {
              const value = e.target.value;
              setPromocionSeleccionada(value === '' ? null : Number(value));
            }}
            value={promocionSeleccionada ?? ''}
          >
            <option value=''>-- Selecciona --</option>
            {promociones.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <button
          style={{background:'#2980b9', color:'#fff', border:'none', borderRadius:6, padding:'8px 14px', fontWeight:600, cursor: promocionSeleccionada ? 'pointer' : 'not-allowed', opacity: promocionSeleccionada ? 1 : 0.5, marginBottom:8}}
          disabled={!promocionSeleccionada}
          onClick={()=>{
            if(!promocionSeleccionada) return;
            setEditandoPromocion(promocionSeleccionada);
            setNombreEditPromocion(promociones.find(p=>p.id===promocionSeleccionada)?.nombre||'');
          }}
        >Editar</button>
      </div>

      {/* Modal/inline para editar promoción */}
      {editandoPromocion && (
        <div style={{background:'#fff', border:'2px solid #2980b9', borderRadius:10, padding:20, marginBottom:16, boxShadow:'0 2px 12px #2980b922', maxWidth:400}}>
          <h4 style={{margin:'0 0 12px'}}>Editar promoción</h4>
          <input
            type="text"
            value={nombreEditPromocion}
            onChange={e=>setNombreEditPromocion(e.target.value)}
            style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginBottom:8}}
          />
          <div style={{display:'flex',gap:8}}>
            <button
              style={{background:'#2980b9',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}}
              onClick={async()=>{
                if(nombreEditPromocion.trim().length<2)return;
                await fetch(`/api/promociones/${editandoPromocion}`,{
                  method:'PUT',headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({nombre:nombreEditPromocion})
                });
                setEditandoPromocion(null);setNombreEditPromocion('');cargarDatos();
              }}
            >Guardar</button>
            <button style={{background:'#eee',color:'#333',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}} onClick={()=>setEditandoPromocion(null)}>Cancelar</button>
          </div>
        </div>
      )}
      <Button
        label="Aplicar descuento/promoción"
        onClick={aplicarDescuento}
        style={{width: '100%', background: '#2c3e50', border: 'none', borderRadius: 6, fontWeight: 600, marginBottom: 24}}
      />
      {mensaje && (
        <div style={{
          marginTop: 0,
          background: '#eafaf1',
          color: '#27ae60',
          padding: 12,
          borderRadius: 8,
          textAlign: 'center',
          fontWeight: 500,
          marginBottom: 24
        }}>{mensaje}</div>
      )}

      {/* Tabla de categorías con descuento aplicado */}
      <h3 style={{margin: '32px 0 16px', color: '#2c3e50'}}>Categorías con descuento aplicado</h3>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', background: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'}}>
          <thead>
            <tr style={{background: '#f1f3f6', color: '#34495e'}}>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Categoría</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Promoción</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Descuento (%)</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Vigencia</th>
            </tr>
          </thead>
          <tbody>
            {categoriasConDescuento.length === 0 ? (
              <tr><td colSpan={6} style={{padding: 16, color: '#888'}}>No hay categorías con descuento aplicado.</td></tr>
            ) : (
              categoriasConDescuento.map((c, i) => (
                <tr key={c.categoria_id + '-' + c.promocion_id} style={{background: i % 2 === 0 ? '#fff' : '#f6f8fa'}}>
                  <td style={{padding: 10, fontWeight: 500}}>{c.categoria_nombre}</td>
                  <td style={{padding: 10}}>{c.promocion_nombre}</td>
                  <td style={{padding: 10, color: '#e67e22', fontWeight: 600}}>{Number(c.valor).toFixed(2)}%</td>
                  <td style={{padding: 10}}>{c.fecha_inicio} - {c.fecha_fin}</td>
                  <td style={{padding: 10}}>
                    <button style={{marginRight:8,background:'#f1c40f',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}} title="Editar" onClick={()=>{/* TODO: lógica editar */}}>Editar</button>
                    <button style={{background:'#e74c3c',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}} title="Eliminar" onClick={()=>{/* TODO: lógica eliminar */}}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriaDescuentoPage;
