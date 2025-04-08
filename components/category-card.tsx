import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  name: string
  count: number
  icon: string
}

export default function CategoryCard({ name, count, icon }: CategoryCardProps) {
  return (
    <Link href={`/categories/${name.toLowerCase()}`}>
      <div className="p-6 transition-all duration-200 bg-gray-800 border rounded-xl hover:border-purple-700/50 hover:shadow-md hover:shadow-purple-900/20 border-gray-700 group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-900/30 border border-purple-800/50">
            <span className="text-lg font-semibold text-purple-400">{icon}</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
        </div>
        <h3 className="text-lg font-medium text-white">{name}</h3>
        <p className="mt-1 text-sm text-gray-400">{count} apps</p>
      </div>
    </Link>
  )
}
