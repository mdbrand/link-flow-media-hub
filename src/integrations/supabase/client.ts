
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kkvqzujckeigjlxklsyp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "pk_live_Ya9MjRmW4Cwk6NOtXyFYSaLm";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
