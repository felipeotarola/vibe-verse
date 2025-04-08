"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { PinEntry } from "@/components/pin-entry"

export default function PinEntryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const showError = searchParams.get("error") === "true"
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
    console.log("Rendering PIN entry page for slug:", slug)
    console.log("Show error:", showError)
  }, [slug, showError])

  if (!isClient) {
    return null // Don't render anything on the server
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <PinEntry
        onSubmit={(pin) => {
          // This is handled in the component itself
          console.log("PIN submitted:", pin)
        }}
        error={showError}
      />
    </div>
  )
}
