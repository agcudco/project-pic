import express from 'express';
import productoRoutes from './routes/producto.routes.js';

const app = express();
const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Prefijo para rutas de productos
app.use('/api/productos', productoRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
