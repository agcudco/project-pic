import React from 'react';
import DescuentoPage from './components/descuentos/DescuentoPage.js';

// Ejemplo de uso de los 3 componentes de descuentos
// siguiendo el patrón List, Form, Page

const App: React.FC = () => {
    return (
        <div className="App">
            <header>
                <h1>Sistema de Descuentos</h1>
            </header>
            
            <main>
                {/* 
                Componente principal que maneja todo el módulo de descuentos.
                Internamente usa solo los 3 componentes principales:
                - DescuentoPage: Maneja la lógica y estado principal
                - DescuentoList: Solo muestra la tabla/lista
                - DescuentoForm: Solo el formulario de edición/creación
                */}
                <DescuentoPage />
            </main>
        </div>
    );
};

export default App;

/*
ESTRUCTURA FINAL - SEPARADOS EN 2 MÓDULOS:

📁 components/descuentos/
├── 📄 DescuentoList.tsx    ← Solo tabla/lista de descuentos
├── 📄 DescuentoForm.tsx    ← Solo formulario de descuentos  
└── 📄 DescuentoPage.tsx    ← Orquestador principal de descuentos

📁 components/promociones/
├── 📄 PromocionList.tsx    ← Solo tabla/lista de promociones
├── 📄 PromocionForm.tsx    ← Solo formulario de promociones
└── 📄 PromocionPage.tsx    ← Orquestador principal de promociones

📁 services/
└── 📄 promocionService.ts  ← Servicio API para promociones
(📄 descuentoService.ts)    ← Pendiente crear para descuentos

📁 types/
└── 📄 promocion.ts         ← Interfaces para promociones
(📄 descuento.ts)          ← Pendiente crear para descuentos

MÓDULOS SEPARADOS - CADA UNO CON 3 COMPONENTES:
✅ DESCUENTOS: DescuentoList, DescuentoForm, DescuentoPage
✅ PROMOCIONES: PromocionList, PromocionForm, PromocionPage

SIN INDEX.TS - IMPORTS DIRECTOS:
- import DescuentoPage from './components/descuentos/DescuentoPage';
- import PromocionPage from './components/promociones/PromocionPage';
*/
