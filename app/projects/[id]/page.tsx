"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, Github, Edit, Trash2, AlertCircle, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getProject, deleteProject, type Project } from "@/app/actions/projects"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  const { id } = useParams()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [project, setProject] = useState<Project | null>(null)
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [techStack, setTechStack] = useState<string[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [projectImages, setProjectImages] = useState<{ id?: string; image_url: string }[]>([])

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
            setIsLoadingProject(false)
            return
          }

          const projectData = await getProject(id as string)
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
          const imagesData = await getProjectImages(id as string)

          if (imagesData && imagesData.length > 0) {
            setProjectImages(imagesData)
          } else if (projectData.image_url) {
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
    if (!project) return

    setIsDeleting(true)

    try {
      const result = await deleteProject(project.id)

      if (result.success) {
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully.",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the project.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

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

  // Redirect if on "new" or "new-project" route
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
              <ProjectImageGallery
                images={projectImages}
                className="w-full"
              />

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

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            This action cannot be undone. This will permanently delete your project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteProject}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
    </main>
  )
}
