import { getPublishedResumes, getPublicResumeData } from "@/app/actions/resume"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { ResumePageContent } from "@/components/resume-page-content"

export default async function ResumePage() {
  // Get the cookies in a server component way
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to edit page
  if (user) {
    redirect("/resume/edit")
  }

  // If user is not logged in, get the first published resume and display it directly
  const publishedResumes = await getPublishedResumes()

  if (publishedResumes.length === 0) {
    // If no published resumes, show a message with login/signup options
    return <ResumePageContent noPublishedResumes={true} resumeData={null} />
  }

  // Get the first published resume
  const firstResume = publishedResumes[0]

  // Fetch the complete resume data using the slug
  const resumeData = await getPublicResumeData(firstResume.public_url_slug || "")

  if (!resumeData) {
    return <ResumePageContent resumeData={null} />
  }

  // Pass the data to our client component
  return (
    <ResumePageContent
      resumeData={resumeData}
      isProtected={resumeData.isProtected}
      incorrectPin={resumeData.incorrectPin}
    />
  )
}
