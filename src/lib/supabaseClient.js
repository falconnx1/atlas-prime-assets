import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// Replace these with your Supabase project URL and Anon Key from supabase.com
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
