import { config } from '../config/env.js';

interface GitHubTokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

interface GitHubUserProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

/**
 * Exchanges the temporary OAuth code from GitHub for an access token
 */
export const exchangeCodeForToken = async (code: string): Promise<string> => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code,
      redirect_uri: config.github.callbackUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as GitHubTokenResponse;

  if (data.error || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to obtain access token from GitHub');
  }

  return data.access_token;
};

/**
 * Fetches the authenticated user's profile and primary verified email from GitHub
 */
export const fetchGitHubUser = async (accessToken: string) => {
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'DevPulse-Platform',
    },
  });

  if (!userResponse.ok) {
    throw new Error(`Failed to fetch GitHub profile: ${userResponse.status}`);
  }

  const profile = (await userResponse.json()) as GitHubUserProfile;

  // If email is not public on profile, fetch user/emails
  let primaryEmail = profile.email;
  if (!primaryEmail) {
    try {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'DevPulse-Platform',
        },
      });

      if (emailResponse.ok) {
        const emails = (await emailResponse.json()) as GitHubEmail[];
        const primary = emails.find((e) => e.primary && e.verified) || emails[0];
        if (primary) {
          primaryEmail = primary.email;
        }
      }
    } catch {
      // Continue even if email fetching fails
    }
  }

  return {
    githubId: profile.id.toString(),
    username: profile.login,
    name: profile.name || profile.login,
    email: primaryEmail || '',
    avatarUrl: profile.avatar_url || '',
    githubProfileUrl: profile.html_url || '',
  };
};
