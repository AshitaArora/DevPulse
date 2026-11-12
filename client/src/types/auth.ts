export interface User {
  id: string;
  githubId: string;
  username: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  githubProfileUrl?: string;
  createdAt: string;
}

export type OrgRole = 'ORG_ADMIN' | 'MEMBER';

export interface UserOrganization {
  organization: {
    _id: string;
    name: string;
    slug: string;
    avatarUrl?: string;
    settings?: {
      anonymizeMetrics: boolean;
      minTeamSizeDisplay: number;
    };
  };
  orgRole: OrgRole;
  joinedAt: string;
}

export interface AuthContextType {
  user: User | null;
  organizations: UserOrganization[];
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  devSimulateLogin: (username?: string) => Promise<void>;
}
