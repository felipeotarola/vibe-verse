import { notFound } from "next/navigation"
import { getPublicResumeData } from "@/app/actions/resume"
import { ResumePageContent } from "@/components/resume-page-content"

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

  return (
    <ResumePageContent
      resumeData={resumeData}
      isProtected={resumeData.isProtected}
      incorrectPin={resumeData.incorrectPin}
    />
  )
}
