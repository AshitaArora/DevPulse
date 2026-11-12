import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devpulse',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // GitHub OAuth credentials
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
    scopes: ['read:user', 'user:email'],
  },

  // JWT & Session Secrets
  jwt: {
    secret: process.env.JWT_SECRET || 'devpulse_default_jwt_secret_change_in_production_32chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // AES-256 Token Encryption Secret
  encryptionSecret: process.env.ENCRYPTION_SECRET || 'devpulse_aes_256_gcm_token_encryption_secret_key_32bytes',

  // Cookie Secret
  cookieSecret: process.env.COOKIE_SECRET || 'devpulse_cookie_signing_secret_key_32chars',
};

// Production startup safety validation
if (config.nodeEnv === 'production') {
  const missingSecrets: string[] = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'devpulse_default_jwt_secret_change_in_production_32chars') {
    missingSecrets.push('JWT_SECRET');
  }
  if (!process.env.ENCRYPTION_SECRET || process.env.ENCRYPTION_SECRET === 'devpulse_aes_256_gcm_token_encryption_secret_key_32bytes') {
    missingSecrets.push('ENCRYPTION_SECRET');
  }
  if (!process.env.COOKIE_SECRET || process.env.COOKIE_SECRET === 'devpulse_cookie_signing_secret_key_32chars') {
    missingSecrets.push('COOKIE_SECRET');
  }
  if (!process.env.GITHUB_CLIENT_ID) {
    missingSecrets.push('GITHUB_CLIENT_ID');
  }
  if (!process.env.GITHUB_CLIENT_SECRET) {
    missingSecrets.push('GITHUB_CLIENT_SECRET');
  }
  if (missingSecrets.length > 0) {
    throw new Error(`[Security Error] Missing or insecure production environment variables: ${missingSecrets.join(', ')}`);
  }
}
