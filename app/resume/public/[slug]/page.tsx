import { getPublicResumeData } from "@/app/actions/resume"
import { ResumeTimeline } from "@/components/resume-timeline"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function PublicResumePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const resumeData = await getPublicResumeData(slug)

  // If no resume data or the resume is not published, show a fallback
  if (!resumeData) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Resume Not Available</h1>
          <p className="text-muted-foreground mb-8">
            This resume is either not published or doesn't exist. Please check the URL or try again later.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/resume">View Available Resumes</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Create Your Own Resume</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <ResumeTimeline data={resumeData} isPublic={true} />
    </div>
  )
}
