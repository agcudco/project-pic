import { login, getRolesByUserId, updatePassword, getAllRoles } from '../controllers/loginController.js';


import express from 'express';
const router = express.Router();

// Ruta para login
router.post('/login', login);

// Ruta para obtener roles por id de usuario
router.get('/usuario/:id/roles', getRolesByUserId);

// Ruta para actualizar contraseña
router.put('/usuario/:id/password', updatePassword);
router.get('/roles/:id', getRolesByUserId);
router.put('/password/:id', updatePassword);
router.get('/roles', getAllRoles);

export default router;
