"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { getProjects, type Project } from "@/app/actions/projects"
import ProjectCard from "@/components/project-card"

export default function ProjectsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadProjects() {
      if (user) {
        try {
          const projectsData = await getProjects(user.id)
          setProjects(projectsData)
          setFilteredProjects(projectsData)
          setIsLoadingProjects(false)
        } catch (error) {
          console.error("Error loading projects:", error)
          setIsLoadingProjects(false)
        }
      }
    }

    if (user) {
      loadProjects()
    }
  }, [user])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          (project.description && project.description.toLowerCase().includes(query)) ||
          (project.category && project.category.toLowerCase().includes(query)),
      )
      setFilteredProjects(filtered)
    }
  }, [searchQuery, projects])

  if (isLoading || isLoadingProjects) {
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

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Projects</h1>
          <p className="mt-2 text-gray-300">Manage and showcase your portfolio</p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
            />
          </div>

          <Link href="/projects/new">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed rounded-lg border-gray-600">
            {searchQuery ? (
              <>
                <p className="text-gray-400">No projects match your search.</p>
                <p className="mt-2 text-gray-400">Try a different search term or clear the search.</p>
              </>
            ) : (
              <>
                <p className="text-gray-400">You don't have any projects yet.</p>
                <p className="mt-2 text-gray-400">Click the "New Project" button to get started.</p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
