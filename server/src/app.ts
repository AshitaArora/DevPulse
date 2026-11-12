import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );
  app.use(cookieParser(config.cookieSecret));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic request logger in development
  if (config.nodeEnv === 'development') {
    app.use((req: Request, _res: Response, next: NextFunction) => {
      console.log(`[HTTP] ${req.method} ${req.url}`);
      next();
    });
  }

  // Routes
  app.use('/api', healthRouter);
  app.use('/api/auth', authRouter);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested API route does not exist.',
    });
  });

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Error] Unhandled application error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: config.nodeEnv === 'development' ? err.message : 'An unexpected error occurred.',
    });
  });

  return app;
};
