import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // If the path is exactly "/projects/new", redirect to the dedicated new project page
  if (path === "/projects/new") {
    // Create a new URL for the redirect destination
    const url = new URL("/projects/new-project", request.url)
    return NextResponse.redirect(url)
  }

  // For other routes, continue normal processing
  return NextResponse.next()
}

export const config = {
  matcher: ["/projects/:path*"],
}
