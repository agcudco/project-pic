import { Router } from 'express';
const router = Router();

import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  deactivateUsuario
} from '../controllers/usuarioController.js';

// Rutas básicas CRUD
router.get('/usuarios', getAllUsuarios);
router.get('/usuarios/:id', getUsuarioById);
router.post('/usuarios', createUsuario);
router.put('/usuarios/:id', updateUsuario);
router.delete('/usuarios/:id', deleteUsuario);

export default router;