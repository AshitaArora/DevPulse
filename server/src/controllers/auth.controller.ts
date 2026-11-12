import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { generateRandomToken, encryptToken } from '../utils/crypto.js';
import { exchangeCodeForToken, fetchGitHubUser } from '../services/githubAuth.service.js';
import { User } from '../models/User.js';
import { OrganizationMember } from '../models/OrganizationMember.js';

const isProduction = config.nodeEnv === 'production';

/**
 * Initiates the GitHub OAuth handshake with CSRF protection
 * GET /api/auth/github
 */
export const initiateGitHubOAuth = (req: Request, res: Response): void => {
  if (!config.github.clientId || config.github.clientId.startsWith('dummy')) {
    // If GitHub OAuth credentials are not set in development mode, provide feedback
    res.status(400).json({
      error: 'GitHub OAuth Unconfigured',
      message: 'GITHUB_CLIENT_ID is not configured in server/.env. Please configure GitHub OAuth credentials.',
      isDev: !isProduction,
    });
    return;
  }

  // 1. Generate cryptographically random state token
  const state = generateRandomToken(32);

  // 2. Store state in secure, HttpOnly cookie with 10-minute expiry
  res.cookie('devpulse_oauth_state', state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutes
    path: '/',
  });

  // 3. Build authorization URL and redirect
  const scopeString = encodeURIComponent(config.github.scopes.join(' '));
  const callbackUrl = encodeURIComponent(config.github.callbackUrl);
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${callbackUrl}&scope=${scopeString}&state=${state}`;

  res.redirect(authUrl);
};

/**
 * Handles GitHub OAuth redirect callback, verifies state, and exchanges code for token
 * GET /api/auth/github/callback
 */
export const handleGitHubCallback = async (req: Request, res: Response): Promise<void> => {
  const { code, state, error, error_description } = req.query;

  // Handle GitHub-side denial or error
  if (error) {
    const errorMsg = encodeURIComponent((error_description as string) || (error as string) || 'Access denied');
    res.redirect(`${config.clientUrl}/auth/callback?status=error&message=${errorMsg}`);
    return;
  }

  // 1. Validate state to prevent CSRF
  const storedState = req.cookies?.devpulse_oauth_state;

  if (!state || !storedState || state !== storedState) {
    console.warn('[Auth] CSRF validation failed: State parameter mismatch or expired');
    res.redirect(`${config.clientUrl}/auth/callback?status=error&message=CSRF_STATE_MISMATCH`);
    return;
  }

  // 2. Clear state cookie
  res.clearCookie('devpulse_oauth_state', { path: '/' });

  if (!code || typeof code !== 'string') {
    res.redirect(`${config.clientUrl}/auth/callback?status=error&message=MISSING_CODE`);
    return;
  }

  try {
    // 3. Exchange authorization code for access token
    const accessToken = await exchangeCodeForToken(code);

    // 4. Fetch GitHub user profile and verified email
    const profile = await fetchGitHubUser(accessToken);

    // 5. Encrypt access token with AES-256-GCM before database persistence
    const encryptedAccessToken = encryptToken(accessToken, config.encryptionSecret);

    // 6. Upsert User in MongoDB
    const user = await User.findOneAndUpdate(
      { githubId: profile.githubId },
      {
        username: profile.username,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        githubProfileUrl: profile.githubProfileUrl,
        encryptedAccessToken,
        lastLoginAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 7. Issue session JWT
    const sessionToken = jwt.sign(
      {
        userId: user._id.toString(),
        githubId: user.githubId,
        username: user.username,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    // 8. Set HTTP-Only session cookie
    res.cookie('devpulse_session', sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // 9. Redirect user to frontend callback landing
    res.redirect(`${config.clientUrl}/auth/callback?status=success`);
  } catch (err: unknown) {
    console.error('[Auth] OAuth Callback error:', err);
    const message = encodeURIComponent(err instanceof Error ? err.message : 'Authentication failed');
    res.redirect(`${config.clientUrl}/auth/callback?status=error&message=${message}`);
  }
};

/**
 * Returns current authenticated user and their organization memberships
 * GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-encryptedAccessToken');

    if (!user) {
      res.status(404).json({ error: 'User Not Found', message: 'The user session is invalid.' });
      return;
    }

    // Retrieve organization memberships
    const memberships = await OrganizationMember.find({ userId: user._id })
      .populate('organizationId', 'name slug avatarUrl settings')
      .lean();

    const organizations = memberships.map((m) => ({
      organization: m.organizationId,
      orgRole: m.orgRole,
      joinedAt: m.joinedAt,
    }));

    res.json({
      user: {
        id: user._id,
        githubId: user.githubId,
        username: user.username,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        githubProfileUrl: user.githubProfileUrl,
        createdAt: user.createdAt,
      },
      organizations,
    });
  } catch (error) {
    console.error('[Auth] getCurrentUser error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch user session' });
  }
};

/**
 * Log out and clear session cookie
 * POST /api/auth/logout
 */
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('devpulse_session', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
};

/**
 * Development Helper: Simulate OAuth login for testing without GitHub credentials
 * POST /api/auth/dev-mock-login (Enabled only when NODE_ENV === 'development')
 */
export const devMockLogin = async (req: Request, res: Response): Promise<void> => {
  if (isProduction) {
    res.status(404).json({ error: 'Not available in production' });
    return;
  }

  const { username = 'demo-developer', name = 'Demo Developer', email = 'demo@devpulse.io' } = req.body || {};

  try {
    const encryptedToken = encryptToken('mock_github_token_for_local_testing', config.encryptionSecret);

    const user = await User.findOneAndUpdate(
      { githubId: `mock_${username}` },
      {
        username,
        name,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        githubProfileUrl: `https://github.com/${username}`,
        encryptedAccessToken: encryptedToken,
        lastLoginAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const sessionToken = jwt.sign(
      {
        userId: user._id.toString(),
        githubId: user.githubId,
        username: user.username,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    res.cookie('devpulse_session', sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      success: true,
      message: 'Simulated login successful',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Mock login failed', details: error });
  }
};
