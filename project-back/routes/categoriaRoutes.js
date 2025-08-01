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

router.get('/', getAllCategorias);
router.get('/search', searchCategorias);
router.get('/:id', getCategoriaById);
router.post('/', createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);

export default router;
