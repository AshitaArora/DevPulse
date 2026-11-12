import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import http from 'http';

let server: http.Server | null = null;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize Express application
    const app = createApp();

    // 3. Start HTTP server
    server = app.listen(config.port, () => {
      console.log(`
===================================================
  DevPulse Backend API
  Mode:    ${config.nodeEnv}
  Port:    ${config.port}
  Health:  http://localhost:${config.port}/api/health
===================================================
      `);
    });
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
