"use client"

import { useEffect, useState } from "react"
import { Search, Filter } from "lucide-react"
import AppCard from "@/components/app-card"
import { Button } from "@/components/ui/button"
import { getSharedProjects, type Project } from "@/app/actions/projects"

export default function AppsPage() {
  const [sharedProjects, setSharedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
    async function loadSharedProjects() {
      try {
        const projects = await getSharedProjects()
        setSharedProjects(projects)
      } catch (error) {
        console.error("Error loading shared projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSharedProjects()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">All Apps</h1>
          <p className="mt-2 text-gray-300">Explore all AI-powered vibe apps created by Felipe</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex items-center px-4 border rounded-full bg-gray-800/50 border-gray-700">
            <Search className="w-5 h-5 mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for apps..."
              className="w-full py-3 bg-transparent border-none focus:outline-none text-white"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        
          {/* Display shared projects */}
          {sharedProjects.map((project) => (
            <AppCard
              key={project.id}
              id={project.id}
              name={project.name}
              developer="Felipe"
              category={project.category || "Other"}
              icon={project.image_url || "/placeholder.svg?height=80&width=80"}
              isProject={true}
              projectUrl={project.url || undefined}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
