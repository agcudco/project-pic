import { Router } from 'express';
import {
  getAllDescuentos,
  getDescuentoById,
  createDescuento,
  updateDescuento,
  deleteDescuento,
  activarDescuento,
  desactivarDescuento,
  diagnosticoDescuento
} from '../controllers/descuentoController.js';

const router = Router();

// Middleware de logging para debugging
const logRequest = (req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path}`);
  console.log('📋 Parámetros URL:', req.params);
  console.log('📋 Body recibido:', req.body);
  console.log('📋 Headers:', req.headers);
  next();
};

// Endpoint de diagnóstico
router.put('/descuentos/:id/diagnostico', diagnosticoDescuento);

// Endpoint de prueba simple
router.put('/descuentos/:id/test', (req, res) => {
  console.log('🧪 ENDPOINT DE PRUEBA');
  console.log('ID recibido:', req.params.id);
  console.log('Body recibido:', req.body);
  res.json({ message: 'Prueba exitosa', id: req.params.id, data: req.body });
});

router.get('/descuentos', getAllDescuentos);
router.get('/descuentos-activos', getAllDescuentos); // Por ahora devuelve todos
router.get('/descuentos/:id', getDescuentoById);
router.post('/descuentos', createDescuento);
router.put('/descuentos/:id', logRequest, updateDescuento);
router.delete('/descuentos/:id', logRequest, deleteDescuento);
router.patch('/descuentos/:id/activar', activarDescuento);
router.patch('/descuentos/:id/desactivar', desactivarDescuento);

export default router;
