import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(config.mongoUri);

    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Warning: Database disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Database reconnected');
});

export const getDBStatus = () => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const readyState = mongoose.connection.readyState;
  return {
    state: states[readyState] || 'unknown',
    isConnected: readyState === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};
