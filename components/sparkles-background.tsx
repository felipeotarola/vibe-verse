"use client"

import { SparklesCore } from "@/components/sparkles-core"

export default function SparklesBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <SparklesCore
        id="sparkles"
        background="transparent"
        minSize={1}
        maxSize={2}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#a855f7" // Brighter purple
      />
    </div>
  )
}
