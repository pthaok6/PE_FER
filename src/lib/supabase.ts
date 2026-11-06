import { createClient } from "@supabase/supabase-js";

// Keep static builds possible when credentials are not present; authenticated
// requests still require the two public environment variables at runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

