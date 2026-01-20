import { Router } from 'express';
import authController from './controller';
import { authenticate } from '@shared/middleware/auth';

const router = Router();

/**
 * POST /auth/register - Register new user
 */
router.post('/register', (req, res, next) => authController.register(req, res).catch(next));

/**
 * POST /auth/login - Login user
 */
router.post('/login', (req, res, next) => authController.login(req, res).catch(next));

/**
 * POST /auth/refresh-token - Refresh JWT token
 */
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res).catch(next));

/**
 * POST /auth/logout - Logout user
 */
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res).catch(next));

/**
 * POST /auth/change-password - Change password
 */
router.post('/change-password', authenticate, (req, res, next) => authController.changePassword(req, res).catch(next));

export default router;
