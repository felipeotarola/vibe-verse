interface CategoryFilterProps {
  name: string
  count: number
}

export default function CategoryFilter({ name, count }: CategoryFilterProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 transition-all duration-200 bg-gray-800 border rounded-xl hover:border-purple-700/50 hover:shadow-md hover:shadow-purple-900/20 border-gray-700">
      <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-purple-900/30 border border-purple-800/50">
        <span className="text-lg font-semibold text-purple-400">{name.charAt(0)}</span>
      </div>
      <h3 className="text-sm font-medium text-white">{name}</h3>
      <p className="mt-1 text-xs text-gray-400">{count} apps</p>
    </div>
  )
}

