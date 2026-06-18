import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { updateProfileRules, validate } from '../middleware/validator.js';

const router = Router();

router.get('/profile',  authenticate, userController.getProfile);
router.put('/profile',  authenticate, updateProfileRules, validate, userController.updateProfile);

export default router;
