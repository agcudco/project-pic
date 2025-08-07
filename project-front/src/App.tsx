import { useState } from 'react'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './App.css'
import DescuentoPage from './components/descuentos/DescuentoPage.js'
import PromocionPage from './components/promociones/PromocionPage.js'

function App() {
  const [activeTab, setActiveTab] = useState<'descuentos' | 'promociones'>('descuentos')

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sistema de Gestión - Descuentos y Promociones</h1>
      
      {/* Navegación simple */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('descuentos')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'descuentos' ? '#007ad9' : '#f0f0f0',
            color: activeTab === 'descuentos' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Gestión de Descuentos
        </button>
        <button 
          onClick={() => setActiveTab('promociones')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'promociones' ? '#007ad9' : '#f0f0f0',
            color: activeTab === 'promociones' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Gestión de Promociones
        </button>
      </div>

      {/* Contenido */}
      {activeTab === 'descuentos' ? <DescuentoPage /> : <PromocionPage />}
    </div>
  )
}

export default App
