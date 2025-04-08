import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DevelopersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Developers</h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Join our community of vibe developers and create your own AI-powered apps
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">API Documentation</h2>
            <p className="text-gray-300 mb-6">
              Our comprehensive API documentation provides everything you need to integrate with our platform and build
              your own vibe apps.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">View Documentation</Button>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Developer Portal</h2>
            <p className="text-gray-300 mb-6">
              Access developer tools, manage your apps, and monitor performance in our developer portal.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign In to Portal</Button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-900/30 border border-purple-800/50">
                <span className="text-xl font-bold text-purple-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Register</h3>
              <p className="text-gray-300">Create a developer account to access our APIs and developer tools.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-900/30 border border-purple-800/50">
                <span className="text-xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Integrate</h3>
              <p className="text-gray-300">Use our SDKs and APIs to integrate vibe functionality into your app.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-900/30 border border-purple-800/50">
                <span className="text-xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Publish</h3>
              <p className="text-gray-300">Submit your app for review and publish it on VibeVerse.</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Resources</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <a
              href="#"
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-600 flex items-center justify-between group"
            >
              <span className="text-lg font-medium text-white">Sample Projects</span>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
            </a>
            <a
              href="#"
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-600 flex items-center justify-between group"
            >
              <span className="text-lg font-medium text-white">SDK Downloads</span>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
            </a>
            <a
              href="#"
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-600 flex items-center justify-between group"
            >
              <span className="text-lg font-medium text-white">API Reference</span>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
            </a>
            <a
              href="#"
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-600 flex items-center justify-between group"
            >
              <span className="text-lg font-medium text-white">Community Forum</span>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
