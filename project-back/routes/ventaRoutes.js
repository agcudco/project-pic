//REALIZADO POR ELIAN COLLAGUAZO

import { Router } from 'express';
const router = Router();

import {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  anularVenta,
  getVentasConDescuento
} from '../controllers/ventaController.js';

// Rutas con prefijo "/venta"
router.get('/venta', getAllVentas); // Ahora la ruta es "/api/venta"
router.get('/venta/:id', getVentaById); // "/api/venta/:id"
router.post('/venta', createVenta); // "/api/venta"
router.put('/venta/:id', updateVenta); // "/api/venta/:id"
router.delete('/venta/:id', anularVenta); // "/api/venta/:id"

// Nueva ruta para ventas con descuento aplicado
router.get('/ventas-con-descuento', getVentasConDescuento);

export default router;