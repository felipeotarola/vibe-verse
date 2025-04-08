"use server"

import { supabase } from "@/lib/supabase"
import { uploadAvatar } from "@/lib/blob"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const username = formData.get("username") as string
    const bio = formData.get("bio") as string
    const email = formData.get("email") as string
    const avatarFile = formData.get("avatar") as File
    const currentAvatarUrl = formData.get("currentAvatarUrl") as string

    // Check if user exists in profiles
    const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    let avatarUrl = currentAvatarUrl

    // Upload new avatar if provided
    if (avatarFile && avatarFile.size > 0) {
      const upload = await uploadAvatar(avatarFile)
      if (upload.success) {
        avatarUrl = upload.url
      }
    }

    // Update or insert profile
    if (existingProfile) {
      // Update existing profile
      await supabase
        .from("profiles")
        .update({
          username,
          bio,
          email,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
    } else {
      // Insert new profile
      await supabase.from("profiles").insert([
        {
          id: userId,
          username,
          bio,
          email,
          avatar_url: avatarUrl,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_logged_in: new Date().toISOString(),
        },
      ])
    }

    // Update auth user metadata
    await supabase.auth.updateUser({
      data: {
        username,
        avatar_url: avatarUrl,
      },
    })

    revalidatePath("/profile")

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      message: error.message || "Failed to update profile",
    }
  }
}

export async function getProfile(userId: string) {
  try {
    // Try to get profile from profiles table
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      // If no profile exists, return basic user data
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        return {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email?.split("@")[0] || "",
          avatar_url: user.user_metadata?.avatar_url || null,
          bio: "",
          status: "active",
          created_at: user.created_at,
          updated_at: user.updated_at,
        }
      }

      throw new Error("User not found")
    }

    return profile
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}
