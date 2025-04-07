import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Personal Productivity",
      excerpt: "Exploring how AI is transforming personal productivity tools and what to expect in the coming years.",
      date: "April 2, 2025",
      readTime: "5 min read",
      author: "Felipe",
      category: "AI Trends",
    },
    {
      id: 2,
      title: "Building Vibe-Aware Applications",
      excerpt:
        "A deep dive into the technology behind applications that can sense and adapt to user emotions and preferences.",
      date: "March 28, 2025",
      readTime: "8 min read",
      author: "Felipe",
      category: "Development",
    },
    {
      id: 3,
      title: "The Ethics of Emotion-Sensing AI",
      excerpt:
        "Examining the ethical considerations and privacy concerns around AI that can detect and respond to human emotions.",
      date: "March 15, 2025",
      readTime: "7 min read",
      author: "Felipe",
      category: "Ethics",
    },
    {
      id: 4,
      title: "From Concept to App Store: My Journey",
      excerpt:
        "The story of how I built and launched my first AI-powered vibe app and the lessons learned along the way.",
      date: "March 5, 2025",
      readTime: "6 min read",
      author: "Felipe",
      category: "Case Study",
    },
    {
      id: 5,
      title: "The Rise of Personalized AI Assistants",
      excerpt: "How AI assistants are becoming more personalized and the impact this has on user experience.",
      date: "February 20, 2025",
      readTime: "4 min read",
      author: "Felipe",
      category: "AI Trends",
    },
    {
      id: 6,
      title: "Optimizing AI Models for Mobile Devices",
      excerpt:
        "Technical strategies for running sophisticated AI models efficiently on resource-constrained mobile devices.",
      date: "February 10, 2025",
      readTime: "9 min read",
      author: "Felipe",
      category: "Technical",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white">Blog</h1>
          <p className="mt-2 text-gray-300">
            Insights, tutorials, and updates from the world of AI and vibe development
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <article className="h-full p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-600 transition-all duration-200">
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-400 mt-auto">
                  <div className="flex items-center mr-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

