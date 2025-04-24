
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kkvqzujckeigjlxklsyp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdnF6dWpja2VpZ2pseGtsc3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTczNzQsImV4cCI6MjA2MTA5MzM3NH0.Ew74z5F1p5tFMnoQaebMAocvLfmnjrBNSTUhDoSk4Ck";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
