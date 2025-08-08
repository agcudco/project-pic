//REALIZADO POR ELIAN COLLAGUAZO

import { Router } from 'express';
const router = Router();

import {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  anularVenta,
    getDetallesVenta,
    getFacturaVenta
} from '../controllers/ventaController.js';

// Rutas con prefijo "/venta"
router.get('/venta', getAllVentas); // Ahora la ruta es "/api/venta"
router.get('/venta/:id', getVentaById); // "/api/venta/:id"
router.get('/venta/:id/detalles', getDetallesVenta);  // <--- NUEVA RUTA
router.get('/venta/:id/factura', getFacturaVenta);  // NUEVA RUTA PARA VER FACTURA
router.post('/venta', createVenta); // "/api/venta"
router.put('/venta/:id', updateVenta); // "/api/venta/:id"
router.delete('/venta/:id', anularVenta); // "/api/venta/:id"

export default router;