"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getProject, type Project } from "@/app/actions/projects"
import ProjectForm from "@/components/project-form"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoadingProject, setIsLoadingProject] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadProject() {
      try {
        // Skip loading if the ID is "new" or "new-project" - these are special routes
        if (params.id === "new" || params.id === "new-project") {
          // Instead of redirecting, just set loading to false and return
          setIsLoadingProject(false)
          return
        }

        const projectData = await getProject(params.id)
        setProject(projectData)
        setIsLoadingProject(false)
      } catch (error) {
        console.error("Error loading project:", error)
        setIsLoadingProject(false)
      }
    }

    if (params.id) {
      loadProject()
    }
  }, [params.id, router])

  if (isLoading || isLoadingProject) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </main>
    )
  }

  // If we're on the "new" or "new-project" route, render the new project page
  if (params.id === "new" || params.id === "new-project") {
    router.push("/projects/new")
    return null
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Project Not Found</h1>
              <p className="mt-2 text-gray-300">
                The project you're trying to edit doesn't exist or you don't have permission to edit it.
              </p>
              <Link href="/dashboard" className="mt-6 inline-block">
                <button className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center mb-6 text-sm font-medium text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Project
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Project</h1>
          <p className="mt-2 text-gray-300">Update your project details</p>
        </header>

        <div className="max-w-3xl">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <ProjectForm userId={user?.id || ""} project={project} isEditing={true} />
          </div>
        </div>
      </div>
    </main>
  )
}

