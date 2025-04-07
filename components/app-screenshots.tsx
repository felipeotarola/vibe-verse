"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppScreenshots() {
  // In a real app, these would be actual screenshots
  const screenshots = [
    "/placeholder.svg?height=600&width=300",
    "/placeholder.svg?height=600&width=300",
    "/placeholder.svg?height=600&width=300",
    "/placeholder.svg?height=600&width=300",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="relative">
      {/* Main image */}
      <div className="relative h-64 md:h-80 overflow-hidden rounded-lg bg-gray-900">
        <img
          src={screenshots[currentIndex] || "/placeholder.svg"}
          alt={`App screenshot ${currentIndex + 1}`}
          className="object-contain w-full h-full"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-gray-900/20 to-transparent"></div>
      </div>

      {/* Navigation arrows */}
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

      {/* Image counter */}
      <div className="absolute bottom-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {screenshots.length}
      </div>

      {/* Thumbnail navigation */}
      <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
        {screenshots.map((src, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
              index === currentIndex ? "border-purple-600" : "border-gray-700"
            }`}
          >
            <img
              src={src || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

