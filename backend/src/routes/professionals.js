import { Router } from 'express';
import * as professionalController from '../controllers/professionalController.js';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { idParamRule, validate } from '../middleware/validator.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/',          professionalController.getAll);
router.get('/me',        authenticate, authorize(ROLES.PROFESSIONAL), professionalController.getMyProfile);
router.post('/',         authenticate, authorize(ROLES.PROFESSIONAL), professionalController.create);
router.put('/me',        authenticate, authorize(ROLES.PROFESSIONAL), professionalController.updateMyProfile);
router.get('/:id',       idParamRule, validate, professionalController.getById);
router.get('/:id/reviews', idParamRule, validate, reviewController.getForProfessional);

export default router;
