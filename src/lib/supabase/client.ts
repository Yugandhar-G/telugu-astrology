// Supabase client setup

import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../constants/config';

const supabaseUrl = APP_CONFIG.supabaseUrl;
const supabaseAnonKey = APP_CONFIG.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
