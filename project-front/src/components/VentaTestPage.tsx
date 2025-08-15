import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

// Componente de prueba para listar ventas y aplicar descuento/promoción

const VentaTestPage: React.FC = () => {
  const [ventas, setVentas] = useState<Array<{id: number, nombre: string}>>([]);
  // Crear/editar venta
  const [showCrearVenta, setShowCrearVenta] = useState(false);
  const [nuevaVenta, setNuevaVenta] = useState('');
  const [editandoVenta, setEditandoVenta] = useState<number|null>(null);
  const [nombreEditVenta, setNombreEditVenta] = useState('');
  const [promociones, setPromociones] = useState<Array<{id: number, nombre: string}>>([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<number | null>(null);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [ventasConDescuento, setVentasConDescuento] = useState<any[]>([]);

  // Cargar ventas, promociones y ventas con descuento
  const cargarDatos = () => {
    fetch('/api/venta')
      .then(res => res.json())
      .then(data => setVentas(Array.isArray(data) ? data : []))
      .catch(() => setVentas([]));
    fetch('/api/promociones')
      .then(res => res.json())
      .then(data => setPromociones(data))
      .catch(() => setPromociones([]));
    fetch('/api/ventas-con-descuento')
      .then(res => res.json())
      .then(data => setVentasConDescuento(Array.isArray(data) ? data : []))
      .catch(() => setVentasConDescuento([]));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const aplicarDescuento = () => {
    if (!ventaSeleccionada || !promocionSeleccionada) return;
    fetch('/api/promociones/aplicar-descuento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ventaId: ventaSeleccionada, promocionId: promocionSeleccionada })
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message);
        cargarDatos(); // Refresca la tabla
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
      <h2 style={{textAlign: 'center', color: '#2c3e50', marginBottom: 24}}>Aplicar descuento/promoción a venta</h2>
      <div style={{marginBottom: 20, display: 'flex', alignItems: 'flex-end', gap: 12}}>
        <div style={{flex: 1}}>
          <label style={{display: 'block', marginBottom: 8, fontWeight: 500}}>Selecciona una venta:</label>
          <select
            style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8}}
            onChange={e => setVentaSeleccionada(Number(e.target.value))}
            value={ventaSeleccionada ?? ''}
          >
            <option value=''>-- Selecciona --</option>
            {ventas.map(v => (
              <option key={v.id} value={v.id}>{v.nombre ? v.nombre : `Venta #${v.id}`}</option>
            ))}
          </select>
        </div>
        <button
          style={{background:'#27ae60', color:'#fff', border:'none', borderRadius:6, padding:'8px 14px', fontWeight:600, cursor:'pointer', marginBottom:8}}
          onClick={()=>setShowCrearVenta(true)}
        >Crear</button>
        <button
          style={{background:'#2980b9', color:'#fff', border:'none', borderRadius:6, padding:'8px 14px', fontWeight:600, cursor: ventaSeleccionada ? 'pointer' : 'not-allowed', opacity: ventaSeleccionada ? 1 : 0.5, marginBottom:8}}
          disabled={!ventaSeleccionada}
          onClick={()=>{
            if(!ventaSeleccionada) return;
            setEditandoVenta(ventaSeleccionada);
            setNombreEditVenta(ventas.find(v=>v.id===ventaSeleccionada)?.nombre||'');
          }}
        >Editar</button>
      </div>
      {/* Tabla de detalles de ventas */}
      <div style={{marginBottom: 24}}>
        <table style={{width:'100%',background:'#f9f9f9',borderRadius:8}}>
          <thead>
            <tr style={{background:'#f1f3f6',color:'#34495e'}}>
              <th style={{padding:8}}>Venta</th>
              <th style={{padding:8}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr><td colSpan={2} style={{padding:12,color:'#888'}}>No hay ventas.</td></tr>
            ) : (
              ventas.map((v,i)=>(
                <tr key={v.id} style={{background:i%2===0?'#fff':'#f6f8fa'}}>
                  <td style={{padding:8}}>{v.nombre ? v.nombre : `Venta #${v.id}`}</td>
                  <td style={{padding:8}}>
                    <button style={{marginRight:8,background:'#f1c40f',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}} title="Editar" onClick={()=>{
                      setEditandoVenta(v.id);
                      setNombreEditVenta(v.nombre);
                    }}>Editar</button>
                    <button style={{background:'#e74c3c',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}} title="Eliminar" onClick={async()=>{
                      if(window.confirm('¿Eliminar venta?')){
                        await fetch(`/api/ventas/${v.id}`,{method:'DELETE'});
                        cargarDatos();
                        if(ventaSeleccionada===v.id) setVentaSeleccionada(null);
                      }
                    }}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal/inline para crear venta */}
      {showCrearVenta && (
        <div style={{background:'#fff', border:'2px solid #27ae60', borderRadius:10, padding:20, marginBottom:16, boxShadow:'0 2px 12px #27ae6022', maxWidth:400}}>
          <h4 style={{margin:'0 0 12px'}}>Crear nueva venta</h4>
          <input
            type="text"
            placeholder="Nombre de la venta"
            value={nuevaVenta}
            onChange={e=>setNuevaVenta(e.target.value)}
            style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginBottom:8}}
          />
          <div style={{display:'flex',gap:8}}>
            <button
              style={{background:'#27ae60',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}}
              onClick={async()=>{
                if(nuevaVenta.trim().length<2)return;
                await fetch('/api/ventas',{
                  method:'POST',headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({nombre:nuevaVenta})
                });
                setNuevaVenta('');setShowCrearVenta(false);cargarDatos();
              }}
            >Crear</button>
            <button style={{background:'#eee',color:'#333',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}} onClick={()=>setShowCrearVenta(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal/inline para editar venta */}
      {editandoVenta && (
        <div style={{background:'#fff', border:'2px solid #2980b9', borderRadius:10, padding:20, marginBottom:16, boxShadow:'0 2px 12px #2980b922', maxWidth:400}}>
          <h4 style={{margin:'0 0 12px'}}>Editar venta</h4>
          <input
            type="text"
            value={nombreEditVenta}
            onChange={e=>setNombreEditVenta(e.target.value)}
            style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginBottom:8}}
          />
          <div style={{display:'flex',gap:8}}>
            <button
              style={{background:'#2980b9',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}}
              onClick={async()=>{
                if(nombreEditVenta.trim().length<2)return;
                await fetch(`/api/ventas/${editandoVenta}`,{
                  method:'PUT',headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({nombre:nombreEditVenta})
                });
                setEditandoVenta(null);setNombreEditVenta('');cargarDatos();
              }}
            >Guardar</button>
            <button style={{background:'#eee',color:'#333',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:600,cursor:'pointer'}} onClick={()=>setEditandoVenta(null)}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{marginBottom: 20}}>
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

      {/* Tabla de ventas con descuento aplicado */}
      <h3 style={{margin: '32px 0 16px', color: '#2c3e50'}}>Ventas con descuento aplicado</h3>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', background: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'}}>
          <thead>
            <tr style={{background: '#f1f3f6', color: '#34495e'}}>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Venta</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Fecha</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Promoción</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Total original</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Descuento</th>
              <th style={{padding: 10, borderBottom: '2px solid #e1e1e1'}}>Total con descuento</th>
            </tr>
          </thead>
          <tbody>
            {ventasConDescuento.length === 0 ? (
              <tr><td colSpan={8} style={{padding: 16, color: '#888'}}>No hay ventas con descuento aplicado.</td></tr>
            ) : (
              ventasConDescuento.map((v, i) => (
                <tr key={v.venta_promocion_id} style={{background: i % 2 === 0 ? '#fff' : '#f6f8fa'}}>
                  <td style={{padding: 10, fontWeight: 500}}>#{v.venta_id}</td>
                  <td style={{padding: 10}}>{new Date(v.fecha_hora).toLocaleString()}</td>
                  <td style={{padding: 10}}>{v.promocion_nombre}</td>
                  <td style={{padding: 10}}>${Number(v.total_original).toFixed(2)}</td>
                  <td style={{padding: 10, color: '#e67e22', fontWeight: 600}}>- ${Number(v.monto_descuento).toFixed(2)}</td>
                  <td style={{padding: 10, color: '#27ae60', fontWeight: 600}}>${Number(v.total_con_descuento).toFixed(2)}</td>
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

export default VentaTestPage;
