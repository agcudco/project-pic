// app.js
import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import homeRoutes from './routes/homeRoutes.js';
import moduloRoutes from './routes/moduloRoutes.js';
import rolRoutes from './routes/rolRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import accionRoutes from './routes/acciones.js';

const app = express();

app.use(json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// >>> Ruta raíz
app.get('/', (_req, res) => res.send('Hola mundo'));
// o: res.json({ message: 'Hola mundo' });

// Rutas principales
app.use('/api', homeRoutes);
app.use('/api', moduloRoutes); 
app.use('/api', rolRoutes); 
app.use('/api', menuRoutes); 
app.use('/api', accionRoutes);

//

export default app;
