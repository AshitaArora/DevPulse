import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface AuthenticatedUserPayload {
  userId: string;
  githubId: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Check cookie first, fallback to Authorization header
  const token = req.cookies?.devpulse_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication session required. Please sign in.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthenticatedUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired session. Please sign in again.',
    });
  }
};
