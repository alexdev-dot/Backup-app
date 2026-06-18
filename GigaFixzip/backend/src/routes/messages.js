import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { sendMessageRules, idParamRule, validate } from '../middleware/validator.js';

const router = Router();

router.get('/conversations',                authenticate, messageController.getConversations);
router.post('/conversations',               authenticate, messageController.startConversation);
router.get('/conversations/:id/messages',   authenticate, idParamRule, validate, messageController.getMessages);
router.put('/conversations/:id/read',       authenticate, idParamRule, validate, messageController.markRead);
router.post('/messages',                    authenticate, sendMessageRules, validate, messageController.send);

export default router;
