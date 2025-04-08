"use client"

import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPublicResumeData } from "@/app/actions/resume"
import { ResumeTimeline } from "@/components/resume-timeline"
import { PinEntry } from "@/components/pin-entry"

interface PublicResumePageProps {
  params: {
    slug: string
  }
  searchParams: {
    pin?: string
  }
}

export default async function PublicResumePage({ params, searchParams }: PublicResumePageProps) {
  const { slug } = params
  const { pin } = searchParams

  console.log("Fetching resume data for slug:", slug)
  console.log("PIN provided:", pin || "None")

  const resumeData = await getPublicResumeData(slug, pin)

  if (!resumeData) {
    console.log("Resume not found or not published")
    return notFound()
  }

  // Check if the resume is protected and no PIN or incorrect PIN was provided
  if (resumeData.isProtected) {
    console.log("Resume is protected, showing PIN entry form")
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 sr-only">Protected Resume</h1>
        <div className="flex justify-center">
          <PinEntry
            onSubmit={(enteredPin) => {
              // This will be handled client-side in the PinEntry component
            }}
            error={resumeData.incorrectPin}
          />
        </div>
      </div>
    )
  }

  console.log("Resume is accessible, showing content")

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Loading resume...</div>}>
        <h1 className="text-3xl font-bold mb-6">Resume</h1>
        <ResumeTimeline data={resumeData} isPublic={true} />
      </Suspense>
    </div>
  )
}
