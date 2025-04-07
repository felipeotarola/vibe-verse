import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Log the initialization for debugging
console.log(`Initializing Supabase client with URL: ${supabaseUrl ? "URL exists" : "URL missing"}`)
console.log(`Anon key exists: ${supabaseAnonKey ? "Yes" : "No"}`)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

