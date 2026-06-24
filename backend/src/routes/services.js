import { Router } from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { idParamRule, validate } from '../middleware/validator.js';

const router = Router();

router.get('/',     serviceController.getAll);
router.get('/:id',  idParamRule, validate, serviceController.getById);

export default router;
