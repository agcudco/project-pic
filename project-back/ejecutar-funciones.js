// Script temporal para ejecutar las funciones de promociones
import fs from 'fs';
import pool from './config/db.js';

async function ejecutarFunciones() {
  try {
    console.log('Ejecutando funciones de promociones...');
    
    // Leer el archivo de funciones
    const funcionesSQL = fs.readFileSync('./sql/herrera-lecho/Funciones-promociones.sql', 'utf8');
    
    // Ejecutar el SQL
    await pool.query(funcionesSQL);
    
    console.log('✅ Funciones de promociones creadas exitosamente');
    
    // Verificar que las funciones se crearon
    const result = await pool.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'ventas' 
      AND routine_name LIKE '%promocion%'
      ORDER BY routine_name;
    `);
    
    console.log('\n📋 Funciones creadas:');
    result.rows.forEach(row => {
      console.log(`  - ${row.routine_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error ejecutando funciones:', error.message);
  } finally {
    await pool.end();
  }
}

ejecutarFunciones();
