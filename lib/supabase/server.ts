import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

import type { Database } from "@/types/supabase"

import type { cookies } from "next/headers"

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return supabaseCreateClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (e) {
            console.error("Failed to set cookie:", e)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (e) {
            console.error("Failed to remove cookie:", e)
          }
        },
      },
    },
  )
}
