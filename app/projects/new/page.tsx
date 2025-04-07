"use client"

import { useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProjectForm from "@/components/project-form"

function ProjectFormWrapper({ userId }: { userId: string }) {
  return (
    <div className="max-w-3xl">
      <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
        <ProjectForm userId={userId} />
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function NewProjectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="container px-4 py-8 mx-auto">
          <LoadingSpinner />
        </div>
      </main>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center mb-6 text-sm font-medium text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create New Project</h1>
          <p className="mt-2 text-gray-300">Add a new project to your portfolio</p>
        </header>

        <Suspense fallback={<LoadingSpinner />}>
          <ProjectFormWrapper userId={user.id} />
        </Suspense>
      </div>
    </main>
  )
}

