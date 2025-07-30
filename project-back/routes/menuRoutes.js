import { Router } from 'express';
import {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
} from '../controllers/menuController.js';

const router = Router();

// Rutas básicas CRUD para menús
router.get('/menus', getAllMenus);
router.get('/menus/:id', getMenuById);
router.post('/menus', createMenu);
router.put('/menus/:id', updateMenu);
router.delete('/menus/:id', deleteMenu);

export default router;
