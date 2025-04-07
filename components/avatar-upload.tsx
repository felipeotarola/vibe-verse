"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  onAvatarChange: (file: File | null) => void
}

export default function AvatarUpload({ currentAvatarUrl, onAvatarChange }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
      setIsUploading(false)
      onAvatarChange(file)
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-purple-600 bg-gray-700">
        {previewUrl ? (
          <Image src={previewUrl || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-purple-400">
            {/* Display first letter of email or username */}?
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className="border-gray-600 text-gray-300 hover:bg-gray-700"
      >
        <Camera className="w-4 h-4 mr-2" />
        Change Avatar
      </Button>
    </div>
  )
}

