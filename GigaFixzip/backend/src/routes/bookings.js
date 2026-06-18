import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { createBookingRules, updateBookingStatusRules, idParamRule, validate } from '../middleware/validator.js';

const router = Router();

router.get('/',           authenticate, bookingController.getMyBookings);
router.post('/',          authenticate, createBookingRules, validate, bookingController.create);
router.get('/:id',        authenticate, idParamRule, validate, bookingController.getById);
router.put('/:id/status', authenticate, updateBookingStatusRules, validate, bookingController.updateStatus);
router.delete('/:id',     authenticate, idParamRule, validate, bookingController.cancel);

export default router;
