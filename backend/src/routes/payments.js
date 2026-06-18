import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import {
  createTransactionRules,
  createInvoiceRules,
  idParamRule,
  validate,
} from '../middleware/validator.js';
import { body } from 'express-validator';
import { INVOICE_STATUS } from '../config/constants.js';

const router = Router();

router.get('/methods',             authenticate, paymentController.getMethods);
router.post('/methods',            authenticate, paymentController.addMethod);
router.put('/methods/:id/default', authenticate, idParamRule, validate, paymentController.setDefault);
router.delete('/methods/:id',      authenticate, idParamRule, validate, paymentController.removeMethod);

router.get('/transactions',        authenticate, paymentController.getTransactions);
router.post('/transactions',       authenticate, createTransactionRules, validate, paymentController.createTransaction);

router.get('/invoices',            authenticate, paymentController.getInvoices);
router.post('/invoices',           authenticate, createInvoiceRules, validate, paymentController.createInvoice);
router.put('/invoices/:id',
  authenticate,
  idParamRule,
  [body('status').isIn(Object.values(INVOICE_STATUS)).withMessage('Invalid invoice status')],
  validate,
  paymentController.updateInvoiceStatus
);

export default router;
