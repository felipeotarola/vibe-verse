"use client"

import { getPublishedResumes, getResumeData, getPublicResumeData } from "@/app/actions/resume"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResumeTimeline } from "@/components/resume-timeline"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PinEntry } from "@/components/pin-entry"
import { cookies } from "next/headers"

export default async function ResumePage() {
  const supabase = createClient(cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, show their resume
  if (user) {
    const resumeData = await getResumeData(user.id)
    // Redirect to edit page if they have a resume
    redirect("/resume/edit")
  }

  // If user is not logged in, get the first published resume and display it directly
  const publishedResumes = await getPublishedResumes()

  if (publishedResumes.length === 0) {
    // If no published resumes, show a message with login/signup options
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

  // Get the first published resume
  const firstResume = publishedResumes[0]

  // Fetch the complete resume data using the slug
  const resumeData = await getPublicResumeData(firstResume.public_url_slug || "")

  if (!resumeData) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Resume</h1>
        <p>Unable to load resume data. Please try again later.</p>
      </div>
    )
  }

  // Check if the resume is protected and no PIN was provided
  if (resumeData.isProtected) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 sr-only">Protected Resume</h1>
        <div className="flex justify-center">
          <PinEntry
            onSubmit={(pin) => {
              // This will be handled client-side in the PinEntry component
            }}
            error={resumeData.incorrectPin}
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
