// Server-side Supabase client for API routes

import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../constants/config';
import { NextRequest } from 'next/server';

export function createServerClient(request?: NextRequest) {
  // For API routes, we need to bridge nextjs cookies to supabase
  const supabase = createClient(
    APP_CONFIG.supabaseUrl,
    APP_CONFIG.supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        // Manual storage adapter to read cookies from request
        storage: request ? {
          getItem: (key: string) => {
            // 1. Try direct match
            const direct = request.cookies.get(key)?.value;
            if (direct) return direct;

            // 2. Try Supabase default pattern `sb-<ref>-auth-token`
            // Iterate to find a likely candidate if the specific key lookup fails.

            // If key is 'supabase.auth.token', look for any cookie starting with sb- and ending with -auth-token
            if (key === 'supabase.auth.token') {
              const all = request.cookies.getAll();
              const found = all.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
              if (found) return found.value;
            }

            return null;
          },
          setItem: (key, value) => {
            // Read-only in this context
          },
          removeItem: (key) => {
            // Read-only in this context
          },
        } : undefined,
      },
    }
  );

  return supabase;
}
