import { Router } from 'express';
import * as controller from './tickets.controller.js';
import * as messagesController from '../ticket-messages/ticket-messages.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.get('/:id/messages', requireAuth, messagesController.list);
router.post('/:id/messages', requireAuth, messagesController.create);

export default router;
