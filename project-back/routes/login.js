import express from 'express';
import { login, getRolesByUserId, updatePassword } from '../controllers/loginController.js';

const router = express.Router();

// Ruta para login
router.post('/login', login);

// Ruta para obtener roles de un usuario por ID
router.get('/roles/:id', getRolesByUserId);

// Ruta para actualizar contraseña de un usuario por ID
router.put('/password/:id', updatePassword);

export default router;