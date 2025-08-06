//REALIZADO POR ELIAN COLLAGUAZO

import { Router } from 'express';
const router = Router();

import {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  anularVenta
} from '../controllers/ventaController.js';

// Rutas con prefijo "/venta"
router.get('/venta', getAllVentas); // Ahora la ruta es "/api/venta"
router.get('/venta/:id', getVentaById); // "/api/venta/:id"
router.post('/venta', createVenta); // "/api/venta"
router.put('/venta/:id', updateVenta); // "/api/venta/:id"
router.delete('/venta/:id', anularVenta); // "/api/venta/:id"

export default router;