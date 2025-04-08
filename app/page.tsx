import { Search, Sparkles } from "lucide-react"
import AppCard from "@/components/app-card"
import FeaturedApp from "@/components/featured-app"
import CategoryFilter from "@/components/category-filter"
import SparklesBackground from "@/components/sparkles-background"
import Link from "next/link"

// Import the getSharedProjects function at the top
import { getSharedProjects } from "@/app/actions/projects"

// Change the component to be async so we can fetch data
export default async function Home() {
  // Fetch shared projects from the database
  const sharedProjects = await getSharedProjects()

  // Keep the mock apps as fallback in case there are not enough shared projects
  const mockApps = [
    {
      id: "1",
      name: "Vibe Chat AI",
      developer: "Felipe",
      category: "Productivity",
      icon: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Mood Board Creator",
      developer: "Felipe",
      category: "Creativity",
      icon: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "AI Music Mixer",
      developer: "Felipe",
      category: "Entertainment",
      icon: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      name: "Smart Task Manager",
      developer: "Felipe",
      category: "Productivity",
      icon: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "5",
      name: "Voice Journal",
      developer: "Felipe",
      category: "Lifestyle",
      icon: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "6",
      name: "AI Code Assistant",
      developer: "Felipe",
      category: "Development",
      icon: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "7",
      name: "Photo Enhancer",
      developer: "Felipe",
      category: "Photography",
      icon: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "8",
      name: "Language Translator",
      developer: "Felipe",
      category: "Education",
      icon: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <>
      <SparklesBackground />
      <main className="min-h-screen text-white">
        <div className="container px-4 py-8 mx-auto">
          <header className="mb-8">
            <div className="flex items-center mb-2">
              <h1 className="text-4xl font-bold tracking-tight text-white">Felipe's App Space</h1>
              <div className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-purple-900 text-purple-300 border border-purple-700">
                by Felipe
              </div>
            </div>
            <p className="mt-2 text-lg text-gray-300">Explore AI-powered web apps created by Felipe</p>
          </header>

          <div className="relative mb-8">
            <div className="flex items-center w-full max-w-3xl px-4 border rounded-full bg-gray-800/50 border-gray-700">
              <Search className="w-5 h-5 mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for apps..."
                className="w-full py-3 bg-transparent border-none focus:outline-none text-white"
              />
            </div>
          </div>

          <section className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Featured App</h2>
              <Sparkles className="w-5 h-5 ml-2 text-purple-400" />
            </div>
            <FeaturedApp />
          </section>

          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Categories</h2>
              <a href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                View All
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              <CategoryFilter name="Productivity" count={12} />
              <CategoryFilter name="Creativity" count={8} />
              <CategoryFilter name="Social" count={15} />
              <CategoryFilter name="Utilities" count={10} />
              <CategoryFilter name="Entertainment" count={7} />
              <CategoryFilter name="Education" count={9} />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Popular Apps</h2>
              <Link href="/apps" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Display shared projects from database */}
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

              {/* If we have fewer than 8 shared projects, fill in with mock apps */}
              {sharedProjects.length < 8 &&
                mockApps
                  .slice(0, 8 - sharedProjects.length)
                  .map((app) => (
                    <AppCard
                      key={app.id}
                      id={app.id}
                      name={app.name}
                      developer={app.developer}
                      category={app.category}
                      icon={app.icon}
                    />
                  ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
