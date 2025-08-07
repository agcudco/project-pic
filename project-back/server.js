import app from './app.js';
import { connect, pool } from './config/db.js';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    console.log('🔗 Intentando conectar a la base de datos...');
    await connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
    
    // Test directo de la tabla descuentos
    console.log('🧪 Probando consulta a tabla descuentos...');
    const testResult = await pool.query('SELECT COUNT(*) FROM descuentos');
    console.log('✅ Tabla descuentos accesible. Registros:', testResult.rows[0].count);
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 API descuentos disponible en http://localhost:${PORT}/api/descuentos`);
    });
  } catch (err) {
    console.error('❌ Error conectando a la BD:', err);
    console.error('📋 Verifica que:');
    console.error('   1. PostgreSQL esté ejecutándose');
    console.error('   2. La base de datos "project_db" exista');  
    console.error('   3. La tabla "descuentos" exista');
    console.error('   4. Las credenciales en .env sean correctas');
    process.exit(1);
  }
})();
