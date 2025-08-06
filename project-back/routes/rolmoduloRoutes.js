import { Router } from 'express';
const router = Router();

import {getAllRolModulos,getRolModuloByIds,createRolModulo,updateRolModulo,deleteRolModulo} from '../controllers/rolmoduloController.js';

router.get('/rolmodulo', getAllRolModulos);
router.get('/rolmodulo/:id_rol/:id_modulo', getRolModuloByIds);
router.post('/rolmodulo', createRolModulo);
router.put('/rolmodulo/:id_rol/:id_modulo', updateRolModulo);
router.delete('/rolmodulo/:id_rol/:id_modulo', deleteRolModulo);

export default router;
