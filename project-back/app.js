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

app.use(json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

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
