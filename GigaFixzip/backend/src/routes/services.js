import { Router } from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { authenticate } from '../middleware/auth.js';
import { idParamRule, validate } from '../middleware/validator.js';
import { body } from 'express-validator';

const router = Router();

const createServiceRules = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

router.get('/',     serviceController.getAll);
router.get('/:id',  idParamRule, validate, serviceController.getById);
router.post('/',    authenticate, createServiceRules, validate, serviceController.create);

export default router;
