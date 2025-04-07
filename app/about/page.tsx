import { Github, Twitter, Linkedin, Mail, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import GitHubContributionGraph from "@/components/github-contribution-graph"
import SparklesBackground from "@/components/sparkles-background"

// GitHub username configuration - using your actual GitHub account
const GITHUB_USERNAME = "felipeotarola"

export default function AboutPage() {
  console.log("========== ABOUT PAGE DEBUGGING ==========")
  console.log(`About page rendering with GitHub username: ${GITHUB_USERNAME}`)
  console.log(`Current time: ${new Date().toISOString()}`)
  console.log("========== END ABOUT PAGE DEBUGGING ==========")

  return (
    <>
      <SparklesBackground />
      <main className="min-h-screen text-white">
        <div className="container px-4 py-8 mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">About Felipe's App Space</h1>
            <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
              Creating AI-powered web apps that enhance your digital experience
            </p>
          </header>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center lg:col-span-1">
              <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-purple-600">
                <img src="/placeholder.svg?height=200&width=200" alt="Felipe" className="object-cover w-full h-full" />
              </div>
              <h2 className="text-2xl font-bold text-white">Felipe</h2>
              <p className="mt-1 text-purple-400">Web Developer & AI Enthusiast</p>

              <div className="flex mt-4 space-x-3">
                <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-gray-700 hover:border-purple-600 hover:bg-gray-800"
                  >
                    <Github className="w-5 h-5 text-gray-300" />
                  </Button>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-gray-700 hover:border-purple-600 hover:bg-gray-800"
                  >
                    <Twitter className="w-5 h-5 text-gray-300" />
                  </Button>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-gray-700 hover:border-purple-600 hover:bg-gray-800"
                  >
                    <Linkedin className="w-5 h-5 text-gray-300" />
                  </Button>
                </a>
                <a href="mailto:contact@example.com">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-gray-700 hover:border-purple-600 hover:bg-gray-800"
                  >
                    <Mail className="w-5 h-5 text-gray-300" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">About Me</h3>
                <p className="text-gray-300 mb-4">
                  I'm Felipe, a passionate web developer and AI enthusiast. With over 5 years of experience in AI and
                  machine learning, I create applications that understand and enhance your digital experience.
                </p>
                <p className="text-gray-300 mb-4">
                  At Felipe's App Space, I believe that technology should adapt to humans, not the other way around. My
                  AI-powered web apps are designed to understand your unique preferences and provide personalized
                  experiences that make your digital life more enjoyable and productive.
                </p>
                <p className="text-gray-300">
                  When I'm not coding, you can find me exploring new AI research, contributing to open-source projects,
                  or writing about the future of technology on our blog.
                </p>
              </div>

              <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">GitHub Contributions</h3>
                  <Zap className="w-5 h-5 ml-2 text-purple-400" />
                </div>
                <p className="text-gray-300 mb-6">
                  I'm an active open-source contributor with a passion for building and sharing code. Here's a snapshot
                  of my GitHub activity:
                </p>
                <GitHubContributionGraph username={GITHUB_USERNAME} />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">My Mission</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-900/30 border border-purple-800/50">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Innovate</h3>
                <p className="text-gray-300">
                  I push the boundaries of what's possible with AI to create truly innovative applications.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-900/30 border border-purple-800/50">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Personalize</h3>
                <p className="text-gray-300">
                  I believe in technology that adapts to you, creating personalized experiences.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-900/30 border border-purple-800/50">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Empower</h3>
                <p className="text-gray-300">I create tools that empower people to do more and achieve their goals.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

