"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Plus, User, Settings, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getProfile } from "@/app/actions/profile"
import { getProjects, type Project } from "@/app/actions/projects"
import ProjectCard from "@/components/project-card"

interface Profile {
  id: string
  username: string
  email: string
  bio: string
  avatar_url: string | null
  status: string
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          // Load profile
          const profileData = await getProfile(user.id)
          setProfile(profileData)
          setIsLoadingProfile(false)

          // Load projects
          const projectsData = await getProjects(user.id)
          setProjects(projectsData)
          setIsLoadingProjects(false)
        } catch (error) {
          console.error("Error loading data:", error)
          setIsLoadingProfile(false)
          setIsLoadingProjects(false)
        }
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  if (isLoading || isLoadingProfile || isLoadingProjects) {
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

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Dashboard</h1>
          <p className="mt-2 text-gray-300">Manage your projects and account</p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-2">
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">My Projects</h2>
                <Link href="/projects/new">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed rounded-lg border-gray-600">
                  <p className="text-gray-400">You don't have any projects yet.</p>
                  <p className="mt-2 text-gray-400">Click the "New Project" button to get started.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Profile</h2>
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 mb-3 overflow-hidden rounded-full border-4 border-purple-600 bg-gray-700">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt={profile.username || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-purple-400">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white">{profile?.username || user.email?.split("@")[0]}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              {profile?.bio && (
                <div className="mb-4">
                  <p className="text-sm text-gray-300">{profile.bio}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-white flex items-center">
                    <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-500"></span>
                    {profile?.status || "Active"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Account Created</p>
                  <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Projects</p>
                  <p className="text-white">{projects.length}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/profile">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/resume/edit">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Edit Resume
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
