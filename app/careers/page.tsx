import { Button } from "@/components/ui/button"

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Machine Learning Researcher",
      department: "Research",
      location: "San Francisco, CA",
      type: "Full-time",
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Join Our Team</h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Help us build the future of AI-powered vibe apps
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-16">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              At Copernic, we're on a mission to create AI-powered applications that understand and enhance the human
              experience. We believe technology should adapt to humans, not the other way around.
            </p>
            <p className="text-gray-300">
              We're looking for passionate individuals who share our vision and want to make a meaningful impact on how
              people interact with technology.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Why Join Us?</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Work on cutting-edge AI technology</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Flexible remote work options</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Competitive salary and equity packages</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Comprehensive health benefits</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Professional development opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Collaborative and inclusive culture</span>
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
        <div className="space-y-4 mb-12">
          {openPositions.map((position, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-600 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{position.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                      {position.department}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                      {position.location}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                      {position.type}
                    </span>
                  </div>
                </div>
                <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white">Apply Now</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Don't see a position that fits?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and let us know how you
            can contribute to our mission.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Send General Application</Button>
        </div>
      </div>
    </main>
  )
}

