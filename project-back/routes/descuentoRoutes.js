import { Router } from 'express';
import {
  getAllDescuentos,
  getDescuentoById,
  createDescuento,
  updateDescuento,
  deleteDescuento,
  activarDescuento,
  desactivarDescuento
} from '../controllers/descuentoController.js';

const router = Router();

router.get('/descuentos', getAllDescuentos);
router.get('/descuentos/:id', getDescuentoById);
router.post('/descuentos', createDescuento);
router.put('/descuentos/:id', updateDescuento);
router.delete('/descuentos/:id', deleteDescuento);
router.patch('/descuentos/:id/activar', activarDescuento);
router.patch('/descuentos/:id/desactivar', desactivarDescuento);

export default router;
