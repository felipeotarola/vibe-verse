"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function NewProjectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If auth is still loading, wait
    if (isLoading) return

    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/auth/login")
      return
    }

    // If user is logged in, redirect to the actual new project page
    router.push("/projects/new-project")
  }, [user, isLoading, router])

  // Return a minimal loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}
