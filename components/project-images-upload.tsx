"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, Loader2, X, Plus, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ProjectImage {
  id?: string
  image_url: string
  file?: File
  isNew?: boolean
  display_order: number
}

interface ProjectImagesUploadProps {
  images: ProjectImage[]
  onImagesChange: (images: ProjectImage[]) => void
  maxImages?: number
}

export default function ProjectImagesUpload({ images = [], onImagesChange, maxImages = 5 }: ProjectImagesUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Log when images prop changes
  useEffect(() => {
    console.log(
      `ProjectImagesUpload received ${images.length} images:`,
      images.map((img) => ({
        id: img.id,
        hasFile: !!img.file,
        isNew: img.isNew,
        display_order: img.display_order,
        image_url: img.image_url ? `${img.image_url.substring(0, 30)}...` : "none",
      })),
    )
  }, [images])

  // Improved handleFileChange function to ensure files are properly processed
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      console.log("No files selected in file input")
      return
    }

    console.log(`File input change: ${files.length} files selected`)
    setIsUploading(true)

    const newImages: ProjectImage[] = [...images]
    const startingOrder = newImages.length > 0 ? Math.max(...newImages.map((img) => img.display_order || 0)) + 1 : 0

    console.log(`Starting order for new images: ${startingOrder}`)

    // Process files one by one
    const processFiles = async () => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`Processing file ${i + 1}: ${file.name} (${file.size} bytes)`)

        // Create a promise that resolves with the data URL
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            console.log(`File ${i + 1} read successfully`)
            resolve(reader.result as string)
          }
          reader.onerror = () => {
            console.error(`Error reading file ${i + 1}`)
            resolve("")
          }
          reader.readAsDataURL(file)
        })

        if (dataUrl) {
          // IMPORTANT: Create a new File object to ensure it's properly serialized
          // Some browsers might have issues with the original File object
          const newFile = new File([file], file.name, { type: file.type })

          console.log(`Adding new image with display order ${startingOrder + i}`)
          console.log(`File details: name=${newFile.name}, size=${newFile.size}, type=${newFile.type}`)

          newImages.push({
            image_url: dataUrl,
            file: newFile,
            isNew: true,
            display_order: startingOrder + i,
          })
        }
      }

      console.log(`Processed ${files.length} files, new total: ${newImages.length} images`)
      console.log(
        "New images array:",
        newImages.map((img) => ({
          hasFile: !!img.file,
          fileSize: img.file?.size,
          isNew: img.isNew,
          display_order: img.display_order,
        })),
      )

      onImagesChange(newImages)
      setIsUploading(false)
    }

    processFiles()

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    console.log(`Removing image at index ${index}`)
    const newImages = [...images]
    const removedImage = newImages.splice(index, 1)[0]
    console.log(`Removed image:`, {
      id: removedImage.id,
      isNew: removedImage.isNew,
      display_order: removedImage.display_order,
    })
    console.log(`Remaining: ${newImages.length} images`)
    onImagesChange(newImages)
  }

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === images.length - 1)) {
      console.log(`Cannot move image ${index} ${direction}`)
      return
    }

    console.log(`Moving image at index ${index} ${direction}`)
    const newImages = [...images]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    // Swap display_order values
    console.log(`Swapping display order: ${newImages[index].display_order} <-> ${newImages[targetIndex].display_order}`)
    const tempOrder = newImages[index].display_order
    newImages[index].display_order = newImages[targetIndex].display_order
    newImages[targetIndex].display_order = tempOrder

    // Swap positions in array
    console.log(`Swapping array positions: ${index} <-> ${targetIndex}`)
    ;[newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]

    console.log(
      `After move:`,
      newImages.map((img, i) => ({
        index: i,
        id: img.id,
        display_order: img.display_order,
      })),
    )

    onImagesChange(newImages)
  }

  const handleButtonClick = () => {
    console.log("Upload button clicked")
    fileInputRef.current?.click()
  }

  const canAddMoreImages = images.length < maxImages

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="relative h-48 overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800">
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={`Project screenshot ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-1 bg-red-600 rounded-full text-white opacity-80 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <button
                type="button"
                onClick={() => handleMoveImage(index, "up")}
                disabled={index === 0}
                className={`p-1 bg-gray-800 rounded-full text-white opacity-80 hover:opacity-100 ${
                  index === 0 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveImage(index, "down")}
                disabled={index === images.length - 1}
                className={`p-1 bg-gray-800 rounded-full text-white opacity-80 hover:opacity-100 ${
                  index === images.length - 1 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {canAddMoreImages && (
          <div
            className="relative h-48 overflow-hidden rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 flex items-center justify-center cursor-pointer hover:border-purple-600 transition-colors"
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center text-gray-400">
              <Plus className="w-10 h-10 mb-2" />
              <span className="text-sm">Add Screenshot</span>
              <span className="text-xs mt-1 text-gray-500">
                {images.length} / {maxImages}
              </span>
            </div>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin mr-2" />
          <span className="text-sm text-gray-300">Uploading...</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        multiple={canAddMoreImages}
        disabled={!canAddMoreImages || isUploading}
      />

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          disabled={!canAddMoreImages || isUploading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {images.length > 0 ? "Add More Screenshots" : "Upload Screenshots"}
        </Button>

        <span className="text-xs text-gray-400">
          {images.length} of {maxImages} screenshots
        </span>
      </div>
    </div>
  )
}

