import { Router } from 'express';
import * as professionalController from '../controllers/professionalController.js';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { idParamRule, validate } from '../middleware/validator.js';

const router = Router();

router.get('/',          professionalController.getAll);
router.get('/me',        authenticate, professionalController.getMyProfile);
router.post('/',         authenticate, professionalController.create);
router.put('/me',        authenticate, professionalController.updateMyProfile);
router.get('/:id',       idParamRule, validate, professionalController.getById);
router.get('/:id/reviews', idParamRule, validate, reviewController.getForProfessional);

export default router;
