import { login, getRolesByUserId, updatePassword } from '../controllers/loginController.js';
import express from 'express';

const router = express.Router();

// Ruta para login
router.post('/login', login);

// Ruta para obtener roles por id de usuario
router.get('/usuario/:id/roles', getRolesByUserId);

// Ruta para actualizar contraseña
router.put('/usuario/:id/password', updatePassword);

export default router;
