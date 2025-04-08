import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export function createClient(request: NextRequest) {
  // Create an unmodified response
  const response = NextResponse.next()

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.delete({
            name,
            ...options,
          })
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    },
  )

  return { supabase, response }
}
