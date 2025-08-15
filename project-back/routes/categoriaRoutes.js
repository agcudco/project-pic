
import { Router } from 'express';
import {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    searchCategorias,
    getCategoriasConDescuento
} from '../controllers/categoriaController.js';

const router = Router();

router.get('/categoria', getAllCategorias);
router.get('/categoria/search', searchCategorias);
router.get('/categoria/:id', getCategoriaById);
router.post('/categoria', createCategoria);
router.put('/categoria/:id', updateCategoria);
router.delete('/categoria/:id', deleteCategoria);

// Nueva ruta para categorías con descuento aplicado
router.get('/categorias-con-descuento', getCategoriasConDescuento);

export default router;