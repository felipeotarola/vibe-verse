"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import SparklesBackground from "@/components/sparkles-background"
import ResumeTimeline from "@/components/resume-timeline"
import { useAuth } from "@/contexts/auth-context"
import { getResumeData, getPublicResumeData, type ResumeData } from "@/app/actions/resume"
import Link from "next/link"

// The owner's user ID - replace with your actual user ID
const OWNER_USER_ID = "5b2b648d-99aa-45f2-a525-8ed5a02bcf4e"

// Default CV data as fallback - only used if everything else fails
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
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isUserData, setIsUserData] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResumeData() {
      try {
        if (user) {
          // If user is logged in, check if they're the owner
          const isOwner = user.id === OWNER_USER_ID
          setIsOwner(isOwner)
          console.log(`User is logged in. User ID: ${user.id}, Is Owner: ${isOwner}`)

          if (isOwner) {
            // If the user is the owner, get their resume data
            console.log("Loading owner's resume data")
            const data = await getResumeData(user.id)

            // Check if owner has any resume data
            const hasData =
              data.education.length > 0 ||
              data.experience.length > 0 ||
              data.skills.length > 0 ||
              data.certifications.length > 0 ||
              data.projects.length > 0

            if (hasData) {
              console.log("Owner has resume data, using it")
              setResumeData(data)
              setIsUserData(true)
            } else {
              // Owner has no data, use default
              console.log("Owner has no resume data, using default")
              setResumeData(defaultResumeData)
              setIsUserData(false)
            }
          } else {
            // If not the owner, try to get the owner's public resume
            console.log("User is not the owner, fetching owner's public resume")
            try {
              const ownerData = await getPublicResumeData()

              // Check if we got any data back
              const hasOwnerData =
                ownerData.education.length > 0 ||
                ownerData.experience.length > 0 ||
                ownerData.skills.length > 0 ||
                ownerData.certifications.length > 0 ||
                ownerData.projects.length > 0

              if (hasOwnerData) {
                console.log("Found owner's public resume data")
                setResumeData(ownerData)
              } else {
                // If no owner data, check if the user has their own data
                console.log("No owner data found, checking if user has their own data")
                const userData = await getResumeData(user.id)

                const hasUserData =
                  userData.education.length > 0 ||
                  userData.experience.length > 0 ||
                  userData.skills.length > 0 ||
                  userData.certifications.length > 0 ||
                  userData.projects.length > 0

                if (hasUserData) {
                  console.log("User has their own resume data")
                  setResumeData(userData)
                  setIsUserData(true)
                } else {
                  // No user data either, use default
                  console.log("No user data found, using default")
                  setResumeData(defaultResumeData)
                  setIsUserData(false)
                }
              }
            } catch (error) {
              console.error("Error fetching owner's public resume:", error)
              // Try to get user's own data as fallback
              const userData = await getResumeData(user.id)
              if (userData && Object.values(userData).some((arr) => arr.length > 0)) {
                setResumeData(userData)
                setIsUserData(true)
              } else {
                setResumeData(defaultResumeData)
                setIsUserData(false)
              }
            }
          }
        } else {
          // Not logged in, show the owner's resume
          console.log("User not logged in, fetching public resume data")
          try {
            const data = await getPublicResumeData()
            console.log("Public resume data:", data)

            // Check if we got any data back
            const hasData =
              data.education.length > 0 ||
              data.experience.length > 0 ||
              data.skills.length > 0 ||
              data.certifications.length > 0 ||
              data.projects.length > 0

            if (hasData) {
              console.log("Found public resume data, using it")
              setResumeData(data)
            } else {
              // If no public data, fall back to default
              console.log("No public resume data found, using default")
              setResumeData(defaultResumeData)
              setLoadError("Could not load the owner's resume data. Using default template instead.")
            }
            setIsUserData(false)
          } catch (error) {
            console.error("Error fetching public resume:", error)
            setResumeData(defaultResumeData)
            setIsUserData(false)
            setLoadError("Error loading resume data. Using default template instead.")
          }
        }
      } catch (error) {
        console.error("Error in loadResumeData:", error)
        setResumeData(defaultResumeData)
        setIsUserData(false)
        setLoadError("An unexpected error occurred. Using default template instead.")
      } finally {
        setIsLoadingData(false)
      }
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

            {user && isOwner && (
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
            {loadError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-lg">
                <p className="text-red-300">{loadError}</p>
              </div>
            )}

            {!isUserData && user && isOwner && (
              <div className="mb-6 p-4 bg-purple-900/30 border border-purple-800/50 rounded-lg">
                <p className="text-purple-300">
                  You're currently viewing the default resume template. Click "Edit Resume" to create your own
                  personalized resume.
                </p>
              </div>
            )}

            {resumeData && <ResumeTimeline data={resumeData} />}
          </div>
        </div>
      </main>
    </>
  )
}

