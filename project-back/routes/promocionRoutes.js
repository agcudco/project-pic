import { Router } from 'express';
import {
  getAllPromociones,
  getPromocionById,
  getPromocionesActivas,
  getPromocionesPorTipo,
  getPromocionesVigentes,
  createPromocion,
  updatePromocion,
  deletePromocion,
  activarPromocion,
  desactivarPromocion,
  aplicarDescuento,
  aplicarDescuentoCategoria,
  aplicarDescuentoProducto
} from '../controllers/promocionController.js';

const router = Router();

// Rutas básicas CRUD para promociones
router.get('/promociones', getAllPromociones);
router.get('/promociones/:id', getPromocionById);
router.post('/promociones', createPromocion);
router.put('/promociones/:id', updatePromocion);
router.delete('/promociones/:id', deletePromocion);

// Rutas específicas para consultas de promociones
router.get('/promociones-activas', getPromocionesActivas);
router.get('/promociones-vigentes', getPromocionesVigentes);
router.get('/promociones/tipo/:tipo', getPromocionesPorTipo);

// Rutas para activar/desactivar promociones
router.patch('/promociones/:id/activar', activarPromocion);
router.patch('/promociones/:id/desactivar', desactivarPromocion);

// Ruta para aplicar descuentos
router.post('/promociones/aplicar-descuento', aplicarDescuento);

// Ruta para aplicar descuento a categoría
router.post('/promociones/aplicar-descuento-categoria', aplicarDescuentoCategoria);

// Ruta para aplicar descuento a producto
router.post('/promociones/aplicar-descuento-producto', aplicarDescuentoProducto);

export default router;
