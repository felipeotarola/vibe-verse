"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, GraduationCap, Award, Code, Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  getResumeData,
  saveEducation,
  saveExperience,
  saveSkillCategory,
  saveCertification,
  saveProject,
  deleteEducation,
  deleteExperience,
  deleteSkillCategory,
  deleteCertification,
  deleteProject,
  type ResumeData,
  type EducationItem,
  type ExperienceItem,
  type SkillCategory as SkillCategoryType,
  type CertificationItem,
  type ProjectItem,
  type SkillItem,
} from "@/app/actions/resume"
import Link from "next/link"

export default function ResumeEditPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [resumeData, setResumeData] = useState<ResumeData>({
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    projects: [],
  })
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState("education")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadResumeData() {
      if (user) {
        try {
          const data = await getResumeData(user.id)
          setResumeData(data)
        } catch (error) {
          console.error("Error loading resume data:", error)
          toast({
            title: "Error",
            description: "Failed to load resume data. Please try again.",
            variant: "destructive",
          })
        }
      }
      setIsLoadingData(false)
    }

    if (user) {
      loadResumeData()
    }
  }, [user, toast])

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

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Edit Resume</h1>
            <p className="mt-2 text-xl text-gray-300">Customize your professional profile</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/resume">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resume
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-800 border border-gray-700 mb-8">
              <TabsTrigger
                value="education"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Experience
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
              >
                <Code className="w-4 h-4 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="certifications"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
              >
                <Award className="w-4 h-4 mr-2" />
                Certifications
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
              >
                <Code className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="education" className="mt-0">
              <EducationTab
                education={resumeData.education}
                userId={user.id}
                onUpdate={(newEducation) => setResumeData({ ...resumeData, education: newEducation })}
              />
            </TabsContent>

            <TabsContent value="experience" className="mt-0">
              <ExperienceTab
                experience={resumeData.experience}
                userId={user.id}
                onUpdate={(newExperience) => setResumeData({ ...resumeData, experience: newExperience })}
              />
            </TabsContent>

            <TabsContent value="skills" className="mt-0">
              <SkillsTab
                skills={resumeData.skills}
                userId={user.id}
                onUpdate={(newSkills) => setResumeData({ ...resumeData, skills: newSkills })}
              />
            </TabsContent>

            <TabsContent value="certifications" className="mt-0">
              <CertificationsTab
                certifications={resumeData.certifications}
                userId={user.id}
                onUpdate={(newCertifications) => setResumeData({ ...resumeData, certifications: newCertifications })}
              />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <ProjectsTab
                projects={resumeData.projects}
                userId={user.id}
                onUpdate={(newProjects) => setResumeData({ ...resumeData, projects: newProjects })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

// Education Tab Component
function EducationTab({
  education,
  userId,
  onUpdate,
}: {
  education: EducationItem[]
  userId: string
  onUpdate: (education: EducationItem[]) => void
}) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("userId", userId)

      const result = await saveEducation(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Refresh data
        const updatedData = await getResumeData(userId)
        onUpdate(updatedData.education)

        // Reset form
        setIsAdding(false)
        setEditingId(null)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving education:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      setIsDeleting(true)

      try {
        const result = await deleteEducation(id, userId)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })

          // Refresh data
          const updatedData = await getResumeData(userId)
          onUpdate(updatedData.education)
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting education:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getEducationItem = (id: string) => {
    return (
      education.find((item) => item.id === id) || {
        id: "new",
        title: "",
        organization: "",
        location: "",
        period: "",
        description: "",
        skills: [],
        logo_url: "",
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Education</h2>
        <Button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isAdding || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {isAdding || editingId ? (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Education" : "Add Education"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingId || "new"} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Degree/Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingId ? getEducationItem(editingId).title : ""}
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Institution</Label>
                  <Input
                    id="organization"
                    name="organization"
                    defaultValue={editingId ? getEducationItem(editingId).organization : ""}
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingId ? getEducationItem(editingId).location : ""}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Input
                    id="period"
                    name="period"
                    defaultValue={editingId ? getEducationItem(editingId).period : ""}
                    required
                    placeholder="e.g., 2018 - 2022"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingId ? getEducationItem(editingId).description : ""}
                  rows={3}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  defaultValue={editingId ? getEducationItem(editingId).skills?.join(", ") : ""}
                  placeholder="e.g., Machine Learning, Data Analysis, Python"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentLogoUrl">Logo URL</Label>
                <Input
                  id="currentLogoUrl"
                  name="currentLogoUrl"
                  defaultValue={editingId ? getEducationItem(editingId).logo_url : ""}
                  placeholder="URL to institution logo"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setEditingId(null)
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {education.length > 0 ? (
        <div className="space-y-4">
          {education.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-gray-300">
                      {item.organization} {item.location ? `• ${item.location}` : ""}
                    </p>
                    <p className="text-purple-400 text-sm">{item.period}</p>
                    {item.description && <p className="text-gray-300 mt-2">{item.description}</p>}
                    {item.skills && item.skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">Skills:</p>
                        <p className="text-gray-300">{item.skills.join(", ")}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(item.id)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-lg border-gray-600">
          <p className="text-gray-400">You haven't added any education yet.</p>
          <p className="mt-2 text-gray-400">Click the "Add Education" button to get started.</p>
        </div>
      )}
    </div>
  )
}

// Experience Tab Component
function ExperienceTab({
  experience,
  userId,
  onUpdate,
}: {
  experience: ExperienceItem[]
  userId: string
  onUpdate: (experience: ExperienceItem[]) => void
}) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("userId", userId)

      const result = await saveExperience(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Refresh data
        const updatedData = await getResumeData(userId)
        onUpdate(updatedData.experience)

        // Reset form
        setIsAdding(false)
        setEditingId(null)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving experience:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience entry?")) {
      setIsDeleting(true)

      try {
        const result = await deleteExperience(id, userId)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })

          // Refresh data
          const updatedData = await getResumeData(userId)
          onUpdate(updatedData.experience)
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting experience:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getExperienceItem = (id: string) => {
    return (
      experience.find((item) => item.id === id) || {
        id: "new",
        title: "",
        organization: "",
        location: "",
        period: "",
        description: "",
        achievements: [],
        logo_url: "",
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <Button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isAdding || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {isAdding || editingId ? (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Experience" : "Add Experience"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingId || "new"} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingId ? getExperienceItem(editingId).title : ""}
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Company/Organization</Label>
                  <Input
                    id="organization"
                    name="organization"
                    defaultValue={editingId ? getExperienceItem(editingId).organization : ""}
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingId ? getExperienceItem(editingId).location : ""}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Input
                    id="period"
                    name="period"
                    defaultValue={editingId ? getExperienceItem(editingId).period : ""}
                    required
                    placeholder="e.g., 2020 - Present"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingId ? getExperienceItem(editingId).description : ""}
                  rows={3}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements (one per line)</Label>
                <Textarea
                  id="achievements"
                  name="achievements"
                  defaultValue={editingId ? getExperienceItem(editingId).achievements?.join("\n") : ""}
                  rows={4}
                  placeholder="e.g., Increased sales by 20%"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentLogoUrl">Logo URL</Label>
                <Input
                  id="currentLogoUrl"
                  name="currentLogoUrl"
                  defaultValue={editingId ? getExperienceItem(editingId).logo_url : ""}
                  placeholder="URL to company logo"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setEditingId(null)
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {experience.length > 0 ? (
        <div className="space-y-4">
          {experience.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-gray-300">
                      {item.organization} {item.location ? `• ${item.location}` : ""}
                    </p>
                    <p className="text-purple-400 text-sm">{item.period}</p>
                    {item.description && <p className="text-gray-300 mt-2">{item.description}</p>}
                    {item.achievements && item.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">Achievements:</p>
                        <ul className="list-disc pl-5 text-gray-300">
                          {item.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(item.id)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-lg border-gray-600">
          <p className="text-gray-400">You haven't added any experience yet.</p>
          <p className="mt-2 text-gray-400">Click the "Add Experience" button to get started.</p>
        </div>
      )}
    </div>
  )
}

// Skills Tab Component
function SkillsTab({
  skills,
  userId,
  onUpdate,
}: {
  skills: SkillCategoryType[]
  userId: string
  onUpdate: (skills: SkillCategoryType[]) => void
}) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [skillItems, setSkillItems] = useState<SkillItem[]>([])

  useEffect(() => {
    if (editingId) {
      const category = skills.find((item) => item.id === editingId)
      if (category) {
        setSkillItems(category.items || [])
      }
    } else {
      setSkillItems([{ name: "", level: 50 }])
    }
  }, [editingId, skills])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("userId", userId)
      formData.append("items", JSON.stringify(skillItems))

      const result = await saveSkillCategory(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Refresh data
        const updatedData = await getResumeData(userId)
        onUpdate(updatedData.skills)

        // Reset form
        setIsAdding(false)
        setEditingId(null)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving skills:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill category?")) {
      setIsDeleting(true)

      try {
        const result = await deleteSkillCategory(id, userId)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })

          // Refresh data
          const updatedData = await getResumeData(userId)
          onUpdate(updatedData.skills)
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting skill category:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getSkillCategory = (id: string) => {
    return (
      skills.find((item) => item.id === id) || {
        id: "new",
        category: "",
        items: [],
      }
    )
  }

  const addSkillItem = () => {
    setSkillItems([...skillItems, { name: "", level: 50 }])
  }

  const removeSkillItem = (index: number) => {
    setSkillItems(skillItems.filter((_, i) => i !== index))
  }

  const updateSkillItem = (index: number, field: keyof SkillItem, value: string | number) => {
    const newItems = [...skillItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setSkillItems(newItems)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <Button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
            setSkillItems([{ name: "", level: 50 }])
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isAdding || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill Category
        </Button>
      </div>

      {isAdding || editingId ? (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Skill Category" : "Add Skill Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingId || "new"} />

              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingId ? getSkillCategory(editingId).category : ""}
                  required
                  placeholder="e.g., Programming Languages"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Skills</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkillItem}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>

                {skillItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5">
                      <Input
                        value={item.name}
                        onChange={(e) => updateSkillItem(index, "name", e.target.value)}
                        placeholder="Skill name"
                        required
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <div className="flex items-center">
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={item.level}
                          onChange={(e) => updateSkillItem(index, "level", Number.parseInt(e.target.value))}
                          className="mr-2"
                        />
                        <span className="text-gray-300 w-10">{item.level}%</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkillItem(index)}
                        disabled={skillItems.length <= 1}
                        className="border-red-800 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setEditingId(null)
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {skills.length > 0 ? (
        <div className="space-y-4">
          {skills.map((category) => (
            <Card key={category.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <h3 className="text-xl font-semibold text-white mb-4">{category.category}</h3>
                    <div className="space-y-3">
                      {category.items.map((skill, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                          <div className="md:col-span-3">
                            <span className="text-gray-300">{skill.name}</span>
                          </div>
                          <div className="md:col-span-8">
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="md:col-span-1 text-right">
                            <span className="text-purple-400 text-sm">{skill.level}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(category.id)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-lg border-gray-600">
          <p className="text-gray-400">You haven't added any skill categories yet.</p>
          <p className="mt-2 text-gray-400">Click the "Add Skill Category" button to get started.</p>
        </div>
      )}
    </div>
  )
}

// Certifications Tab Component
function CertificationsTab({
  certifications,
  userId,
  onUpdate,
}: {
  certifications: CertificationItem[]
  userId: string
  onUpdate: (certifications: CertificationItem[]) => void
}) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("userId", userId)

      const result = await saveCertification(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Refresh data
        const updatedData = await getResumeData(userId)
        onUpdate(updatedData.certifications)

        // Reset form
        setIsAdding(false)
        setEditingId(null)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving certification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      setIsDeleting(true)

      try {
        const result = await deleteCertification(id, userId)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })

          // Refresh data
          const updatedData = await getResumeData(userId)
          onUpdate(updatedData.certifications)
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting certification:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getCertificationItem = (id: string) => {
    return (
      certifications.find((item) => item.id === id) || {
        id: "new",
        title: "",
        organization: "",
        date: "",
        logo_url: "",
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Certifications</h2>
        <Button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isAdding || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {isAdding || editingId ? (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Certification" : "Add Certification"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingId || "new"} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Certification Name</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingId ? getCertificationItem(editingId).title : ""}
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Issuing Organization</Label>
                  <Input
                    id="organization"
                    name="organization"
                    defaultValue={editingId ? getCertificationItem(editingId).organization : ""}
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    defaultValue={editingId ? getCertificationItem(editingId).date : ""}
                    required
                    placeholder="e.g., May 2021"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLogoUrl">Logo URL</Label>
                  <Input
                    id="currentLogoUrl"
                    name="currentLogoUrl"
                    defaultValue={editingId ? getCertificationItem(editingId).logo_url : ""}
                    placeholder="URL to certification logo"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setEditingId(null)
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {certifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-gray-300">{item.organization}</p>
                    <p className="text-purple-400 text-sm">{item.date}</p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(item.id)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-lg border-gray-600">
          <p className="text-gray-400">You haven't added any certifications yet.</p>
          <p className="mt-2 text-gray-400">Click the "Add Certification" button to get started.</p>
        </div>
      )}
    </div>
  )
}

// Projects Tab Component
function ProjectsTab({
  projects,
  userId,
  onUpdate,
}: {
  projects: ProjectItem[]
  userId: string
  onUpdate: (projects: ProjectItem[]) => void
}) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("userId", userId)

      const result = await saveProject(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Refresh data
        const updatedData = await getResumeData(userId)
        onUpdate(updatedData.projects)

        // Reset form
        setIsAdding(false)
        setEditingId(null)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setIsDeleting(true)

      try {
        const result = await deleteProject(id, userId)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })

          // Refresh data
          const updatedData = await getResumeData(userId)
          onUpdate(updatedData.projects)
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting project:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getProjectItem = (id: string) => {
    return (
      projects.find((item) => item.id === id) || {
        id: "new",
        title: "",
        description: "",
        technologies: [],
        link: "",
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <Button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isAdding || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isAdding || editingId ? (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingId || "new"} />

              <div className="space-y-2">
                <Label htmlFor="title">Project Name</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingId ? getProjectItem(editingId).title : ""}
                  required
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingId ? getProjectItem(editingId).description : ""}
                  rows={3}
                  required
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma separated)</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  defaultValue={editingId ? getProjectItem(editingId).technologies?.join(", ") : ""}
                  placeholder="e.g., React, Node.js, TypeScript"
                  required
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Project Link (optional)</Label>
                <Input
                  id="link"
                  name="link"
                  defaultValue={editingId ? getProjectItem(editingId).link : ""}
                  placeholder="e.g., https://github.com/username/project"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setEditingId(null)
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-gray-300 mt-2">{item.description}</p>
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-purple-400 hover:text-purple-300"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(item.id)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-lg border-gray-600">
          <p className="text-gray-400">You haven't added any projects yet.</p>
          <p className="mt-2 text-gray-400">Click the "Add Project" button to get started.</p>
        </div>
      )}
    </div>
  )
}

