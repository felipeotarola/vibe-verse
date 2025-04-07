"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import SparklesBackground from "@/components/sparkles-background"
import ResumeTimeline from "@/components/resume-timeline"
import { useAuth } from "@/contexts/auth-context"
import { getResumeData, type ResumeData } from "@/app/actions/resume"
import Link from "next/link"

// Default CV data as fallback
const defaultResumeData = {
  education: [
    {
      id: "edu-1",
      title: "Master's in Computer Science",
      organization: "Stanford University",
      location: "California, USA",
      period: "2018 - 2020",
      description: "Specialized in Artificial Intelligence and Machine Learning. Graduated with honors.",
      skills: ["Machine Learning", "Neural Networks", "Computer Vision"],
      logo_url: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "edu-2",
      title: "Bachelor's in Software Engineering",
      organization: "MIT",
      location: "Massachusetts, USA",
      period: "2014 - 2018",
      description: "Focused on software architecture and development methodologies.",
      skills: ["Software Design", "Algorithms", "Data Structures"],
      logo_url: "/placeholder.svg?height=60&width=60",
    },
  ],
  experience: [
    {
      id: "exp-1",
      title: "Senior Software Engineer",
      organization: "Google",
      location: "Mountain View, CA",
      period: "2020 - Present",
      description:
        "Leading a team of developers working on next-generation AI applications. Responsible for architecture design and implementation of core features.",
      achievements: [
        "Launched 3 major product features with 99.9% uptime",
        "Reduced system latency by 40% through optimization",
        "Mentored 5 junior developers who were promoted to mid-level",
      ],
      logo_url: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "exp-2",
      title: "Software Developer",
      organization: "Microsoft",
      location: "Redmond, WA",
      period: "2018 - 2020",
      description: "Worked on cloud infrastructure and services. Developed scalable solutions for enterprise clients.",
      achievements: [
        "Implemented CI/CD pipeline reducing deployment time by 60%",
        "Contributed to open-source projects with over 1000 stars on GitHub",
        "Received 'Innovation Award' for developing an internal tool",
      ],
      logo_url: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "exp-3",
      title: "Software Engineering Intern",
      organization: "Amazon",
      location: "Seattle, WA",
      period: "Summer 2017",
      description: "Developed and optimized backend services for the e-commerce platform.",
      achievements: [
        "Implemented a recommendation algorithm that increased click-through rates by 15%",
        "Optimized database queries resulting in 30% faster page loads",
      ],
      logo_url: "/placeholder.svg?height=60&width=60",
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Programming Languages",
      items: [
        { name: "JavaScript/TypeScript", level: 95 },
        { name: "Python", level: 90 },
        { name: "Java", level: 85 },
        { name: "C++", level: 75 },
        { name: "Go", level: 70 },
      ],
    },
    {
      id: "skill-2",
      category: "Frameworks & Libraries",
      items: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "Node.js", level: 90 },
        { name: "TensorFlow", level: 80 },
        { name: "Django", level: 75 },
      ],
    },
    {
      id: "skill-3",
      category: "Tools & Technologies",
      items: [
        { name: "Git/GitHub", level: 95 },
        { name: "Docker", level: 90 },
        { name: "Kubernetes", level: 85 },
        { name: "AWS", level: 85 },
        { name: "CI/CD", level: 80 },
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      date: "2021",
      logo_url: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "cert-2",
      title: "Google Cloud Professional Data Engineer",
      organization: "Google Cloud",
      date: "2020",
      logo_url: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "cert-3",
      title: "TensorFlow Developer Certificate",
      organization: "Google",
      date: "2019",
      logo_url: "/placeholder.svg?height=60&width=60",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "AI-Powered Image Recognition System",
      description: "Developed a state-of-the-art image recognition system using deep learning techniques.",
      technologies: ["Python", "TensorFlow", "Computer Vision"],
      link: "https://github.com/username/image-recognition",
    },
    {
      id: "proj-2",
      title: "Scalable Microservices Architecture",
      description: "Designed and implemented a highly scalable microservices architecture for e-commerce applications.",
      technologies: ["Node.js", "Docker", "Kubernetes", "AWS"],
      link: "https://github.com/username/microservices-arch",
    },
  ],
}

export default function ResumePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isUserData, setIsUserData] = useState(false)

  useEffect(() => {
    async function loadResumeData() {
      if (user) {
        try {
          const data = await getResumeData(user.id)

          // Check if user has any resume data
          const hasData =
            data.education.length > 0 ||
            data.experience.length > 0 ||
            data.skills.length > 0 ||
            data.certifications.length > 0 ||
            data.projects.length > 0

          if (hasData) {
            setResumeData(data)
            setIsUserData(true)
          } else {
            // Use default data if user has no resume data
            setResumeData(defaultResumeData)
            setIsUserData(false)
          }
        } catch (error) {
          console.error("Error loading resume data:", error)
          setResumeData(defaultResumeData)
          setIsUserData(false)
        }
      } else {
        // Not logged in, use default data
        setResumeData(defaultResumeData)
        setIsUserData(false)
      }
      setIsLoadingData(false)
    }

    loadResumeData()
  }, [user])

  if (isLoading || isLoadingData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <SparklesBackground />
      <main className="min-h-screen text-white">
        <div className="container px-4 py-8 mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Resume</h1>
              <p className="mt-2 text-xl text-gray-300">My professional experience and skills</p>
            </div>

            {user && (
              <div className="mt-4 md:mt-0">
                <Link href="/resume/edit">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Edit Resume
                  </Button>
                </Link>
              </div>
            )}
          </header>

          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            {!isUserData && user && (
              <div className="mb-6 p-4 bg-purple-900/30 border border-purple-800/50 rounded-lg">
                <p className="text-purple-300">
                  You're currently viewing the default resume template. Click "Edit Resume" to create your own
                  personalized resume.
                </p>
              </div>
            )}

            <ResumeTimeline data={resumeData} />
          </div>
        </div>
      </main>
    </>
  )
}

