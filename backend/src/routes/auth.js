import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/security.js';
import { registerRules, loginRules, validate } from '../middleware/validator.js';

const router = Router();

router.post('/register', authRateLimit, registerRules, validate, authController.register);
router.post('/login',    authRateLimit, loginRules,    validate, authController.login);
router.get('/verify',   authenticate,                           authController.verify);

export default router;
