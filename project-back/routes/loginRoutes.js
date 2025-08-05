import express from 'express';
import { login, getRolesByUserId, updatePassword, getAllRoles } from '../controllers/loginController.js';

const router = express.Router();

router.post('/login', login);
router.get('/roles/:id', getRolesByUserId);
router.put('/password/:id', updatePassword);
router.get('/roles', getAllRoles);

export default router;
