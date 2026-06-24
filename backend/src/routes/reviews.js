import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { createReviewRules, validate } from '../middleware/validator.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/mine', authenticate, authorize(ROLES.CUSTOMER), reviewController.getMyReviews);
router.post('/',    authenticate, authorize(ROLES.CUSTOMER), createReviewRules, validate, reviewController.create);

export default router;
