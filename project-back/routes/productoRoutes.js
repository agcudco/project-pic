import express from 'express';
import { getAllProductos, getProductosConDescuento } from '../controllers/productoController.js';

const router = express.Router();

// GET /api/productos
router.get('/productos', getAllProductos);

// GET /api/productos-con-descuento
router.get('/productos-con-descuento', getProductosConDescuento);

export default router;
