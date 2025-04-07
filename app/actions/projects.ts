"use server"

import { supabase } from "@/lib/supabase"
import { uploadAvatar } from "@/lib/blob"
import { revalidatePath } from "next/cache"

// Update the Project interface to include is_shared
export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  image_url: string | null
  url: string | null
  github_url: string | null
  category: string | null
  tech_stack: string | null // Changed from languages to tech_stack
  languages?: string | null // Keep for backward compatibility
  status: string
  is_shared: boolean
  created_at: string
  updated_at: string
}

export async function getProjects(userId: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

export async function getProject(projectId: string) {
  try {
    // Return early if the ID is "new" or "new-project" - these are special routes
    if (projectId === "new" || projectId === "new-project") {
      throw new Error(`Invalid project ID: '${projectId}' is a reserved ID`)
    }

    const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single()

    if (error) {
      throw error
    }

    return data as Project
  } catch (error) {
    console.error("Error fetching project:", error)
    throw error
  }
}

export async function createProject(formData: FormData) {
  console.log("=== createProject server action started ===")

  try {
    const userId = formData.get("userId") as string
    if (!userId) {
      console.error("Missing userId in form data")
      return {
        success: false,
        message: "User ID is required",
      }
    }

    const name = formData.get("name") as string
    if (!name) {
      return {
        success: false,
        message: "Project name is required",
      }
    }

    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const githubUrl = formData.get("githubUrl") as string
    const category = formData.get("category") as string
    const techStack = formData.get("techStack") as string
    const mainImageFile = formData.get("mainImage") as File

    console.log("Form data extracted:", { userId, name, category, techStack })

    let imageUrl = null

    // Upload main project image if provided
    if (mainImageFile && mainImageFile.size > 0) {
      console.log("Uploading main image file")
      try {
        const upload = await uploadAvatar(mainImageFile)
        if (upload.success) {
          imageUrl = upload.url
          console.log("Main image uploaded successfully:", imageUrl)
        } else {
          console.error("Main image upload failed:", upload.error)
        }
      } catch (uploadError) {
        console.error("Error uploading main image:", uploadError)
      }
    }

    // Insert new project
    console.log("Inserting new project into database")
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          user_id: userId,
          name,
          description,
          image_url: imageUrl,
          url,
          github_url: githubUrl,
          category,
          tech_stack: techStack,
          languages: techStack, // For backward compatibility
          status: "active",
          is_shared: formData.get("isShared") === "true",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error when inserting project:", error)
      throw error
    }

    console.log("Project created successfully with ID:", data.id)

    // Handle additional images (screenshots)
    const additionalImagesJson = formData.get("additionalImages") as string
    console.log("Additional images JSON:", additionalImagesJson)

    if (additionalImagesJson) {
      try {
        const additionalImages = JSON.parse(additionalImagesJson)
        console.log(`Processing ${additionalImages.length} screenshots:`, additionalImages)

        // Process each screenshot
        for (let i = 0; i < additionalImages.length; i++) {
          const img = additionalImages[i]
          console.log(`Processing screenshot ${i + 1}:`, img)

          // Get the file using the correct key
          const imgFile = formData.get(`image_${i}`) as File
          console.log(
            `Image file ${i} exists:`,
            !!imgFile,
            imgFile ? `Size: ${imgFile.size} bytes, Type: ${imgFile.type}` : "No file",
          )

          if (imgFile && imgFile.size > 0) {
            console.log(`Uploading screenshot ${i + 1}`)
            try {
              // Upload the image
              const upload = await uploadAvatar(imgFile)
              console.log(`Upload result for screenshot ${i + 1}:`, upload)

              if (upload.success && upload.url) {
                console.log(`Screenshot ${i + 1} uploaded successfully:`, upload.url)

                // Add to project_images table
                console.log(`Inserting screenshot ${i + 1} into project_images table:`, {
                  project_id: data.id,
                  image_url: upload.url,
                  display_order: img.display_order || i,
                })

                const insertResult = await supabase.from("project_images").insert({
                  project_id: data.id,
                  image_url: upload.url,
                  display_order: img.display_order || i,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })

                console.log(`Insert result for screenshot ${i + 1}:`, insertResult)

                if (insertResult.error) {
                  console.error(`Error inserting screenshot ${i + 1}:`, insertResult.error)
                } else {
                  console.log(`Screenshot ${i + 1} saved to database successfully`)
                }
              } else {
                console.error(`Screenshot ${i + 1} upload failed:`, upload.error)
              }
            } catch (uploadError) {
              console.error(`Error uploading screenshot ${i + 1}:`, uploadError)
            }
          } else {
            console.log(`Skipping screenshot ${i + 1} - no file or empty file`)
          }
        }
      } catch (error) {
        console.error("Error processing screenshots:", error)
      }
    } else {
      console.log("No additional images to process")
    }

    console.log("Project creation completed successfully")

    revalidatePath("/dashboard")
    revalidatePath("/projects")

    return {
      success: true,
      message: "Project created successfully",
      project: data,
    }
  } catch (error: any) {
    console.error("Error creating project:", error)
    return {
      success: false,
      message: error.message || "Failed to create project",
    }
  } finally {
    console.log("=== createProject server action completed ===")
  }
}

export async function updateProject(formData: FormData) {
  console.log("=== updateProject server action started ===")

  try {
    const projectId = formData.get("projectId") as string
    if (!projectId) {
      console.error("Missing projectId in form data")
      return {
        success: false,
        message: "Project ID is required",
      }
    }

    console.log(`Updating project with ID: ${projectId}`)

    const name = formData.get("name") as string
    if (!name) {
      return {
        success: false,
        message: "Project name is required",
      }
    }

    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const githubUrl = formData.get("githubUrl") as string
    const category = formData.get("category") as string
    const techStack = formData.get("techStack") as string
    const status = formData.get("status") as string
    const mainImageFile = formData.get("mainImage") as File
    const currentImageUrl = formData.get("currentImageUrl") as string

    console.log("Form data extracted:", {
      projectId,
      name,
      category,
      techStack,
      status,
      hasMainImageFile: !!mainImageFile,
      currentImageUrl: currentImageUrl ? `${currentImageUrl.substring(0, 30)}...` : "none",
    })

    let imageUrl = currentImageUrl

    // Upload new main project image if provided
    if (mainImageFile && mainImageFile.size > 0) {
      console.log("Uploading new main image file")
      try {
        const upload = await uploadAvatar(mainImageFile)
        if (upload.success) {
          imageUrl = upload.url
          console.log("Main image updated successfully:", imageUrl)
        } else {
          console.error("Main image update failed:", upload.error)
        }
      } catch (uploadError) {
        console.error("Error uploading main image:", uploadError)
      }
    }

    // Update project
    console.log("Updating project in database")
    const { data, error } = await supabase
      .from("projects")
      .update({
        name,
        description,
        image_url: imageUrl,
        url,
        github_url: githubUrl,
        category,
        tech_stack: techStack,
        languages: techStack, // For backward compatibility
        status,
        is_shared: formData.get("isShared") === "true",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single()

    if (error) {
      console.error("Database error when updating project:", error)
      throw error
    }

    console.log("Project updated successfully")

    // Handle additional images (screenshots)
    const additionalImagesJson = formData.get("additionalImages") as string
    console.log("Additional images JSON:", additionalImagesJson)

    if (additionalImagesJson) {
      try {
        const additionalImages = JSON.parse(additionalImagesJson)
        console.log(`Processing ${additionalImages.length} screenshots for update:`, additionalImages)

        // Process each screenshot
        for (let i = 0; i < additionalImages.length; i++) {
          const img = additionalImages[i]
          console.log(`Processing screenshot ${i + 1}:`, img)

          // Get the file using the correct key
          const imgFile = formData.get(`image_${i}`) as File
          console.log(
            `Image file ${i} exists:`,
            !!imgFile,
            imgFile ? `Size: ${imgFile.size} bytes, Type: ${imgFile.type}` : "No file",
          )

          if (img.isNew && imgFile && imgFile.size > 0) {
            console.log(`Uploading new screenshot ${i + 1}`)
            try {
              // Upload the new image
              const upload = await uploadAvatar(imgFile)
              console.log(`Upload result for new screenshot ${i + 1}:`, upload)

              if (upload.success && upload.url) {
                console.log(`New screenshot ${i + 1} uploaded successfully:`, upload.url)

                // Add to project_images table
                console.log(`Inserting new screenshot ${i + 1} into project_images table:`, {
                  project_id: projectId,
                  image_url: upload.url,
                  display_order: img.display_order || i,
                })

                const insertResult = await supabase.from("project_images").insert({
                  project_id: projectId,
                  image_url: upload.url,
                  display_order: img.display_order || i,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })

                console.log(`Insert result for new screenshot ${i + 1}:`, insertResult)

                if (insertResult.error) {
                  console.error(`Error inserting new screenshot ${i + 1}:`, insertResult.error)
                } else {
                  console.log(`New screenshot ${i + 1} saved to database successfully`)
                }
              } else {
                console.error(`New screenshot ${i + 1} upload failed:`, upload.error)
              }
            } catch (uploadError) {
              console.error(`Error uploading new screenshot ${i + 1}:`, uploadError)
            }
          } else if (img.id) {
            // Update existing image order
            console.log(`Updating order for existing screenshot with ID ${img.id} to ${img.display_order}`)

            const updateResult = await supabase
              .from("project_images")
              .update({
                display_order: img.display_order,
                updated_at: new Date().toISOString(),
              })
              .eq("id", img.id)

            console.log(`Update result for screenshot ${img.id}:`, updateResult)

            if (updateResult.error) {
              console.error(`Error updating image order for screenshot ${img.id}:`, updateResult.error)
            } else {
              console.log(`Order updated successfully for screenshot ${img.id}`)
            }
          } else {
            console.log(`Skipping screenshot ${i + 1} - not new and no ID`)
          }
        }

        // Get current images from database to find deleted ones
        console.log(`Fetching current images for project ${projectId} to check for deletions`)
        const { data: currentImages, error: fetchError } = await supabase
          .from("project_images")
          .select("id")
          .eq("project_id", projectId)

        if (fetchError) {
          console.error("Error fetching current images:", fetchError)
        } else {
          console.log(`Found ${currentImages?.length || 0} existing images in database:`, currentImages)

          if (currentImages && currentImages.length > 0) {
            const currentIds = currentImages.map((img) => img.id)
            const updatedIds = additionalImages.filter((img) => img.id).map((img) => img.id)

            console.log("Current image IDs in database:", currentIds)
            console.log("Updated image IDs from form:", updatedIds)

            // Find IDs that exist in current but not in updated (these were deleted)
            const deletedIds = currentIds.filter((id) => !updatedIds.includes(id))
            console.log("IDs to delete:", deletedIds)

            // Delete removed images
            for (const id of deletedIds) {
              console.log(`Deleting removed screenshot ${id}`)
              const deleteResult = await supabase.from("project_images").delete().eq("id", id)

              console.log(`Delete result for screenshot ${id}:`, deleteResult)

              if (deleteResult.error) {
                console.error(`Error deleting screenshot ${id}:`, deleteResult.error)
              } else {
                console.log(`Screenshot ${id} deleted successfully`)
              }
            }
          }
        }
      } catch (error) {
        console.error("Error processing screenshots:", error)
      }
    } else {
      console.log("No additional images to process")
    }

    console.log("Project update completed successfully")

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    revalidatePath(`/projects/${projectId}`)

    return {
      success: true,
      message: "Project updated successfully",
      project: data,
    }
  } catch (error: any) {
    console.error("Error updating project:", error)
    return {
      success: false,
      message: error.message || "Failed to update project",
    }
  } finally {
    console.log("=== updateProject server action completed ===")
  }
}

export async function deleteProject(projectId: string) {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) {
      throw error
    }

    revalidatePath("/dashboard")
    revalidatePath("/projects")

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

// Add a new function to get shared projects
export async function getSharedProjects() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_shared", true)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data as Project[]
  } catch (error) {
    console.error("Error fetching shared projects:", error)
    return []
  }
}

// Add this function to get a shared project without requiring authentication
export async function getSharedProject(projectId: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("is_shared", true)
      .single()

    if (error) {
      throw error
    }

    return data as Project
  } catch (error) {
    console.error("Error fetching shared project:", error)
    throw error
  }
}

