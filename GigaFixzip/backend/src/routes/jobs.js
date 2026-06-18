import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { createJobRules, updateJobRules, idParamRule, validate } from '../middleware/validator.js';

const router = Router();

router.get('/public', jobController.getPublic);

router.get('/',       authenticate, jobController.getMyJobs);
router.post('/',      authenticate, createJobRules, validate, jobController.create);
router.get('/:id',    authenticate, idParamRule, validate, jobController.getById);
router.put('/:id',    authenticate, updateJobRules, validate, jobController.update);
router.delete('/:id', authenticate, idParamRule, validate, jobController.remove);

export default router;
