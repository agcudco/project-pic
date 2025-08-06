
import { Router } from 'express';
import {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    searchCategorias
} from '../controllers/categoriaController.js';

const router = Router();

router.get('/categoria', getAllCategorias);
router.get('/categoria/search', searchCategorias);
router.get('/categoria/:id', getCategoriaById);
router.post('/categoria', createCategoria);
router.put('/categoria/:id', updateCategoria);
router.delete('/categoria/:id', deleteCategoria);

export default router;