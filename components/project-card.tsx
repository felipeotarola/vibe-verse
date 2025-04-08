import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github, Calendar, Code } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/app/actions/projects"

interface ProjectCardProps {
  project: Project
}

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

export default function ProjectCard({ project }: ProjectCardProps) {
  // Parse tech stack if it exists (check both tech_stack and languages for backward compatibility)
  let techStack: string[] = []
  if (project.tech_stack) {
    try {
      const parsedTechStack = JSON.parse(project.tech_stack)
      techStack = Array.isArray(parsedTechStack) ? parsedTechStack : []
    } catch (e) {
      console.error("Error parsing tech stack:", e)
    }
  } else if (project.languages) {
    try {
      const parsedLanguages = JSON.parse(project.languages)
      techStack = Array.isArray(parsedLanguages) ? parsedLanguages : []
    } catch (e) {
      console.error("Error parsing languages:", e)
    }
  }

  // Helper function to get tech item label from value
  const getStackItemLabel = (value: string) => {
    const item = FLAT_TECH_STACK.find((item) => item.value === value)
    return item ? item.label : value
  }

  // Get top 3 tech items to display
  const displayTechStack = techStack.slice(0, 3)
  const hasMoreTech = techStack.length > 3

  return (
    <div className="overflow-hidden transition-all duration-200 bg-gray-800 border rounded-xl hover:shadow-md hover:shadow-purple-900/20 hover:border-purple-700/50 border-gray-700">
      <div className="relative h-48 overflow-hidden bg-gray-900">
        {project.image_url ? (
          <Image src={project.image_url || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-800">
            <span className="text-2xl font-bold text-gray-600">{project.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{project.name}</h3>
            {project.category && (
              <span className="inline-block px-2 py-1 mt-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                {project.category}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
                title="Visit Project"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {project.description && <p className="mt-2 text-sm text-gray-300 line-clamp-2">{project.description}</p>}

        {displayTechStack.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {displayTechStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300">
                  {getStackItemLabel(tech)}
                </Badge>
              ))}
              {hasMoreTech && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300">
                  +{techStack.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>

          <Link href={`/projects/${project.id}`} className="text-xs font-medium text-purple-400 hover:text-purple-300">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
