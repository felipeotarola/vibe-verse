"use client"

import { getResumeData } from "@/app/actions/resume"
import { getUser } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeSettings } from "@/components/resume-settings"
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Plus,
  Trash2,
  Save,
  LockIcon,
  UnlockIcon,
} from "lucide-react"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

import {
  saveEducation,
  saveExperience,
  saveSkillCategory,
  saveCertification,
  deleteEducation,
  deleteExperience,
  deleteSkillCategory,
  deleteCertification,
} from "@/app/actions/resume"

export default async function ResumeEditPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login?next=/resume/edit")
  }

  const resumeData = await getResumeData(user.id)
  const settings = resumeData.settings || {
    id: "",
    user_id: user.id,
    is_published: false,
    public_url_slug: null,
    protection_mode: "public",
    pin_code: null,
    created_at: "",
    updated_at: "",
  }

  const [showPinDialog, setShowPinDialog] = useState(false)
  const { toast } = useToast()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Edit Resume</h1>
      <p className="text-muted-foreground mb-6">Customize your professional profile</p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <ResumeSettings
          userId={user.id}
          isPublished={settings.is_published}
          protectionMode={settings.protection_mode || "public"}
          pinCode={settings.pin_code}
        />

        {resumeData.settings?.is_published && (
          <div className="mt-4 p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
            <div className="flex flex-col space-y-4">
              <p className="text-purple-300 text-sm">
                Your resume is currently published and can be viewed by anyone with the link:
              </p>
              <div className="flex items-center gap-2">
                <input
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/resume/public/${resumeData.settings.public_url_slug}`}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white p-2 rounded w-full"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-600 text-purple-400 hover:bg-purple-900/50"
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Protection:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-gray-700 text-gray-300 hover:bg-gray-800 ${
                      resumeData.settings.protection_mode === "pin_protected" ? "bg-purple-900/20" : ""
                    }`}
                  >
                    {resumeData.settings.protection_mode === "pin_protected" ? (
                      <>
                        <LockIcon className="w-4 h-4 mr-2" />
                        PIN Protected
                      </>
                    ) : (
                      <>
                        <UnlockIcon className="w-4 h-4 mr-2" />
                        Public
                      </>
                    )}
                  </Button>
                </div>

                {resumeData.settings.protection_mode === "pin_protected" && (
                  <span className="text-xs text-gray-400">PIN: {resumeData.settings.pin_code}</span>
                )}
              </div>
            </div>
          </div>
        )}

        <Button asChild variant="outline">
          <Link href="/resume">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resume
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="education" className="w-full">
        <TabsList className="w-full flex justify-between p-0 bg-transparent border-b border-gray-700 mb-8">
          <TabsTrigger
            value="education"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-purple-900/70 data-[state=active]:text-white rounded-t-lg"
          >
            <GraduationCap className="w-4 h-4" />
            Education
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-purple-900/70 data-[state=active]:text-white rounded-t-lg"
          >
            <Briefcase className="w-4 h-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-purple-900/70 data-[state=active]:text-white rounded-t-lg"
          >
            <Code className="w-4 h-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-purple-900/70 data-[state=active]:text-white rounded-t-lg"
          >
            <Award className="w-4 h-4" />
            Certifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="mt-0">
          <EducationTabContent education={resumeData.education} userId={user.id} />
        </TabsContent>

        <TabsContent value="experience" className="mt-0">
          <ExperienceTabContent experience={resumeData.experience} userId={user.id} />
        </TabsContent>

        <TabsContent value="skills" className="mt-0">
          <SkillsTabContent skills={resumeData.skills} userId={user.id} />
        </TabsContent>

        <TabsContent value="certifications" className="mt-0">
          <CertificationsTabContent certifications={resumeData.certifications} userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Education Tab Component
function EducationTabContent({ education, userId }: { education: any[]; userId: string }) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localEducation, setLocalEducation] = useState(education)

  const onUpdate = (newEducation: any[]) => {
    setLocalEducation(newEducation)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Combine period start and end
      const startMonth = formData.get("period-start-month") as string
      const startYear = formData.get("period-start-year") as string
      const endMonth = formData.get("period-end-month") as string
      const endYear = (formData.get("period-end-year") as string) || "Present"

      const periodStart = `${startMonth} ${startYear}`
      const periodEnd = document.getElementById("edu-is-current")?.checked ? "Present" : `${endMonth} ${endYear}`
      const period = `${periodStart} - ${periodEnd}`

      // Remove the individual period fields and add the combined one
      formData.delete("period-start-month")
      formData.delete("period-start-year")
      formData.delete("period-end-month")
      formData.delete("period-end-year")
      formData.append("period", period)

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
      localEducation.find((item) => item.id === id) || {
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

  // Parse period into start and end components
  const parsePeriod = (period: string) => {
    const parts = period.split(" - ")
    const startParts = parts[0]?.trim().split(" ") || ["", ""]
    const endParts = parts[1]?.trim() === "Present" ? ["Present", ""] : parts[1]?.trim().split(" ") || ["", ""]

    return {
      startMonth: startParts[0] || "",
      startYear: startParts[1] || "",
      endMonth: endParts[0] === "Present" ? "" : endParts[0] || "",
      endYear: endParts[0] === "Present" ? "Present" : endParts[1] || "",
      isPresent: endParts[0] === "Present",
    }
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Education</h2>
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
                  <div className="relative">
                    <select
                      id="edu-location-select"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
                      onChange={(e) => {
                        const input = document.getElementById("location") as HTMLInputElement
                        if (input && e.target.value !== "custom") {
                          input.value = e.target.value
                        }
                      }}
                      defaultValue="custom"
                    >
                      <option value="custom">Custom location...</option>
                      <option value="Stockholm, Sweden">Stockholm, Sweden</option>
                      <option value="Oslo, Norway">Oslo, Norway</option>
                      <option value="Copenhagen, Denmark">Copenhagen, Denmark</option>
                      <option value="Helsinki, Finland">Helsinki, Finland</option>
                      <option value="London, UK">London, UK</option>
                      <option value="Berlin, Germany">Berlin, Germany</option>
                      <option value="Paris, France">Paris, France</option>
                      <option value="New York, USA">New York, USA</option>
                      <option value="San Francisco, USA">San Francisco, USA</option>
                      <option value="Remote">Remote</option>
                    </select>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={editingId ? getEducationItem(editingId).location : ""}
                      className="absolute inset-0 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter location"
                      onFocus={() => {
                        const select = document.getElementById("edu-location-select") as HTMLSelectElement
                        if (select) {
                          select.value = "custom"
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <div className="space-y-2">
                    {/* Start date with month and year */}
                    <div className="flex gap-2 items-center">
                      <Label className="w-10 text-xs">Start:</Label>
                      <select
                        id="edu-period-start-month"
                        name="period-start-month"
                        className="bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent flex-1"
                        defaultValue={editingId ? parsePeriod(getEducationItem(editingId).period).startMonth : ""}
                        required
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="edu-period-start-year"
                        name="period-start-year"
                        defaultValue={editingId ? parsePeriod(getEducationItem(editingId).period).startYear : ""}
                        required
                        placeholder="Year"
                        className="bg-gray-700 border-gray-600 w-24"
                      />
                    </div>

                    {/* End date with month and year */}
                    <div className="flex gap-2 items-center">
                      <Label className="w-10 text-xs">End:</Label>
                      <select
                        id="edu-period-end-month"
                        name="period-end-month"
                        className="bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent flex-1"
                        defaultValue={editingId ? parsePeriod(getEducationItem(editingId).period).endMonth : ""}
                        disabled={document.getElementById("edu-is-current")?.checked}
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="edu-period-end-year"
                        name="period-end-year"
                        defaultValue={
                          editingId
                            ? parsePeriod(getEducationItem(editingId).period).endYear === "Present"
                              ? ""
                              : parsePeriod(getEducationItem(editingId).period).endYear
                            : ""
                        }
                        placeholder="Year"
                        className="bg-gray-700 border-gray-600 w-24"
                        disabled={document.getElementById("edu-is-current")?.checked}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edu-is-current"
                        className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-purple-600 focus:ring-purple-600"
                        onChange={(e) => {
                          const endMonthSelect = document.getElementById("edu-period-end-month") as HTMLSelectElement
                          const endYearInput = document.getElementById("edu-period-end-year") as HTMLInputElement
                          if (endMonthSelect && endYearInput) {
                            endMonthSelect.disabled = e.target.checked
                            endYearInput.disabled = e.target.checked
                          }
                        }}
                        defaultChecked={editingId && parsePeriod(getEducationItem(editingId).period).isPresent}
                      />
                      <Label htmlFor="edu-is-current" className="text-sm text-gray-300">
                        Currently studying
                      </Label>
                    </div>
                  </div>
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

      {localEducation.length > 0 ? (
        <div className="space-y-4">
          {localEducation.map((item) => (
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
function ExperienceTabContent({ experience, userId }: { experience: any[]; userId: string }) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localExperience, setLocalExperience] = useState(experience)

  const onUpdate = (newExperience: any[]) => {
    setLocalExperience(newExperience)
  }

  // Modify the handleSubmit function to combine period start and end
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Combine period start and end
      const startMonth = formData.get("period-start-month") as string
      const startYear = formData.get("period-start-year") as string
      const endMonth = formData.get("period-end-month") as string
      const endYear = (formData.get("period-end-year") as string) || "Present"

      const periodStart = `${startMonth} ${startYear}`
      const periodEnd = document.getElementById("is-current")?.checked ? "Present" : `${endMonth} ${endYear}`
      const period = `${periodStart} - ${periodEnd}`

      // Remove the individual period fields and add the combined one
      formData.delete("period-start-month")
      formData.delete("period-start-year")
      formData.delete("period-end-month")
      formData.delete("period-end-year")
      formData.append("period", period)

      // Get the contract status
      const isContract = (document.getElementById("is-contract") as HTMLInputElement)?.checked || false
      formData.append("is_contract", isContract.toString())

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
      localExperience.find((item) => item.id === id) || {
        id: "new",
        title: "",
        organization: "",
        location: "",
        period: "",
        description: "",
        achievements: [],
        logo_url: "",
        is_contract: false,
      }
    )
  }

  // Parse period into start and end components
  const parsePeriod = (period: string) => {
    const parts = period.split(" - ")
    const startParts = parts[0]?.trim().split(" ") || ["", ""]
    const endParts = parts[1]?.trim() === "Present" ? ["Present", ""] : parts[1]?.trim().split(" ") || ["", ""]

    return {
      startMonth: startParts[0] || "",
      startYear: startParts[1] || "",
      endMonth: endParts[0] === "Present" ? "" : endParts[0] || "",
      endYear: endParts[0] === "Present" ? "Present" : endParts[1] || "",
      isPresent: endParts[0] === "Present",
    }
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Experience</h2>
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
                  <div className="relative">
                    <select
                      id="location-select"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
                      onChange={(e) => {
                        const input = document.getElementById("location") as HTMLInputElement
                        if (input && e.target.value !== "custom") {
                          input.value = e.target.value
                        }
                      }}
                      defaultValue="custom"
                    >
                      <option value="custom">Custom location...</option>
                      <option value="Stockholm, Sweden">Stockholm, Sweden</option>
                      <option value="Oslo, Norway">Oslo, Norway</option>
                      <option value="Copenhagen, Denmark">Copenhagen, Denmark</option>
                      <option value="Helsinki, Finland">Helsinki, Finland</option>
                      <option value="London, UK">London, UK</option>
                      <option value="Berlin, Germany">Berlin, Germany</option>
                      <option value="Paris, France">Paris, France</option>
                      <option value="New York, USA">New York, USA</option>
                      <option value="San Francisco, USA">San Francisco, USA</option>
                      <option value="Remote">Remote</option>
                    </select>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={editingId ? getExperienceItem(editingId).location : ""}
                      className="absolute inset-0 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:-transparent"
                      placeholder="Enter location"
                      onFocus={() => {
                        const select = document.getElementById("location-select") as HTMLSelectElement
                        if (select) {
                          select.value = "custom"
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <div className="space-y-2">
                    {/* Start date with month and year */}
                    <div className="flex gap-2 items-center">
                      <Label className="w-10 text-xs">Start:</Label>
                      <select
                        id="period-start-month"
                        name="period-start-month"
                        className="bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent flex-1"
                        defaultValue={editingId ? parsePeriod(getExperienceItem(editingId).period).startMonth : ""}
                        required
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="period-start-year"
                        name="period-start-year"
                        defaultValue={editingId ? parsePeriod(getExperienceItem(editingId).period).startYear : ""}
                        required
                        placeholder="Year"
                        className="bg-gray-700 border-gray-600 w-24"
                      />
                    </div>

                    {/* End date with month and year */}
                    <div className="flex gap-2 items-center">
                      <Label className="w-10 text-xs">End:</Label>
                      <select
                        id="period-end-month"
                        name="period-end-month"
                        className="bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent flex-1"
                        defaultValue={editingId ? parsePeriod(getExperienceItem(editingId).period).endMonth : ""}
                        disabled={document.getElementById("is-current")?.checked}
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="period-end-year"
                        name="period-end-year"
                        defaultValue={
                          editingId
                            ? parsePeriod(getExperienceItem(editingId).period).endYear === "Present"
                              ? ""
                              : parsePeriod(getExperienceItem(editingId).period).endYear
                            : ""
                        }
                        placeholder="Year"
                        className="bg-gray-700 border-gray-600 w-24"
                        disabled={document.getElementById("is-current")?.checked}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is-current"
                        className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-purple-600 focus:ring-purple-600"
                        onChange={(e) => {
                          const endMonthSelect = document.getElementById("period-end-month") as HTMLSelectElement
                          const endYearInput = document.getElementById("period-end-year") as HTMLInputElement
                          if (endMonthSelect && endYearInput) {
                            endMonthSelect.disabled = e.target.checked
                            endYearInput.disabled = e.target.checked
                          }
                        }}
                        defaultChecked={editingId && parsePeriod(getExperienceItem(editingId).period).isPresent}
                      />
                      <Label htmlFor="is-current" className="text-sm text-gray-300">
                        Current position
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-contract"
                    name="is_contract"
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-purple-600 focus:ring-purple-600"
                    defaultChecked={editingId ? !!getExperienceItem(editingId).is_contract : false}
                  />
                  <Label htmlFor="is-contract" className="text-sm text-gray-300">
                    This was a contract/consultant position
                  </Label>
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

      {localExperience.length > 0 ? (
        <div className="space-y-4">
          {localExperience.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                      {item.is_contract && <span className="ml-2 text-purple-400 text-sm">(Contract)</span>}
                    </h3>
                    <p className="text-gray-300">
                      {item.organization} {item.location ? `• ${item.location}` : ""}
                    </p>
                    <p className="text-purple-400 text-sm">{item.period}</p>
                    {item.description && <p className="text-gray-300 mt-2">{item.description}</p>}
                    {item.achievements && item.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">Achievements:</p>
                        <ul className="list-disc list-inside text-gray-300">
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
function SkillsTabContent({ skills, userId }: { skills: any[]; userId: string }) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localSkills, setLocalSkills] = useState(skills)

  const onUpdate = (newSkills: any[]) => {
    setLocalSkills(newSkills)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("userId", userId)

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
      console.error("Error saving skill category:", error)
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

  const getSkillCategoryItem = (id: string) => {
    return (
      localSkills.find((item) => item.id === id) || {
        id: "new",
        name: "",
        skills: [],
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
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
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingId ? getSkillCategoryItem(editingId).name : ""}
                  required
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  defaultValue={editingId ? getSkillCategoryItem(editingId).skills?.join(", ") : ""}
                  placeholder="e.g., Machine Learning, Data Analysis, Python"
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

      {localSkills.length > 0 ? (
        <div className="space-y-4">
          {localSkills.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.name}</h3>
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
          <p className="text-gray-400">You haven't added any skills yet.</p>
          <p className="mt-2 text-gray-400">Click the "Add Skill Category" button to get started.</p>
        </div>
      )}
    </div>
  )
}

// Certifications Tab Component
function CertificationsTabContent({ certifications, userId }: { certifications: any[]; userId: string }) {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localCertifications, setLocalCertifications] = useState(certifications)

  const onUpdate = (newCertifications: any[]) => {
    setLocalCertifications(newCertifications)
  }

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
      localCertifications.find((item) => item.id === id) || {
        id: "new",
        title: "",
        organization: "",
        issue_date: "",
        expiration_date: "",
        credential_id: "",
        credential_url: "",
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Certifications</h2>
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
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingId ? getCertificationItem(editingId).title : ""}
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
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
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    name="issue_date"
                    type="date"
                    defaultValue={editingId ? getCertificationItem(editingId).issue_date : ""}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiration_date">Expiration Date</Label>
                  <Input
                    id="expiration_date"
                    name="expiration_date"
                    type="date"
                    defaultValue={editingId ? getCertificationItem(editingId).expiration_date : ""}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_id">Credential ID</Label>
                <Input
                  id="credential_id"
                  name="credential_id"
                  defaultValue={editingId ? getCertificationItem(editingId).credential_id : ""}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  name="credential_url"
                  type="url"
                  defaultValue={editingId ? getCertificationItem(editingId).credential_url : ""}
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

      {localCertifications.length > 0 ? (
        <div className="space-y-4">
          {localCertifications.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-gray-300">{item.organization}</p>
                    {item.issue_date && <p className="text-purple-400 text-sm">Issue Date: {item.issue_date}</p>}
                    {item.expiration_date && (
                      <p className="text-purple-400 text-sm">Expiration Date: {item.expiration_date}</p>
                    )}
                    {item.credential_id && <p className="text-gray-300">Credential ID: {item.credential_id}</p>}
                    {item.credential_url && (
                      <p className="text-gray-300">
                        Credential URL:{" "}
                        <a
                          href={item.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:underline"
                        >
                          {item.credential_url}
                        </a>
                      </p>
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
          <p className="text-gray-400">You haven't added any certifications yet.</p>
          <p className="mt-2 text-gray-400">Click the "Add Certification" button to get started.</p>
        </div>
      )}
    </div>
  )
}
