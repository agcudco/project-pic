import { Router } from 'express';
const router = Router();
import { getAllModulos, getModuloById, createModulo, updateModulo, deleteModulo } from '../controllers/moduloController.js';

router.get('/modulos', getAllModulos);
router.get('/modulos/:id', getModuloById);
router.post('/modulos', createModulo);
router.put('/modulos/:id', updateModulo);
router.delete('/modulos/:id', deleteModulo);

export default router;