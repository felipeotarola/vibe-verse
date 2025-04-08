import CategoryCard from "@/components/category-card"

export default function CategoriesPage() {
  const categories = [
    { name: "Productivity", count: 12, icon: "P" },
    { name: "Creativity", count: 8, icon: "C" },
    { name: "Entertainment", count: 7, icon: "E" },
    { name: "Development", count: 5, icon: "D" },
    { name: "Health", count: 6, icon: "H" },
    { name: "Lifestyle", count: 9, icon: "L" },
    { name: "Education", count: 11, icon: "E" },
    { name: "Social", count: 15, icon: "S" },
    { name: "Utilities", count: 10, icon: "U" },
    { name: "Photography", count: 4, icon: "P" },
    { name: "Food", count: 3, icon: "F" },
    { name: "Travel", count: 5, icon: "T" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
          <p className="mt-2 text-gray-300">Browse apps by category to find exactly what you're looking for</p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} name={category.name} count={category.count} icon={category.icon} />
          ))}
        </div>
      </div>
    </main>
  )
}
