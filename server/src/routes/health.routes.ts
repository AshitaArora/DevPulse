import { Router, Request, Response } from 'express';
import { getDBStatus } from '../config/db.js';
import { config } from '../config/env.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  const dbStatus = getDBStatus();
  const isHealthy = dbStatus.isConnected;

  const healthData = {
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'DevPulse API',
    version: '1.0.0',
    environment: config.nodeEnv,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  };

  res.status(isHealthy ? 200 : 503).json(healthData);
});

export default router;
