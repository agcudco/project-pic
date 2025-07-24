import app from './app.js';
import { connect } from './config/db.js';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connect();
    console.log('Conectado a la base de datos PostgreSQL');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error conectando a la BD:', err);
    process.exit(1);
  }
})();
