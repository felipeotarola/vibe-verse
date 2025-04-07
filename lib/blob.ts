import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function uploadAvatar(file: File) {
  try {
    // Validate file
    if (!file || file.size === 0) {
      console.error("Invalid file provided to uploadAvatar")
      return {
        url: null,
        success: false,
        error: "Invalid file provided",
      }
    }

    // Generate a unique filename
    const filename = `${nanoid()}-${file.name}`

    console.log(`Uploading file to Vercel Blob: ${filename} (${file.size} bytes)`)

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log(`File uploaded successfully: ${blob.url}`)

    return {
      url: blob.url,
      success: true,
    }
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    return {
      url: null,
      success: false,
      error,
    }
  }
}

