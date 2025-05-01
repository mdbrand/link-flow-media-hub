import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Read Supabase credentials from Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
