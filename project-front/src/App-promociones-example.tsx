import React from 'react';
import PromocionPage from './components/promociones/PromocionPage.js';

// Ejemplo de uso de los 3 componentes principales
// siguiendo el patrón List, Form, Page

const App: React.FC = () => {
    return (
        <div className="App">
            <header>
                <h1>Sistema de Promociones y Descuentos</h1>
            </header>
            
            <main>
                {/* 
                Componente principal que maneja todo el módulo de promociones.
                Internamente usa solo los 3 componentes principales:
                - PromocionPage: Maneja la lógica y estado principal
                - PromocionList: Solo muestra la tabla/lista
                - PromocionForm: Solo el formulario de edición/creación
                */}
                <PromocionPage />
            </main>
        </div>
    );
};

export default App;

/*
ESTRUCTURA DE COMPONENTES CREADOS:

📁 components/descuentos/
├── 📄 PromocionList.tsx    ← Solo tabla/lista con props para eventos
├── 📄 PromocionForm.tsx    ← Solo formulario con props para datos y eventos
├── 📄 PromocionPage.tsx    ← Página principal que orquesta List + Form + lógica
├── 📄 DescuentosPage.tsx   ← Wrapper principal del módulo
└── 📄 AplicarDescuento.tsx ← Componente para aplicar descuentos

📁 services/
└── 📄 promocionService.ts  ← Servicio API completo

📁 types/
└── 📄 promocion.ts         ← Interfaces TypeScript

PATRÓN IMPLEMENTADO:
✅ List: PromocionList.tsx - Solo muestra datos, recibe props para eventos
✅ Form: PromocionForm.tsx - Solo formulario, recibe props para datos y callbacks
✅ Page: PromocionPage.tsx - Orquesta List + Form + lógica de negocio

CARACTERÍSTICAS:
- Separación de responsabilidades
- Props para comunicación entre componentes
- Estado centralizado en Page
- Reutilización de componentes
- TypeScript completo
- PrimeReact UI
- CRUD completo con backend
*/
