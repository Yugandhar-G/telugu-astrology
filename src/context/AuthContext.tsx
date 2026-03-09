'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types/user';

const VALID_USERS = [
  { email: 'yugandhargopu1@gmail.com', password: '123456', name: 'Yugandhar Gopu' },
];

const SESSION_KEY = 'astrology_session';

interface LocalUser {
  id: string;
  email: string;
  user_metadata: { full_name: string };
}

interface AuthContextType {
  user: LocalUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function makeUser(email: string, name: string): LocalUser {
  return { id: email, email, user_metadata: { full_name: name } };
}

function makeProfile(email: string, name: string): UserProfile {
  return {
    id: email,
    email,
    fullName: name,
    gender: null,
    birthDate: null,
    birthTime: null,
    birthPlace: null,
    birthLatitude: null,
    birthLongitude: null,
    timezone: 'Asia/Kolkata',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setProfile(parsed.profile);
      }
    } catch {
      // corrupted session — ignore
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const match = VALID_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) throw new Error('Invalid email or password');

    const localUser = makeUser(match.email, match.name);
    const localProfile = makeProfile(match.email, match.name);
    setUser(localUser);
    setProfile(localProfile);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: localUser, profile: localProfile }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function signUp(email: string, password: string, fullName?: string) {
    throw new Error('Registration is disabled. Please contact the administrator.');
  }

  async function signOut() {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(SESSION_KEY);
  }

  async function refreshProfile() {
    // no-op for local auth
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
