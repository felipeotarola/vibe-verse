import { Sparkles } from "lucide-react"
import Link from "next/link"

interface AppCardProps {
  id: string
  name: string
  developer: string
  category: string
  icon: string
  isProject?: boolean
  projectUrl?: string
}

export default function AppCard({ id, name, developer, category, icon, isProject = false, projectUrl }: AppCardProps) {
  return (
    <div className="overflow-hidden transition-all duration-200 bg-gray-800 border rounded-xl hover:shadow-md hover:shadow-purple-900/20 hover:border-purple-700/50 border-gray-700">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={icon || "/placeholder.svg"}
              alt={name}
              className="w-16 h-16 rounded-xl bg-gray-700 object-cover"
            />
            <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full p-0.5">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white truncate">{name}</h3>
            <p className="mt-1 text-xs text-gray-400 truncate">{developer}</p>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                {category}
              </span>
            </div>
            <div className="mt-3 flex space-x-3">
              {/* Always link to the apps route for both mock apps and shared projects */}
              <Link href={`/apps/${id}`} className="text-xs font-medium text-purple-400 hover:text-purple-300">
                Details
              </Link>

              {isProject && projectUrl ? (
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-purple-400 hover:text-purple-300"
                >
                  Open App
                </a>
              ) : (
                <a
                  href={`https://app-${id}.copernic.dev`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-purple-400 hover:text-purple-300"
                >
                  Open App
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
