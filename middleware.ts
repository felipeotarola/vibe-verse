import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Skip middleware for PIN entry pages to avoid redirect loops
  if (request.nextUrl.pathname.startsWith("/resume/pin-entry/")) {
    console.log("PIN entry page, skipping middleware check")
    return response
  }

  // Only apply to resume public routes and main resume page
  if (!request.nextUrl.pathname.startsWith("/resume/public/") && request.nextUrl.pathname !== "/resume") {
    return response
  }

  // For the main resume page
  if (request.nextUrl.pathname === "/resume") {
    // Check if there's a published resume with PIN protection
    const { data: settings } = await supabase
      .from("resume_settings")
      .select("*")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (settings && settings.protection_mode === "pin_protected" && settings.pin_code) {
      // Check if PIN is provided in query params
      const pin = request.nextUrl.searchParams.get("pin")

      // If no PIN provided or incorrect PIN, redirect to PIN entry page
      if (!pin || pin !== settings.pin_code) {
        const url = new URL(`/resume/pin-entry/${settings.public_url_slug}`, request.url)
        if (pin && pin !== settings.pin_code) {
          url.searchParams.set("error", "true")
        }
        return NextResponse.redirect(url)
      }
    }

    return response
  }

  // For public resume pages
  // Extract the slug from the URL
  const slug = request.nextUrl.pathname.split("/").pop()
  if (!slug) {
    return response
  }

  console.log("Middleware checking resume protection for slug:", slug)

  try {
    // Get resume settings
    const { data: settings } = await supabase
      .from("resume_settings")
      .select("protection_mode, pin_code")
      .eq("public_url_slug", slug)
      .single()

    // If no settings or not PIN protected, continue
    if (!settings || settings.protection_mode !== "pin_protected" || !settings.pin_code) {
      console.log("Resume is not PIN protected, continuing")
      return response
    }

    console.log("Resume is PIN protected")

    // Check if PIN is provided in query params
    const pin = request.nextUrl.searchParams.get("pin")

    // If no PIN provided, redirect to PIN entry page
    if (!pin) {
      console.log("No PIN provided, redirecting to PIN entry page")
      const url = new URL(`/resume/pin-entry/${slug}`, request.url)
      return NextResponse.redirect(url)
    }

    // If PIN provided but incorrect, redirect to PIN entry page with error
    if (pin !== settings.pin_code) {
      console.log("Incorrect PIN provided, redirecting to PIN entry page with error")
      const url = new URL(`/resume/pin-entry/${slug}?error=true`, request.url)
      return NextResponse.redirect(url)
    }

    console.log("Correct PIN provided, continuing")
    return response
  } catch (error) {
    console.error("Error in middleware:", error)
    return response
  }
}

export const config = {
  matcher: ["/resume", "/resume/public/:path*", "/resume/pin-entry/:path*"],
}
