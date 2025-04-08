"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { uploadAvatar } from "@/lib/blob"
import { nanoid } from "nanoid"

export interface EducationItem {
  id: string
  title: string
  organization: string
  location?: string
  period: string
  description: string
  skills?: string[]
  logo_url?: string
}

export interface ExperienceItem {
  id: string
  title: string
  organization: string
  location?: string
  period: string
  description: string
  achievements?: string[]
  logo_url?: string
  is_contract?: boolean
}

export interface SkillItem {
  name: string
  level: number
}

export interface SkillCategory {
  id: string
  name: string
  skills?: string[]
}

export interface CertificationItem {
  id: string
  title: string
  organization: string
  issue_date?: string
  expiration_date?: string
  credential_id?: string
  credential_url?: string
}

export interface ProjectItem {
  id: string
  title: string
  description: string
  link?: string
  skills?: string[]
}

export interface ResumeSettings {
  id: string
  user_id: string
  is_published: boolean
  public_url_slug: string | null
  created_at: string
  updated_at: string
}

export interface PublishedResume {
  id: string
  user_id: string
  user_name?: string | null
  public_url_slug: string | null
  updated_at: string
}

export interface ResumeData {
  education: EducationItem[]
  experience: ExperienceItem[]
  skills: SkillCategory[]
  certifications: CertificationItem[]
  projects: ProjectItem[]
  settings?: ResumeSettings
}

// Helper function to compare periods for sorting
function comparePeriods(a: string, b: string): number {
  // Extract end dates from periods (format: "Month Year - Month Year" or "Month Year - Present")
  const aEndPart = a.split(" - ")[1]?.trim() || ""
  const bEndPart = b.split(" - ")[1]?.trim() || ""

  // Present is always the most recent
  if (aEndPart === "Present" && bEndPart !== "Present") return -1
  if (aEndPart !== "Present" && bEndPart === "Present") return 1
  if (aEndPart === "Present" && bEndPart === "Present") {
    // If both are present, compare start dates
    const aStartPart = a.split(" - ")[0]?.trim() || ""
    const bStartPart = b.split(" - ")[0]?.trim() || ""
    return compareMonthYear(bStartPart, aStartPart) // Reverse order for start dates
  }

  // Compare end dates
  return compareMonthYear(bEndPart, aEndPart)
}

// Helper function to compare month-year strings
function compareMonthYear(a: string, b: string): number {
  const months = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  }

  const aParts = a.split(" ")
  const bParts = b.split(" ")

  const aYear = Number.parseInt(aParts[1] || "0", 10)
  const bYear = Number.parseInt(bParts[1] || "0", 10)

  if (aYear !== bYear) return aYear - bYear

  const aMonth = months[aParts[0] as keyof typeof months] || 0
  const bMonth = months[bParts[0] as keyof typeof months] || 0

  return aMonth - bMonth
}

async function getResumeSettings(userId: string): Promise<ResumeSettings | null> {
  try {
    const { data, error } = await supabase.from("resume_settings").select("*").eq("user_id", userId).single()

    if (error) {
      // If no settings exist, create default settings
      if (error.code === "PGRST116") {
        const newSettings = {
          user_id: userId,
          is_published: false,
          public_url_slug: nanoid(10),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: insertedData, error: insertError } = await supabase
          .from("resume_settings")
          .insert([newSettings])
          .select()
          .single()

        if (insertError) {
          console.error("Error creating resume settings:", insertError)
          return null
        }

        return insertedData as ResumeSettings
      }

      console.error("Error fetching resume settings:", error)
      return null
    }

    return data as ResumeSettings
  } catch (error) {
    console.error("Error fetching resume settings:", error)
    return null
  }
}

// Get all resume data for a user
export async function getResumeData(userId: string): Promise<ResumeData> {
  try {
    // Get education
    const { data: education } = await supabase.from("resume_education").select("*").eq("user_id", userId)

    // Sort education by period (newest first)
    const sortedEducation = education ? [...education].sort((a, b) => comparePeriods(a.period, b.period)) : []

    // Get experience
    const { data: experience } = await supabase.from("resume_experience").select("*").eq("user_id", userId)

    // Sort experience by period (newest first)
    const sortedExperience = experience ? [...experience].sort((a, b) => comparePeriods(a.period, b.period)) : []

    // Get skills
    const { data: skills } = await supabase
      .from("resume_skills")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Get certifications
    const { data: certifications } = await supabase
      .from("resume_certifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Get projects
    const { data: projects } = await supabase
      .from("resume_projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Get resume settings
    const settings = await getResumeSettings(userId)

    return {
      education: sortedEducation || [],
      experience: sortedExperience || [],
      skills: skills || [],
      certifications: certifications || [],
      projects: projects || [],
      settings: settings || undefined,
    }
  } catch (error) {
    console.error("Error fetching resume data:", error)
    return {
      education: [],
      experience: [],
      skills: [],
      certifications: [],
      projects: [],
    }
  }
}

// Get public resume data by slug
export async function getPublicResumeData(slug: string): Promise<ResumeData | null> {
  try {
    // Get settings to find the user ID
    const { data: settings, error: settingsError } = await supabase
      .from("resume_settings")
      .select("*")
      .eq("public_url_slug", slug)
      .single()

    if (settingsError || !settings) {
      console.error("Error fetching resume settings or resume not found:", settingsError)
      return null
    }

    // Explicitly check if the resume is published
    if (!settings.is_published) {
      console.log("Resume exists but is not published")
      return null
    }

    const userId = settings.user_id

    // Get education
    const { data: education } = await supabase.from("resume_education").select("*").eq("user_id", userId)

    // Sort education by period (newest first)
    const sortedEducation = education ? [...education].sort((a, b) => comparePeriods(a.period, b.period)) : []

    // Get experience
    const { data: experience } = await supabase.from("resume_experience").select("*").eq("user_id", userId)

    // Sort experience by period (newest first)
    const sortedExperience = experience ? [...experience].sort((a, b) => comparePeriods(a.period, b.period)) : []

    // Get skills
    const { data: skills } = await supabase
      .from("resume_skills")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Get certifications
    const { data: certifications } = await supabase
      .from("resume_certifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Get projects
    const { data: projects } = await supabase
      .from("resume_projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    return {
      education: sortedEducation || [],
      experience: sortedExperience || [],
      skills: skills || [],
      certifications: certifications || [],
      projects: projects || [],
      settings,
    }
  } catch (error) {
    console.error("Error fetching public resume data:", error)
    return null
  }
}

// Update resume publication status
export async function updateResumePublicationStatus(userId: string, isPublished: boolean) {
  try {
    // Get current settings
    const settings = await getResumeSettings(userId)

    // If no settings exist, they will be created by getResumeSettings
    if (!settings) {
      return {
        success: false,
        message: "Failed to update publication status. Please try again.",
      }
    }

    // Update settings
    const { error } = await supabase
      .from("resume_settings")
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (error) {
      console.error("Error updating resume publication status:", error)
      return {
        success: false,
        message: "Failed to update publication status. Please try again.",
      }
    }

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: isPublished ? "Resume published successfully" : "Resume unpublished",
    }
  } catch (error: any) {
    console.error("Error updating resume publication status:", error)
    return {
      success: false,
      message: error.message || "Failed to update publication status",
    }
  }
}

// Save education item
export async function saveEducation(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const organization = formData.get("organization") as string
    const location = formData.get("location") as string
    const period = formData.get("period") as string
    const description = formData.get("description") as string
    const skills = formData.get("skills") as string
    const logoFile = formData.get("logo") as File
    const currentLogoUrl = formData.get("currentLogoUrl") as string

    let logo_url = currentLogoUrl

    // Upload logo if provided
    if (logoFile && logoFile.size > 0) {
      const upload = await uploadAvatar(logoFile)
      if (upload.success) {
        logo_url = upload.url
      }
    }

    const skillsArray = skills ? skills.split(",").map((s) => s.trim()) : []

    const educationData = {
      user_id: userId,
      title,
      organization,
      location,
      period,
      description,
      skills: skillsArray,
      logo_url,
      updated_at: new Date().toISOString(),
    }

    let result

    if (id && id !== "new") {
      // Update existing education
      result = await supabase.from("resume_education").update(educationData).eq("id", id).eq("user_id", userId)
    } else {
      // Insert new education
      result = await supabase
        .from("resume_education")
        .insert([{ ...educationData, created_at: new Date().toISOString() }])
    }

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Education saved successfully",
    }
  } catch (error: any) {
    console.error("Error saving education:", error)
    return {
      success: false,
      message: error.message || "Failed to save education",
    }
  }
}

// Delete education item
export async function deleteEducation(id: string, userId: string) {
  try {
    await supabase.from("resume_education").delete().eq("id", id).eq("user_id", userId)

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Education deleted successfully",
    }
  } catch (error: any) {
    console.error("Error deleting education:", error)
    return {
      success: false,
      message: error.message || "Failed to delete education",
    }
  }
}

// Save experience item
export async function saveExperience(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const organization = formData.get("organization") as string
    const location = formData.get("location") as string
    const period = formData.get("period") as string
    const description = formData.get("description") as string
    const achievements = formData.get("achievements") as string
    const logoFile = formData.get("logo") as File
    const currentLogoUrl = formData.get("currentLogoUrl") as string
    const isContract = formData.get("is_contract") === "true"

    let logo_url = currentLogoUrl

    // Upload logo if provided
    if (logoFile && logoFile.size > 0) {
      const upload = await uploadAvatar(logoFile)
      if (upload.success) {
        logo_url = upload.url
      }
    }

    const achievementsArray = achievements ? achievements.split("\n").filter((a) => a.trim() !== "") : []

    const experienceData = {
      user_id: userId,
      title,
      organization,
      location,
      period,
      description,
      achievements: achievementsArray,
      logo_url,
      is_contract: isContract,
      updated_at: new Date().toISOString(),
    }

    let result

    if (id && id !== "new") {
      // Update existing experience
      result = await supabase.from("resume_experience").update(experienceData).eq("id", id).eq("user_id", userId)
    } else {
      // Insert new experience
      result = await supabase
        .from("resume_experience")
        .insert([{ ...experienceData, created_at: new Date().toISOString() }])
    }

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Experience saved successfully",
    }
  } catch (error: any) {
    console.error("Error saving experience:", error)
    return {
      success: false,
      message: error.message || "Failed to save experience",
    }
  }
}

// Delete experience item
export async function deleteExperience(id: string, userId: string) {
  try {
    await supabase.from("resume_experience").delete().eq("id", id).eq("user_id", userId)

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Experience deleted successfully",
    }
  } catch (error: any) {
    console.error("Error deleting experience:", error)
    return {
      success: false,
      message: error.message || "Failed to delete experience",
    }
  }
}

// Save skill category
export async function saveSkillCategory(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const skills = formData.get("skills") as string

    const skillsArray = skills ? skills.split(",").map((s) => s.trim()) : []

    const skillData = {
      user_id: userId,
      name,
      skills: skillsArray,
      updated_at: new Date().toISOString(),
    }

    let result

    if (id && id !== "new") {
      // Update existing skill category
      result = await supabase.from("resume_skills").update(skillData).eq("id", id).eq("user_id", userId)
    } else {
      // Insert new skill category
      result = await supabase.from("resume_skills").insert([{ ...skillData, created_at: new Date().toISOString() }])
    }

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Skills saved successfully",
    }
  } catch (error: any) {
    console.error("Error saving skills:", error)
    return {
      success: false,
      message: error.message || "Failed to save skills",
    }
  }
}

// Delete skill category
export async function deleteSkillCategory(id: string, userId: string) {
  try {
    await supabase.from("resume_skills").delete().eq("id", id).eq("user_id", userId)

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Skill category deleted successfully",
    }
  } catch (error: any) {
    console.error("Error deleting skill category:", error)
    return {
      success: false,
      message: error.message || "Failed to delete skill category",
    }
  }
}

// Save certification
export async function saveCertification(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const organization = formData.get("organization") as string
    const issue_date = formData.get("issue_date") as string
    const expiration_date = formData.get("expiration_date") as string
    const credential_id = formData.get("credential_id") as string
    const credential_url = formData.get("credential_url") as string

    const certificationData = {
      user_id: userId,
      title,
      organization,
      issue_date,
      expiration_date,
      credential_id,
      credential_url,
      updated_at: new Date().toISOString(),
    }

    let result

    if (id && id !== "new") {
      // Update existing certification
      result = await supabase.from("resume_certifications").update(certificationData).eq("id", id).eq("user_id", userId)
    } else {
      // Insert new certification
      result = await supabase
        .from("resume_certifications")
        .insert([{ ...certificationData, created_at: new Date().toISOString() }])
    }

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Certification saved successfully",
    }
  } catch (error: any) {
    console.error("Error saving certification:", error)
    return {
      success: false,
      message: error.message || "Failed to save certification",
    }
  }
}

// Delete certification
export async function deleteCertification(id: string, userId: string) {
  try {
    await supabase.from("resume_certifications").delete().eq("id", id).eq("user_id", userId)

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Certification deleted successfully",
    }
  } catch (error: any) {
    console.error("Error deleting certification:", error)
    return {
      success: false,
      message: error.message || "Failed to delete certification",
    }
  }
}

// Save project
export async function saveProject(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const link = formData.get("link") as string
    const skills = formData.get("skills") as string

    const skillsArray = skills ? skills.split(",").map((s) => s.trim()) : []

    const projectData = {
      user_id: userId,
      title,
      description,
      link,
      skills: skillsArray,
      updated_at: new Date().toISOString(),
    }

    let result

    if (id && id !== "new") {
      // Update existing project
      result = await supabase.from("resume_projects").update(projectData).eq("id", id).eq("user_id", userId)
    } else {
      // Insert new project
      result = await supabase.from("resume_projects").insert([{ ...projectData, created_at: new Date().toISOString() }])
    }

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Project saved successfully",
    }
  } catch (error: any) {
    console.error("Error saving project:", error)
    return {
      success: false,
      message: error.message || "Failed to save project",
    }
  }
}

// Delete project
export async function deleteProject(id: string, userId: string) {
  try {
    await supabase.from("resume_projects").delete().eq("id", id).eq("user_id", userId)

    revalidatePath("/resume")
    revalidatePath("/resume/edit")

    return {
      success: true,
      message: "Project deleted successfully",
    }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return {
      success: false,
      message: error.message || "Failed to delete project",
    }
  }
}

// Get all published resumes
export async function getPublishedResumes(): Promise<PublishedResume[]> {
  try {
    // Get all published resume settings
    const { data: settings, error } = await supabase
      .from("resume_settings")
      .select("*")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching published resumes:", error)
      return []
    }

    // Fetch user profiles separately
    const userIds = settings.map((setting) => setting.user_id)

    // Only fetch profiles if we have user IDs
    let userProfiles: Record<string, string> = {}

    if (userIds.length > 0) {
      // Use auth.users table directly instead of profiles
      const { data: users, error: usersError } = await supabase.from("users").select("id, email").in("id", userIds)

      if (!usersError && users) {
        // Create a map of user_id to email (as name)
        userProfiles = users.reduce((acc: Record<string, string>, user) => {
          acc[user.id] = user.email || "Anonymous User"
          return acc
        }, {})
      }
    }

    // Format the data to include user names
    return settings.map((setting) => ({
      id: setting.id,
      user_id: setting.user_id,
      user_name: userProfiles[setting.user_id] || "Anonymous User",
      public_url_slug: setting.public_url_slug,
      updated_at: setting.updated_at,
    }))
  } catch (error) {
    console.error("Error fetching published resumes:", error)
    return []
  }
}
