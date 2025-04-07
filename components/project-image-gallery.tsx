"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectImageGalleryProps {
  images: { id?: string; image_url: string }[]
  className?: string
}

export default function ProjectImageGallery({ images, className = "" }: ProjectImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Log images for debugging
  useEffect(() => {
    console.log("ProjectImageGallery received images:", images)
  }, [images])

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`relative h-64 overflow-hidden rounded-lg bg-gray-900 ${className}`}>
        <div className="flex items-center justify-center w-full h-full bg-gray-800">
          <span className="text-2xl font-bold text-gray-600">No Images</span>
        </div>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main image */}
      <div className="relative h-64 md:h-80 overflow-hidden rounded-lg bg-gray-900">
        <Image
          src={images[currentIndex].image_url || "/placeholder.svg"}
          alt={`Project image ${currentIndex + 1}`}
          fill
          className="object-contain" // Change from object-cover to object-contain
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 border-gray-700 hover:bg-gray-800 text-white rounded-full p-1.5"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 border-gray-700 hover:bg-gray-800 text-white rounded-full p-1.5"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next image</span>
          </Button>
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex ? "border-purple-600" : "border-gray-700"
              }`}
            >
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover" // Keep thumbnails as object-cover
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

