import express from 'express';
import {
    getAllAcciones,
    getAccionById,
    createAccion,
    updateAccion,
    deleteAccion
} from '../controllers/accionController.js';

const router = express.Router();

// Rutas para /acciones
router.get('/acciones', getAllAcciones);
router.get('/acciones/:id', getAccionById);
router.post('/acciones', createAccion);
router.put('/acciones/:id', updateAccion);
router.delete('/acciones/:id', deleteAccion);

export default router;
