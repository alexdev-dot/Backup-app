import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { createJobRules, updateJobRules, idParamRule, validate } from '../middleware/validator.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/public', jobController.getPublic);

router.get('/',       authenticate, authorize(ROLES.CUSTOMER), jobController.getMyJobs);
router.post('/',      authenticate, authorize(ROLES.CUSTOMER), createJobRules, validate, jobController.create);
router.get('/:id',    authenticate, idParamRule, validate, jobController.getById);
router.put('/:id',    authenticate, authorize(ROLES.CUSTOMER), updateJobRules, validate, jobController.update);
router.delete('/:id', authenticate, authorize(ROLES.CUSTOMER), idParamRule, validate, jobController.remove);

export default router;
