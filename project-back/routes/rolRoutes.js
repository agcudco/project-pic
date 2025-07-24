import { Router } from 'express';
const router = Router();
import {
    getAllRoles,
    getRolById,
    createRol,
    updateRol,
    deleteRol,
    getModulosByRol,
    assignModuloToRol,
    removeModuloFromRol
} from '../controllers/rolController.js';

// Rutas básicas CRUD
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRolById);
router.post('/roles', createRol);
router.put('/roles/:id', updateRol);
router.delete('/roles/:id', deleteRol);

// Rutas para gestión de módulos
router.get('/roles/:id/modulos', getModulosByRol);
router.post('/roles/:id/modulos', assignModuloToRol);
router.delete('/roles/:id/modulos', removeModuloFromRol);

export default router;