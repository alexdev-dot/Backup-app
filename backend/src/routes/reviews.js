import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { createReviewRules, validate } from '../middleware/validator.js';

const router = Router();

router.get('/mine', authenticate, reviewController.getMyReviews);
router.post('/',    authenticate, createReviewRules, validate, reviewController.create);

export default router;
