import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import {
  createTransactionRules,
  idParamRule,
  validate,
} from '../middleware/validator.js';

const router = Router();

router.get('/methods',             authenticate, paymentController.getMethods);
router.post('/methods',            authenticate, paymentController.addMethod);
router.put('/methods/:id/default', authenticate, idParamRule, validate, paymentController.setDefault);
router.delete('/methods/:id',      authenticate, idParamRule, validate, paymentController.removeMethod);

router.get('/transactions',        authenticate, paymentController.getTransactions);
router.post('/transactions',       authenticate, createTransactionRules, validate, paymentController.createTransaction);

export default router;
