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
import { getRolesByUserId } from '../controllers/rolesUsuarioController.js';

// Rutas básicas CRUD

// Rutas para gestión de roles
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRolById);
router.post('/roles', createRol);
router.put('/roles/:id', updateRol);
router.delete('/roles/:id', deleteRol);

// Rutas para gestión de módulos
router.get('/roles/:id/modulos', getModulosByRol);
router.post('/roles/:id/modulos', assignModuloToRol);
router.delete('/roles/:id/modulos', removeModuloFromRol);

// Nueva ruta para obtener roles de usuario
router.get('/roles/usuario/:id', getRolesByUserId);

export default router;