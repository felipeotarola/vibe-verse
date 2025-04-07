"use server"

import { supabase } from "@/lib/supabase"
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

// Get all resume data for a user
export async function getResumeData(userId: string): Promise<ResumeData> {
  try {
    // Get education
    const { data: education } = await supabase
      .from("resume_education")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Get experience
    const { data: experience } = await supabase
      .from("resume_experience")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

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
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      certifications: certifications || [],
      projects: projects || [],
    }
  } catch (error) {
    console.error("Error fetching resume data:", error)
    throw error
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

