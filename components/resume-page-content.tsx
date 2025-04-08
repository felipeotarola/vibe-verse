"use client"

import { ResumeTimeline } from "@/components/resume-timeline"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PinEntry } from "@/components/pin-entry"

interface ResumePageContentProps {
  resumeData: any
  isProtected?: boolean
  incorrectPin?: boolean
  noPublishedResumes?: boolean
}

export function ResumePageContent({
  resumeData,
  isProtected = false,
  incorrectPin = false,
  noPublishedResumes = false,
}: ResumePageContentProps) {
  // If no published resumes, show a message with login/signup options
  if (noPublishedResumes) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">No Published Resumes</h1>
          <p className="text-muted-foreground mb-8">
            There are currently no published resumes available to view. Sign in to create and publish your own
            professional resume.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Create Your Resume</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If resume data couldn't be loaded
  if (!resumeData) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Resume</h1>
        <p>Unable to load resume data. Please try again later.</p>
      </div>
    )
  }

  // Check if the resume is protected and no PIN was provided
  if (isProtected) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 sr-only">Protected Resume</h1>
        <div className="flex justify-center">
          <PinEntry
            onSubmit={(pin) => {
              // This will be handled client-side in the PinEntry component
            }}
            error={incorrectPin}
          />
        </div>
      </div>
    )
  }

  // Display the resume directly
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Resume</h1>
      <ResumeTimeline data={resumeData} isPublic={true} />
    </div>
  )
}
