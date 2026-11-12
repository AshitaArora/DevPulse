import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserOrganization, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setOrganizations(data.organizations || []);
      } else if (res.status === 401) {
        setUser(null);
        setOrganizations([]);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Failed to authenticate');
        setUser(null);
        setOrganizations([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
      setUser(null);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setOrganizations([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const devSimulateLogin = async (username = 'demo-developer') => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/dev-mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username,
          name: 'Demo Lead Developer',
          email: `${username}@devpulse.io`,
        }),
      });

      if (!res.ok) {
        throw new Error('Simulation failed');
      }

      await refreshUser();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Simulation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organizations,
        loading,
        isAuthenticated: !!user,
        error,
        logout,
        refreshUser,
        devSimulateLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
