import { notFound } from "next/navigation"
import { getPublicResumeData } from "@/app/actions/resume"
import { ResumeTimeline } from "@/components/resume-timeline"

interface Props {
  params: {
    slug: string
  }
}

export default async function PublicResumePage({ params }: Props) {
  const { slug } = params
  const resumeData = await getPublicResumeData(slug)

  if (!resumeData || !resumeData.settings?.is_published) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Resume</h1>
      <ResumeTimeline data={resumeData} isPublic={true} />
    </div>
  )
}
