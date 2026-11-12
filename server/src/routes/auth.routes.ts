import { Router } from 'express';
import {
  initiateGitHubOAuth,
  handleGitHubCallback,
  getCurrentUser,
  logout,
  devMockLogin,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// OAuth initiation & callback
router.get('/github', initiateGitHubOAuth);
router.get('/github/callback', handleGitHubCallback);

// Authenticated session check & logout
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', logout);

// Development simulated login for testing without GitHub OAuth credentials
router.post('/dev-mock-login', devMockLogin);

export default router;
