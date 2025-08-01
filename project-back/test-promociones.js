// Script de pruebas para las funciones de Promociones
// Ejecutar con: node test-promociones.js

const API_BASE = 'http://localhost:3000/api';

// Función helper para hacer requests
async function makeRequest(url, method = 'GET', data = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${API_BASE}${url}`, config);
    const result = await response.json();
    
    console.log(`\n🔍 ${method} ${url}`);
    console.log(`📋 Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error en ${method} ${url}:`, error.message);
    return { status: 500, error: error.message };
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🚀 INICIANDO PRUEBAS DE PROMOCIONES');
  console.log('=====================================');
  
  try {
    // Prueba 1: Obtener todas las promociones
    console.log('\n📋 PRUEBA 1: Obtener todas las promociones');
    await makeRequest('/promociones');
    
    // Prueba 2: Obtener promociones activas
    console.log('\n📋 PRUEBA 2: Obtener promociones activas');
    await makeRequest('/promociones-activas');
    
    // Prueba 3: Crear una nueva promoción
    console.log('\n📋 PRUEBA 3: Crear una nueva promoción');
    const nuevaPromocion = {
      nombre: 'Descuento Prueba',
      tipo: 'producto',
      valor: 15.50,
      fecha_inicio: '2025-08-01',
      fecha_fin: '2025-08-31',
      condicion_json: { min_qty: 2 }
    };
    
    const createResult = await makeRequest('/promociones', 'POST', nuevaPromocion);
    let promocionId = null;
    
    if (createResult.status === 201) {
      promocionId = createResult.data.id;
      console.log(`✅ Promoción creada con ID: ${promocionId}`);
    }
    
    // Prueba 4: Obtener promoción por ID (si se creó)
    if (promocionId) {
      console.log('\n📋 PRUEBA 4: Obtener promoción por ID');
      await makeRequest(`/promociones/${promocionId}`);
    }
    
    // Prueba 5: Obtener promociones por tipo
    console.log('\n📋 PRUEBA 5: Obtener promociones por tipo (producto)');
    await makeRequest('/promociones/tipo/producto');
    
    // Prueba 6: Obtener promociones vigentes
    console.log('\n📋 PRUEBA 6: Obtener promociones vigentes');
    await makeRequest('/promociones-vigentes');
    
    // Prueba 7: Desactivar promoción (si se creó)
    if (promocionId) {
      console.log('\n📋 PRUEBA 7: Desactivar promoción');
      await makeRequest(`/promociones/${promocionId}/desactivar`, 'PATCH');
    }
    
    // Prueba 8: Activar promoción (si se creó)
    if (promocionId) {
      console.log('\n📋 PRUEBA 8: Activar promoción');
      await makeRequest(`/promociones/${promocionId}/activar`, 'PATCH');
    }
    
    // Prueba 9: Actualizar promoción (si se creó)
    if (promocionId) {
      console.log('\n📋 PRUEBA 9: Actualizar promoción');
      const updateData = {
        nombre: 'Descuento Prueba Actualizado',
        valor: 20.00
      };
      await makeRequest(`/promociones/${promocionId}`, 'PUT', updateData);
    }
    
    // Prueba 10: Eliminar promoción (si se creó)
    if (promocionId) {
      console.log('\n📋 PRUEBA 10: Eliminar promoción');
      await makeRequest(`/promociones/${promocionId}`, 'DELETE');
    }
    
    console.log('\n🎉 PRUEBAS COMPLETADAS');
    console.log('=====================================');
    
  } catch (error) {
    console.error('💥 Error en las pruebas:', error);
  }
}

// Ejecutar las pruebas
runTests();
