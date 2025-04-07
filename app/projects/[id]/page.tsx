"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, Github, Edit, Trash2, AlertCircle, Code, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getProject, deleteProject, type Project } from "@/app/actions/projects"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import ProjectImageGallery from "@/components/project-image-gallery"
import { getProjectImages } from "@/app/actions/project-images"

// Define the tech stack for label lookup
const TECH_CATEGORIES = [
  {
    category: "Programming Languages",
    items: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
      { value: "php", label: "PHP" },
      { value: "ruby", label: "Ruby" },
      { value: "swift", label: "Swift" },
      { value: "kotlin", label: "Kotlin" },
      { value: "dart", label: "Dart" },
      { value: "r", label: "R" },
      { value: "scala", label: "Scala" },
      { value: "html", label: "HTML" },
      { value: "css", label: "CSS" },
      { value: "sql", label: "SQL" },
      { value: "shell", label: "Shell/Bash" },
      { value: "perl", label: "Perl" },
    ],
  },
  // Add other categories...
]

// Flatten the tech stack for lookup purposes
const FLAT_TECH_STACK = TECH_CATEGORIES.flatMap((category) => category.items)

export default function ProjectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [techStack, setTechStack] = useState<string[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [projectImages, setProjectImages] = useState<{ id?: string; image_url: string }[]>([])

  // New state for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          // Skip loading if the ID is "new" or "new-project" - these are special routes
          if (id === "new" || id === "new-project") {
            // Instead of redirecting, just set loading to false and return
            setIsLoadingProject(false)
            return
          }

          const projectData = await getProject(id)
          setProject(projectData)

          // Check if the current user is the owner of the project
          setIsOwner(user?.id === projectData.user_id)

          // Parse tech stack if it exists (check both tech_stack and languages for backward compatibility)
          if (projectData.tech_stack) {
            try {
              const parsedTechStack = JSON.parse(projectData.tech_stack)
              setTechStack(Array.isArray(parsedTechStack) ? parsedTechStack : [])
            } catch (e) {
              console.error("Error parsing tech stack:", e)
              setTechStack([])
            }
          } else if (projectData.languages) {
            try {
              const parsedLanguages = JSON.parse(projectData.languages)
              setTechStack(Array.isArray(parsedLanguages) ? parsedLanguages : [])
            } catch (e) {
              console.error("Error parsing languages:", e)
              setTechStack([])
            }
          }

          // Load project images
          console.log("Loading project images for ID:", id)
          const imagesData = await getProjectImages(id)
          console.log("Loaded project images:", imagesData)

          // If we have images, use them; otherwise, create an array with the main image
          if (imagesData && imagesData.length > 0) {
            setProjectImages(imagesData)
          } else if (projectData.image_url) {
            // If no additional images but we have a main image, use that
            setProjectImages([{ image_url: projectData.image_url }])
          } else {
            setProjectImages([])
          }

          setIsLoadingProject(false)
        } catch (error) {
          console.error("Error loading project:", error)
          setIsLoadingProject(false)
        }
      }
    }

    if (id && user) {
      loadData()
    }
  }, [id, router, user])

  const handleDeleteProject = async () => {
    console.log("handleDeleteProject function called")
    console.log("Current project:", project)

    if (!project) {
      console.error("Cannot delete: project is null")
      toast({
        title: "Error",
        description: "Cannot delete: project information is missing",
        variant: "destructive",
      })
      return
    }

    console.log(`Starting deletion process for project: ${project.id}`)
    setIsDeleting(true)

    try {
      console.log("Calling deleteProject server action")
      const result = await deleteProject(project.id)
      console.log("Delete result:", result)

      if (result.success) {
        toast({
          title: "Project deleted",
          description: "Your project has been successfully deleted from the database.",
        })
        console.log("Redirecting to dashboard")
        router.push("/dashboard")
      } else {
        console.error("Server returned error:", result.message)
        toast({
          title: "Error deleting project",
          description: result.message || "There was a problem deleting your project.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Exception during project deletion:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while deleting the project.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Helper function to get tech item label from value
  const getStackItemLabel = (value: string) => {
    const item = FLAT_TECH_STACK.find((item) => item.value === value)
    return item ? item.label : value
  }

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
  if (id === "new" || id === "new-project") {
    router.push("/projects/new-project")
    return null
  }

  if (!project) {
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

          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-white">Project Not Found</h1>
            <p className="mt-2 text-gray-300">
              The project you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/dashboard" className="mt-6">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    )
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

        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <ProjectImageGallery images={projectImages} className="w-full" />

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Created On</h3>
                  <p className="flex items-center mt-1 text-white">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>

                {project.category && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Category</h3>
                    <p className="mt-1">
                      <span className="inline-block px-2 py-1 text-sm font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                        {project.category}
                      </span>
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-400">Status</h3>
                  <p className="mt-1 capitalize text-white">{project.status}</p>
                </div>

                <div className="pt-4 flex flex-col space-y-3">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Project
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-md border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>

                {isOwner && (
                  <div className="flex space-x-2">
                    <Link href={`/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        console.log("Delete button clicked")
                        setShowDeleteConfirm(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                {project.description ? (
                  <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
                ) : (
                  <p className="text-gray-400 italic">No description provided</p>
                )}
              </div>

              {techStack.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-purple-400" />
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="px-3 py-1 bg-gray-700 text-gray-200 text-sm">
                        {getStackItemLabel(tech)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {project.is_shared && (
                <div className="mt-6 p-3 bg-purple-900/20 border border-purple-800 rounded-md">
                  <p className="text-purple-300 text-sm">
                    This project is publicly shared and visible on the Apps page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Confirm Deletion</h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  console.log("Confirm delete button clicked")
                  handleDeleteProject()
                }}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Project"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

