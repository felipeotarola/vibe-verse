"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import AvatarUpload from "@/components/avatar-upload"
import { updateProfile, getProfile } from "@/app/actions/profile"

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

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        try {
          const profileData = await getProfile(user.id)
          setProfile(profileData)
          setUsername(profileData.username || "")
          setBio(profileData.bio || "")
          setIsLoadingProfile(false)
        } catch (error) {
          console.error("Error loading profile:", error)
          setIsLoadingProfile(false)
        }
      }
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append("userId", user.id)
      formData.append("username", username)
      formData.append("bio", bio)
      formData.append("email", user.email || "")

      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      formData.append("currentAvatarUrl", profile?.avatar_url || "")

      const result = await updateProfile(formData)

      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })

        // Refresh profile data
        const updatedProfile = await getProfile(user.id)
        setProfile(updatedProfile)
      } else {
        toast({
          title: "Error",
          description: result.message || "An error occurred while updating your profile.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || isLoadingProfile) {
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
          <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
          <p className="mt-2 text-gray-300">Manage your account settings and profile information</p>
        </header>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <AvatarUpload currentAvatarUrl={profile?.avatar_url || null} onAvatarChange={handleAvatarChange} />
                </div>

                <div className="flex-grow space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400">Your email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-700">
                <Button type="submit" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="p-6 mt-8 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Account Security</h2>

            <div className="space-y-6">
              <div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Change Password
                </Button>
              </div>

              <div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Enable Two-Factor Authentication
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Delete Account
                </Button>
                <p className="mt-2 text-xs text-gray-400">
                  This action is permanent and cannot be undone. All your data will be deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

