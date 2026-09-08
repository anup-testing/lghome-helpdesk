import { Router } from 'express';
import * as controller from './auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', requireAuth, controller.me);

export default router;
