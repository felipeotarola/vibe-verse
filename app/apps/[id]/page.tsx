"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation" // Add useParams import
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AppScreenshots from "@/components/app-screenshots"
import { getProject, type Project } from "@/app/actions/projects"
import ProjectImageGallery from "@/components/project-image-gallery"
import { getProjectImages } from "@/app/actions/project-images"

// Import the QRCodeModal component at the top of the file
import QRCodeModal from "@/components/qr-code"

// Mock app data




export default function AppPage() {
  const params = useParams() // Use useParams hook
  const id = params.id as string // Extract id from params
  const [isLoading, setIsLoading] = useState(true)
  const [isProject, setIsProject] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [mockApp, setMockApp] = useState<any>(null)
  const [projectImages, setProjectImages] = useState<{ id?: string; image_url: string }[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const projectData = await getProject(id)

        // Only show the project if it's shared
        if (projectData && projectData.is_shared) {
          setProject(projectData)
          setIsProject(true)

          // Load project images
          const imagesData = await getProjectImages(id)

          // If we have images, use them; otherwise, create an array with the main image
          if (imagesData && imagesData.length > 0) {
            setProjectImages(imagesData)
          } else if (projectData.image_url) {
            // If no additional images but we have a main image, use that
            setProjectImages([{ image_url: projectData.image_url }])
          } else {
            setProjectImages([])
          }
        }
      } catch (error) {
        console.error("Error loading project:", error)
      }

      setIsLoading(false)
    }

    loadData()
  }, [id])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </main>
    )
  }

  // If neither a mock app nor a shared project was found
  if (!mockApp && !project) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <div className="container px-4 py-8 mx-auto">
          <Link href="/" className="inline-flex items-center mb-6 text-sm font-medium text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to VibeVerse
          </Link>

          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h1 className="text-2xl font-bold text-white">App Not Found</h1>
            <p className="mt-4 text-gray-300">The app you're looking for doesn't exist or isn't available.</p>
            <Link href="/apps" className="mt-6 inline-block">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Browse All Apps</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // For mock apps
  if (mockApp) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <div className="container px-4 py-8 mx-auto">
          <Link href="/" className="inline-flex items-center mb-6 text-sm font-medium text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to VibeVerse
          </Link>

          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="flex flex-col md:flex-row relative z-10">
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
                <div className="relative">
                  <img
                    src={mockApp.icon || "/placeholder.svg"}
                    alt={mockApp.name}
                    className="w-24 h-24 rounded-xl md:w-32 md:h-32 bg-gray-700"
                  />
                  <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full p-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-2xl font-bold text-white md:text-3xl">{mockApp.name}</h1>
                <p className="mt-1 text-sm text-gray-400">
                  {mockApp.developer} • {mockApp.category}
                </p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-sm font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                    {mockApp.category}
                  </span>
                </div>
                <div className="mt-4">
                  <a href={`https://app-${id}.copernic.dev`} target="_blank" rel="noopener noreferrer">
                    <Button className="px-8 py-2 text-white bg-purple-600 hover:bg-purple-700">Open App</Button>
                  </a>
                  <QRCodeModal url={`https://app-${id}.copernic.dev`} appName={mockApp.name} />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-white">Screenshots</h2>
              <AppScreenshots />
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-white">Description</h2>
              <p className="text-gray-300">{mockApp.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-white">Features</h2>
              <ul className="pl-5 space-y-2 list-disc text-gray-300">
                {mockApp.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Version</h3>
                <p className="mt-1 text-gray-300">{mockApp.version}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Size</h3>
                <p className="mt-1 text-gray-300">{mockApp.size}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Last Updated</h3>
                <p className="mt-1 text-gray-300">{mockApp.lastUpdated}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Compatibility</h3>
                <p className="mt-1 text-gray-300">{mockApp.compatibility}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-white">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {mockApp.languages.map((language: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-700 rounded-full text-gray-300 border border-gray-600"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // For shared projects
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container px-4 py-8 mx-auto">
        <Link href="/" className="inline-flex items-center mb-6 text-sm font-medium text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to VibeVerse
        </Link>

        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="flex flex-col md:flex-row relative z-10">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
              <div className="relative">
                <img
                  src={project?.image_url || "/placeholder.svg"}
                  alt={project?.name}
                  className="w-24 h-24 rounded-xl md:w-32 md:h-32 bg-gray-700 object-cover"
                />
                <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full p-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-white md:text-3xl">{project?.name}</h1>
              <p className="mt-1 text-sm text-gray-400">Felipe • {project?.category || "App"}</p>
              {project?.category && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-sm font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                    {project.category}
                  </span>
                </div>
              )}
              <div className="mt-4">
                {project?.url ? (
                  <>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <Button className="px-8 py-2 text-white bg-purple-600 hover:bg-purple-700">Open App</Button>
                    </a>
                    <QRCodeModal url={project.url} appName={project?.name || "App"} />
                  </>
                ) : (
                  <Button className="px-8 py-2 text-white bg-purple-600 hover:bg-purple-700" disabled>
                    App Unavailable
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-white">Screenshots</h2>
            {isProject ? <ProjectImageGallery images={projectImages} className="mb-4" /> : <AppScreenshots />}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-white">Description</h2>
            {project?.description ? (
              <p className="text-gray-300">{project.description}</p>
            ) : (
              <p className="text-gray-400 italic">No description available</p>
            )}
          </div>

          {/* Tech Stack section */}
          {project?.tech_stack && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-white">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  try {
                    const techStack = JSON.parse(project.tech_stack as string)
                    return techStack.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-gray-700 rounded-full text-gray-300 border border-gray-600"
                      >
                        {tech}
                      </span>
                    ))
                  } catch (e) {
                    return <p className="text-gray-400 italic">No technologies listed</p>
                  }
                })()}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Created</h3>
              <p className="mt-1 text-gray-300">
                {project?.created_at ? new Date(project.created_at).toLocaleDateString() : "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Last Updated</h3>
              <p className="mt-1 text-gray-300">
                {project?.updated_at ? new Date(project.updated_at).toLocaleDateString() : "Unknown"}
              </p>
            </div>
            {project?.github_url && (
              <div>
                <h3 className="text-sm font-medium text-gray-400">GitHub</h3>
                <p className="mt-1">
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    View Source Code
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
