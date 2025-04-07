import { Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeaturedApp() {
  return (
    <div className="overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 border rounded-xl border-gray-700 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
        <div className="p-6 md:p-8">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="AI Music Mixer"
                className="w-16 h-16 rounded-xl bg-gray-700"
              />
              <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full p-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">AI Music Mixer</h3>
              <p className="mt-1 text-sm text-gray-400">Felipe • Entertainment</p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                  Entertainment
                </span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-gray-300">
            Create amazing music with AI assistance. Mix tracks, generate melodies, and produce professional-quality
            songs with just a few taps.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-purple-900/50 rounded-full text-purple-300 border border-purple-800/50">
              AI-Powered
            </span>
            <span className="px-3 py-1 text-xs bg-blue-900/50 rounded-full text-blue-300 border border-blue-800/50">
              Music Production
            </span>
            <span className="px-3 py-1 text-xs bg-green-900/50 rounded-full text-green-300 border border-green-800/50">
              Editor's Choice
            </span>
          </div>

          <div className="mt-6 flex space-x-4">
            <Link href="/apps/3">
              <Button variant="outline" className="px-4 py-2 border-purple-600 text-purple-400 hover:bg-purple-900/50">
                View Details
              </Button>
            </Link>
            <a href="https://app-3.copernic.dev" target="_blank" rel="noopener noreferrer">
              <Button className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700">Open App</Button>
            </a>
          </div>
        </div>

        <div className="relative h-64 overflow-hidden bg-gray-900 md:h-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent"></div>
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="AI Music Mixer Screenshot"
            className="object-cover w-full h-full opacity-80"
          />
        </div>
      </div>
    </div>
  )
}

