import crypto from 'crypto';

/**
 * Generate a cryptographically secure random hex string
 * @param bytes Number of random bytes (default: 32)
 */
export const generateRandomToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Generates a SHA-256 hash of a token
 * Useful for securely storing tokens (like invitation tokens) at rest
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Encrypt a string using AES-256-GCM
 * @param text Plaintext string to encrypt (e.g. GitHub OAuth access token)
 * @param secret 32-byte secret key (hex or string)
 * @returns Serialized format: "iv:authTag:encryptedHex"
 */
export const encryptToken = (text: string, secret: string): string => {
  if (!text) return '';
  // Ensure the key is exactly 32 bytes (256 bits)
  const key = crypto.createHash('sha256').update(secret).digest();
  const iv = crypto.randomBytes(12); // Standard 12-byte IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypt a string using AES-256-GCM
 * @param encryptedString Serialized string formatted as "iv:authTag:encryptedHex"
 * @param secret 32-byte secret key (hex or string)
 */
export const decryptToken = (encryptedString: string, secret: string): string => {
  if (!encryptedString) return '';
  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = crypto.createHash('sha256').update(secret).digest();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
