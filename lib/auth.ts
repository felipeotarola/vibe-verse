import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function getUser() {
  const supabase = createClient(cookies())
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}
