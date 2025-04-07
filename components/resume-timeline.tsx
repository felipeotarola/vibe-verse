"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Briefcase, GraduationCap, Award, Code, Download, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface TimelineItemProps {
  id: string
  title: string
  organization: string
  location?: string
  period: string
  description: string
  achievements?: string[]
  skills?: string[]
  logo?: string
  side?: "left" | "right"
  isLast?: boolean
  is_contract?: boolean
}

interface SkillItem {
  name: string
  level: number
}

interface SkillCategory {
  category: string
  items: SkillItem[]
}

interface ProjectItem {
  id: string
  title: string
  description: string
  technologies: string[]
  link?: string
}

interface CertificationItem {
  id: string
  title: string
  organization: string
  date: string
  logo?: string
}

interface ResumeData {
  education: TimelineItemProps[]
  experience: TimelineItemProps[]
  skills: SkillCategory[]
  certifications: CertificationItem[]
  projects: ProjectItem[]
}

interface ResumeTimelineProps {
  data: ResumeData
}

function TimelineItem({
  title,
  organization,
  location,
  period,
  description,
  achievements,
  skills,
  logo,
  side = "left",
  isLast = false,
  is_contract = false,
}: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`relative mb-8 ${isLast ? "" : "pb-8"}`}>
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute top-8 left-4 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-purple-900/50"></div>
      )}

      {/* Timeline dot */}
      <div className="absolute top-5 left-4 w-3 h-3 rounded-full bg-purple-600 transform -translate-x-1.5 z-10 shadow-glow-sm"></div>

      {/* Content card */}
      <div className={`ml-12 transform transition-all duration-300 ${isExpanded ? "scale-102" : ""}`}>
        <Card className="bg-gray-800/90 border-gray-700 hover:border-purple-700/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {logo && (
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden">
                    <img src={logo || "/placeholder.svg"} alt={organization} className="w-full h-full object-contain" />
                  </div>
                </div>
              )}

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    {title}
                    {is_contract && <span className="ml-2 text-purple-400 text-sm font-normal">(Contract)</span>}
                  </h3>
                  <span className="text-sm text-purple-400 font-medium">{period}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-300 mb-4">
                  <span className="font-medium">{organization}</span>
                  {location && (
                    <>
                      <span className="hidden md:inline mx-2">•</span>
                      <span>{location}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-300 mb-4">{description}</p>

                {(achievements || skills) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-0 h-auto"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show more
                      </>
                    )}
                  </Button>
                )}

                {isExpanded && achievements && achievements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Key Achievements</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      {achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isExpanded && skills && skills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Skills Utilized</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-900/30 text-purple-300 border border-purple-800/50"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  return (
    <div className="space-y-8">
      {skills.map((category, index) => (
        <div key={index} className="bg-gray-800/90 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{category.category}</h3>
          <div className="space-y-4">
            {category.items.map((skill, skillIndex) => (
              <div key={skillIndex}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                  <span className="text-sm text-purple-400">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2 bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </Progress>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CertificationsSection({ certifications }: { certifications: CertificationItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certifications.map((cert) => (
        <Card
          key={cert.id}
          className="bg-gray-800/90 border-gray-700 hover:border-purple-700/50 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {cert.logo && (
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden">
                    <img
                      src={cert.logo || "/placeholder.svg"}
                      alt={cert.organization}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
                <p className="text-sm text-gray-300">{cert.organization}</p>
                <p className="text-sm text-purple-400 mt-1">{cert.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProjectsSection({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="bg-gray-800/90 border-gray-700 hover:border-purple-700/50 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-gray-300 mt-2 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ResumeTimeline({ data }: ResumeTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <div ref={containerRef} className="relative">
      {/* Download CV button */}
      <div className="flex justify-end mb-8">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Download CV
        </Button>
      </div>

      <Tabs defaultValue="experience" className="mb-12">
        <TabsList className="bg-gray-800 border border-gray-700 mb-8">
          <TabsTrigger
            value="experience"
            className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Experience
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Education
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
          >
            <Code className="w-4 h-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300"
          >
            <Award className="w-4 h-4 mr-2" />
            Certifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="mt-0">
          <motion.div
            className="timeline-container"
            style={{ opacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {data.experience.map((item, index) => (
              <TimelineItem
                key={item.id}
                {...item}
                side={index % 2 === 0 ? "left" : "right"}
                isLast={index === data.experience.length - 1}
              />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="education" className="mt-0">
          <motion.div
            className="timeline-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {data.education.map((item, index) => (
              <TimelineItem
                key={item.id}
                {...item}
                side={index % 2 === 0 ? "left" : "right"}
                isLast={index === data.education.length - 1}
              />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="skills" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SkillsSection skills={data.skills} />
          </motion.div>
        </TabsContent>

        <TabsContent value="certifications" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <CertificationsSection certifications={data.certifications} />
          </motion.div>
        </TabsContent>
      </Tabs>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Notable Projects</h2>
        <ProjectsSection projects={data.projects} />
      </div>
    </div>
  )
}

