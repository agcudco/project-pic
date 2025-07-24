import { Router } from 'express';
const router = Router();
import { getSaludo } from '../controllers/homeController.js';

router.get('/', getSaludo);


export default router;