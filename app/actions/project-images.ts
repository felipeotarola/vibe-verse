"use server"

import { supabase } from "@/lib/supabase"
import { uploadAvatar } from "@/lib/blob"
import { revalidatePath } from "next/cache"

export interface ProjectImage {
  id?: string
  project_id: string
  image_url: string
  display_order: number
  created_at?: string
  updated_at?: string
}

export async function getProjectImages(projectId: string) {
  console.log(`=== getProjectImages called for project ID: ${projectId} ===`)

  try {
    console.log(`Querying project_images table for project_id = ${projectId}`)

    // Query the project_images table directly
    const { data, error } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching project images:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} project images:`, data)
    return data as ProjectImage[]
  } catch (error) {
    console.error("Error in getProjectImages:", error)
    return []
  } finally {
    console.log(`=== getProjectImages completed for project ID: ${projectId} ===`)
  }
}

// Make sure the addProjectImage function is properly handling file uploads
export async function addProjectImage(projectId: string, imageFile: File, displayOrder: number) {
  console.log(`=== addProjectImage called for project ID: ${projectId} ===`)

  try {
    console.log(`Uploading image file (size: ${imageFile.size} bytes) with display order ${displayOrder}`)

    // Upload image to Vercel Blob
    const upload = await uploadAvatar(imageFile)
    console.log("Upload result:", upload)

    if (!upload.success || !upload.url) {
      console.error("Failed to upload image:", upload.error)
      throw new Error("Failed to upload image")
    }

    console.log(`Image uploaded successfully: ${upload.url}`)

    // Add image to project_images table
    console.log(`Inserting record into project_images table:`, {
      project_id: projectId,
      image_url: upload.url,
      display_order: displayOrder,
    })

    const insertResult = await supabase
      .from("project_images")
      .insert([
        {
          project_id: projectId,
          image_url: upload.url,
          display_order: displayOrder,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    console.log("Insert result:", insertResult)

    if (insertResult.error) {
      console.error("Error inserting project image:", insertResult.error)
      throw insertResult.error
    }

    console.log("Project image added successfully:", insertResult.data)

    revalidatePath(`/projects/${projectId}`)
    return insertResult.data as ProjectImage
  } catch (error) {
    console.error("Error adding project image:", error)
    throw error
  } finally {
    console.log(`=== addProjectImage completed for project ID: ${projectId} ===`)
  }
}

export async function updateProjectImageOrder(imageId: string, displayOrder: number) {
  console.log(`=== updateProjectImageOrder called for image ID: ${imageId} ===`)

  try {
    console.log(`Updating display order to ${displayOrder} for image ID ${imageId}`)

    const updateResult = await supabase
      .from("project_images")
      .update({
        display_order: displayOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", imageId)
      .select()
      .single()

    console.log("Update result:", updateResult)

    if (updateResult.error) {
      console.error("Error updating project image order:", updateResult.error)
      throw updateResult.error
    }

    console.log("Project image order updated successfully:", updateResult.data)
    return updateResult.data as ProjectImage
  } catch (error) {
    console.error("Error updating project image order:", error)
    throw error
  } finally {
    console.log(`=== updateProjectImageOrder completed for image ID: ${imageId} ===`)
  }
}

export async function deleteProjectImage(imageId: string, projectId: string) {
  console.log(`=== deleteProjectImage called for image ID: ${imageId}, project ID: ${projectId} ===`)

  try {
    console.log(`Deleting image with ID ${imageId}`)

    const deleteResult = await supabase.from("project_images").delete().eq("id", imageId)

    console.log("Delete result:", deleteResult)

    if (deleteResult.error) {
      console.error("Error deleting project image:", deleteResult.error)
      throw deleteResult.error
    }

    console.log(`Image ${imageId} deleted successfully`)

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting project image:", error)
    throw error
  } finally {
    console.log(`=== deleteProjectImage completed for image ID: ${imageId} ===`)
  }
}

