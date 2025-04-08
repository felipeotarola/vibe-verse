"use client"

import { SparklesCore } from "@/components/sparkles-core"

export default function TestSparklesPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="relative w-full h-screen">
        <SparklesCore
          id="sparkles-test"
          background="transparent"
          minSize={1.5}
          maxSize={3}
          particleDensity={150}
          className="w-full h-full"
          particleColor="#a855f7"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white z-10">Sparkles Test Page</h1>
        </div>
      </div>
    </main>
  )
}
