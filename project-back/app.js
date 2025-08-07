import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import homeRoutes from './routes/homeRoutes.js';
import moduloRoutes from './routes/moduloRoutes.js';
import rolRoutes from './routes/rolRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import promocionRoutes from './routes/promocionRoutes.js';
import descuentoRoutes from './routes/descuentoRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';
import accionRoutes from './routes/acciones.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import rolmoduloRoutes from './routes/rolmoduloRoutes.js';

const app = express();

// Middleware mejorado para debugging
app.use(json({ limit: '10mb' })); // Aumentar límite si es necesario
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Middleware global de logging
app.use((req, res, next) => {
  if (req.method === 'PUT' && req.path.includes('/descuentos/')) {
    console.log('🔍 MIDDLEWARE GLOBAL - PUT descuentos');
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
  }
  next();
});

app.get('/', (_req, res) => res.send('Hola mundo'));

// Rutas principales
app.use('/api', promocionRoutes);
app.use('/api', descuentoRoutes);
app.use('/api', homeRoutes);
app.use('/api', moduloRoutes); 
app.use('/api', rolRoutes); 
app.use('/api', menuRoutes); 
app.use('/api', ventaRoutes);
app.use('/api', accionRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', rolmoduloRoutes); 

export default app;
