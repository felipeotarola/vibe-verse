"use server"

import { supabase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { uploadAvatar } from "@/lib/blob"

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
  category: string
  items: SkillItem[]
}

export interface CertificationItem {
  id: string
  title: string
  organization: string
  date: string
  logo_url?: string
}

export interface ProjectItem {
  id: string
  title: string
  description: string
  technologies: string[]
  link?: string
}

export interface ResumeData {
  education: EducationItem[]
  experience: ExperienceItem[]
  skills: SkillCategory[]
  certifications: CertificationItem[]
  projects: ProjectItem[]
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

    return {
      education: sortedEducation || [],
      experience: sortedExperience || [],
      skills: skills || [],
      certifications: certifications || [],
      projects: projects || [],
    }
  } catch (error) {
    console.error("Error fetching resume data:", error)
    throw error
  }
}

// Get public resume data (for the site owner)
export async function getPublicResumeData(): Promise<ResumeData> {
  console.log("=== getPublicResumeData called ===")

  try {
    // Owner user ID
    const ownerUserId = "5b2b648d-99aa-45f2-a525-8ed5a02bcf4e"
    console.log(`Fetching resume data for owner ID: ${ownerUserId}`)

    // Create an admin client using the service role key to bypass RLS
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    console.log("Created admin Supabase client to bypass RLS")

    // Get education
    const { data: education, error: educationError } = await supabaseAdmin
      .from("resume_education")
      .select("*")
      .eq("user_id", ownerUserId)

    if (educationError) {
      console.error("Error fetching education:", educationError)
    } else {
      console.log(`Found ${education?.length || 0} education items`)
    }

    // Sort education by period (newest first)
    const sortedEducation = education ? [...education].sort((a, b) => comparePeriods(a.period, b.period)) : []

    // Get experience
    const { data: experience, error: experienceError } = await supabaseAdmin
      .from("resume_experience")
      .select("*")
      .eq("user_id", ownerUserId)

    if (experienceError) {
      console.error("Error fetching experience:", experienceError)
    } else {
      console.log(`Found ${experience?.length || 0} experience items`)
    }

    // Sort experience by period (newest first)
    const sortedExperience = experience ? [...experience].sort((a, b) => comparePeriods(a.period, b.period)) : []

    // Get skills
    const { data: skills, error: skillsError } = await supabaseAdmin
      .from("resume_skills")
      .select("*")
      .eq("user_id", ownerUserId)
      .order("created_at", { ascending: false })

    if (skillsError) {
      console.error("Error fetching skills:", skillsError)
    } else {
      console.log(`Found ${skills?.length || 0} skill categories`)
    }

    // Get certifications
    const { data: certifications, error: certificationsError } = await supabaseAdmin
      .from("resume_certifications")
      .select("*")
      .eq("user_id", ownerUserId)
      .order("created_at", { ascending: false })

    if (certificationsError) {
      console.error("Error fetching certifications:", certificationsError)
    } else {
      console.log(`Found ${certifications?.length || 0} certifications`)
    }

    // Get projects
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from("resume_projects")
      .select("*")
      .eq("user_id", ownerUserId)
      .order("created_at", { ascending: false })

    if (projectsError) {
      console.error("Error fetching projects:", projectsError)
    } else {
      console.log(`Found ${projects?.length || 0} projects`)
    }

    // Check if we found any data
    const hasData =
      (sortedEducation && sortedEducation.length > 0) ||
      (sortedExperience && sortedExperience.length > 0) ||
      (skills && skills.length > 0) ||
      (certifications && certifications.length > 0) ||
      (projects && projects.length > 0)

    console.log(`Has data: ${hasData}`)

    // If no data is found, return empty arrays
    return {
      education: sortedEducation || [],
      experience: sortedExperience || [],
      skills: skills || [],
      certifications: certifications || [],
      projects: projects || [],
    }
  } catch (error) {
    console.error("Error fetching public resume data:", error)
    // Return empty data on error
    return {
      education: [],
      experience: [],
      skills: [],
      certifications: [],
      projects: [],
    }
  } finally {
    console.log("=== getPublicResumeData completed ===")
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

    // Fix this line to properly handle the checkbox value
    const isContract = formData.get("is_contract") === "on"

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
    const category = formData.get("category") as string
    const itemsJson = formData.get("items") as string

    let items: SkillItem[] = []
    try {
      items = JSON.parse(itemsJson)
    } catch (e) {
      console.error("Error parsing skill items:", e)
      items = []
    }

    const skillData = {
      user_id: userId,
      category,
      items,
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
    const date = formData.get("date") as string
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

    const certificationData = {
      user_id: userId,
      title,
      organization,
      date,
      logo_url,
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
    const technologies = formData.get("technologies") as string
    const link = formData.get("link") as string

    const technologiesArray = technologies ? technologies.split(",").map((t) => t.trim()) : []

    const projectData = {
      user_id: userId,
      title,
      description,
      technologies: technologiesArray,
      link,
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

