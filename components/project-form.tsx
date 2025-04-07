"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, X, Camera, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createProject, updateProject, type Project } from "@/app/actions/projects"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import ProjectImagesUpload, { type ProjectImage as ProjectImageType } from "@/components/project-images-upload"
import { getProjectImages } from "@/app/actions/project-images"
import Image from "next/image"

interface ProjectFormProps {
  userId: string
  project?: Project
  isEditing?: boolean
  onError?: (error: string) => void
}

const CATEGORIES = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Data Science",
  "Machine Learning",
  "Blockchain",
  "Game Development",
  "IoT",
  "Other",
]

// Expanded tech stack options with categories
const TECH_STACK = [
  {
    category: "Programming Languages",
    items: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
      { value: "php", label: "PHP" },
      { value: "ruby", label: "Ruby" },
      { value: "swift", label: "Swift" },
      { value: "kotlin", label: "Kotlin" },
      { value: "dart", label: "Dart" },
      { value: "r", label: "R" },
      { value: "scala", label: "Scala" },
      { value: "html", label: "HTML" },
      { value: "css", label: "CSS" },
      { value: "sql", label: "SQL" },
      { value: "shell", label: "Shell/Bash" },
      { value: "perl", label: "Perl" },
    ],
  },
  {
    category: "Databases",
    items: [
      { value: "postgresql", label: "PostgreSQL" },
      { value: "mysql", label: "MySQL" },
      { value: "mongodb", label: "MongoDB" },
      { value: "sqlite", label: "SQLite" },
      { value: "redis", label: "Redis" },
      { value: "supabase", label: "Supabase" },
      { value: "firebase", label: "Firebase" },
      { value: "dynamodb", label: "DynamoDB" },
      { value: "cosmosdb", label: "CosmosDB" },
      { value: "neo4j", label: "Neo4j" },
    ],
  },
  {
    category: "ORMs & Database Tools",
    items: [
      { value: "prisma", label: "Prisma" },
      { value: "sequelize", label: "Sequelize" },
      { value: "typeorm", label: "TypeORM" },
      { value: "mongoose", label: "Mongoose" },
      { value: "drizzle", label: "Drizzle ORM" },
      { value: "knex", label: "Knex.js" },
      { value: "sqlalchemy", label: "SQLAlchemy" },
      { value: "hibernate", label: "Hibernate" },
    ],
  },
  {
    category: "Frontend Frameworks",
    items: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "nextjs", label: "Next.js" },
      { value: "nuxtjs", label: "Nuxt.js" },
      { value: "remix", label: "Remix" },
      { value: "solid", label: "SolidJS" },
    ],
  },
  {
    category: "Backend Frameworks",
    items: [
      { value: "express", label: "Express.js" },
      { value: "nestjs", label: "NestJS" },
      { value: "django", label: "Django" },
      { value: "flask", label: "Flask" },
      { value: "fastapi", label: "FastAPI" },
      { value: "spring", label: "Spring Boot" },
      { value: "laravel", label: "Laravel" },
      { value: "rails", label: "Ruby on Rails" },
      { value: "dotnet", label: ".NET" },
    ],
  },
  {
    category: "Mobile Frameworks",
    items: [
      { value: "reactnative", label: "React Native" },
      { value: "flutter", label: "Flutter" },
      { value: "ionic", label: "Ionic" },
      { value: "nativescript", label: "NativeScript" },
      { value: "xamarin", label: "Xamarin" },
    ],
  },
  {
    category: "DevOps & Cloud",
    items: [
      { value: "docker", label: "Docker" },
      { value: "kubernetes", label: "Kubernetes" },
      { value: "aws", label: "AWS" },
      { value: "azure", label: "Azure" },
      { value: "gcp", label: "Google Cloud" },
      { value: "vercel", label: "Vercel" },
      { value: "netlify", label: "Netlify" },
      { value: "heroku", label: "Heroku" },
      { value: "digitalocean", label: "DigitalOcean" },
      { value: "github-actions", label: "GitHub Actions" },
      { value: "gitlab-ci", label: "GitLab CI" },
      { value: "jenkins", label: "Jenkins" },
    ],
  },
  {
    category: "Testing",
    items: [
      { value: "jest", label: "Jest" },
      { value: "mocha", label: "Mocha" },
      { value: "cypress", label: "Cypress" },
      { value: "playwright", label: "Playwright" },
      { value: "selenium", label: "Selenium" },
      { value: "pytest", label: "pytest" },
      { value: "junit", label: "JUnit" },
    ],
  },
  {
    category: "Other Tools",
    items: [
      { value: "graphql", label: "GraphQL" },
      { value: "rest", label: "REST API" },
      { value: "websockets", label: "WebSockets" },
      { value: "redux", label: "Redux" },
      { value: "tailwind", label: "Tailwind CSS" },
      { value: "sass", label: "Sass" },
      { value: "webpack", label: "Webpack" },
      { value: "vite", label: "Vite" },
      { value: "pwa", label: "PWA" },
      { value: "electron", label: "Electron" },
    ],
  },
  {
    category: "AI & ML Providers",
    items: [
      { value: "openai", label: "OpenAI" },
      { value: "anthropic", label: "Anthropic" },
      { value: "google-ai", label: "Google AI" },
      { value: "huggingface", label: "Hugging Face" },
      { value: "cohere", label: "Cohere" },
      { value: "azure-ai", label: "Azure AI" },
      { value: "aws-bedrock", label: "AWS Bedrock" },
      { value: "stability-ai", label: "Stability AI" },
      { value: "replicate", label: "Replicate" },
      { value: "deepgram", label: "Deepgram" },
      { value: "assemblyai", label: "AssemblyAI" },
      { value: "nvidia", label: "NVIDIA AI" },
      { value: "clarifai", label: "Clarifai" },
      { value: "vercel-ai", label: "Vercel AI" },
    ],
  },
]

// Flatten the tech stack for lookup purposes
const FLAT_TECH_STACK = TECH_STACK.flatMap((category) => category.items)

const STATUS_OPTIONS = ["active", "completed", "archived"]

export default function ProjectForm({ userId, project, isEditing = false, onError }: ProjectFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState(project?.name || "")
  const [description, setDescription] = useState(project?.description || "")
  const [url, setUrl] = useState(project?.url || "")
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "")
  const [category, setCategory] = useState(project?.category || "")
  const [status, setStatus] = useState(project?.status || "active")
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(project?.image_url || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isShared, setIsShared] = useState(project?.is_shared || false)
  const [projectImages, setProjectImages] = useState<ProjectImageType[]>([])
  const [isUploadingMainImage, setIsUploadingMainImage] = useState(false)
  const [isLoadingImages, setIsLoadingImages] = useState(isEditing)
  const mainImageInputRef = useRef<HTMLInputElement>(null)

  // In the ProjectForm component, make sure we're initializing the tech stack correctly
  // Parse tech stack from project or default to empty array
  const initialStack = useMemo(() => {
    if (project?.tech_stack) {
      try {
        return JSON.parse(project.tech_stack as string)
      } catch (e) {
        console.error("Error parsing tech stack:", e)
        return []
      }
    } else if (project?.languages) {
      try {
        return JSON.parse(project.languages as string)
      } catch (e) {
        console.error("Error parsing languages:", e)
        return []
      }
    }
    return []
  }, [project?.tech_stack, project?.languages])

  const [selectedStack, setSelectedStack] = useState<string[]>(initialStack)
  const [stackPopoverOpen, setStackPopoverOpen] = useState(false)

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingMainImage(true)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setMainImagePreview(reader.result as string)
      setMainImageFile(file)
      setIsUploadingMainImage(false)
    }
    reader.readAsDataURL(file)

    // Reset the file input
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = ""
    }
  }

  const handleMainImageButtonClick = () => {
    mainImageInputRef.current?.click()
  }

  const removeMainImage = () => {
    setMainImagePreview(null)
    setMainImageFile(null)
  }

  const toggleStackItem = (item: string) => {
    setSelectedStack((current) => (current.includes(item) ? current.filter((i) => i !== item) : [...current, item]))
  }

  const removeStackItem = (item: string) => {
    setSelectedStack((current) => current.filter((i) => i !== item))
  }

  useEffect(() => {
    async function loadProjectImages() {
      if (isEditing && project) {
        try {
          setIsLoadingImages(true)
          console.log(`Loading images for project: ${project.id}`)
          const images = await getProjectImages(project.id)
          console.log(`Loaded ${images.length} images for project`)

          if (images.length > 0) {
            setProjectImages(
              images.map((img) => ({
                id: img.id,
                image_url: img.image_url,
                display_order: img.display_order,
              })),
            )
          } else {
            console.log("No images found for project")
            setProjectImages([])
          }
        } catch (error) {
          console.error("Error loading project images:", error)
          setProjectImages([])
        } finally {
          setIsLoadingImages(false)
        }
      }
    }

    if (isEditing && project) {
      loadProjectImages()
    }
  }, [isEditing, project])

  // Optimize image preparation for form submission
  const prepareImagesForSubmission = (formData: FormData) => {
    // Prepare additional images data
    const additionalImagesData = projectImages.map((img) => ({
      id: img.id,
      image_url: img.image_url,
      isNew: img.isNew,
      display_order: img.display_order,
    }))

    formData.append("additionalImages", JSON.stringify(additionalImagesData))

    // Only add files that are actually new
    let fileCount = 0
    projectImages.forEach((img) => {
      if (img.file && img.isNew) {
        formData.append(`image_${fileCount}`, img.file)
        fileCount++
      }
    })

    return fileCount
  }

  // Updated handleSubmit function with optimizations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      const formData = new FormData()

      // Add basic project data
      if (isEditing && project) {
        formData.append("projectId", project.id)
        formData.append("currentImageUrl", project.image_url || "")
        formData.append("status", status)
      } else {
        formData.append("userId", userId)
      }

      formData.append("name", name)
      formData.append("description", description || "")
      formData.append("url", url || "")
      formData.append("githubUrl", githubUrl || "")
      formData.append("category", category || "")
      formData.append("techStack", JSON.stringify(selectedStack))
      formData.append("isShared", isShared.toString())

      // Handle main image
      if (mainImageFile) {
        formData.append("mainImage", mainImageFile)
      } else if (mainImagePreview && !mainImageFile) {
        formData.append("currentImageUrl", mainImagePreview)
      }

      // Prepare images for submission
      const fileCount = prepareImagesForSubmission(formData)
      console.log(`Added ${fileCount} image files to form data`)

      // Submit the form
      const result = isEditing ? await updateProject(formData) : await createProject(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Project updated" : "Project created",
          description: result.message,
        })

        // Redirect to the project page or dashboard
        if (isEditing) {
          router.push(`/projects/${project?.id}`)
        } else {
          router.push("/dashboard")
        }
      } else {
        setFormError(result.message || "An error occurred")
        if (onError) onError(result.message || "An error occurred")
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Form submission error:", error)
      setFormError(error.message || "An error occurred")
      if (onError) onError(error.message || "An error occurred")
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get tech item label from value
  const getStackItemLabel = (value: string) => {
    const item = FLAT_TECH_STACK.find((item) => item.value === value)
    return item ? item.label : value
  }

  if (isLoadingImages) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-300">Loading project data...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="p-4 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
          <p>{formError}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Project Name *
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Project"
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <Textarea
          id="description"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project..."
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Main Project Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Main Project Image</label>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="relative w-full md:w-1/3 h-48 overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800">
            {mainImagePreview ? (
              <>
                <Image
                  src={mainImagePreview || "/placeholder.svg"}
                  alt="Main project image"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-80 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-750"
                onClick={handleMainImageButtonClick}
              >
                <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                <span className="text-sm text-gray-400">Upload Main Image</span>
              </div>
            )}

            {isUploadingMainImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3">
            <p className="text-sm text-gray-300 mb-3">
              This is the main image that will be displayed as the project thumbnail and cover image.
            </p>
            <input
              type="file"
              ref={mainImageInputRef}
              onChange={handleMainImageChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleMainImageButtonClick}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isUploadingMainImage}
            >
              <Camera className="w-4 h-4 mr-2" />
              {mainImagePreview ? "Change Main Image" : "Upload Main Image"}
            </Button>
          </div>
        </div>
      </div>

      {/* Project Screenshots Upload - Highlighted for both new and edit projects */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Project Screenshots
          {!isEditing && (
            <span className="ml-2 text-xs text-purple-400">(These will be saved to the project_images database)</span>
          )}
        </label>
        <ProjectImagesUpload images={projectImages} onImagesChange={setProjectImages} maxImages={5} />
        <p className="text-xs text-gray-400">Upload up to 5 screenshots to showcase your project in detail.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-300">
            Project URL
          </label>
          <Input
            id="url"
            type="url"
            value={url || ""}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://myproject.com"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300">
            GitHub URL
          </label>
          <Input
            id="githubUrl"
            type="url"
            value={githubUrl || ""}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="focus:bg-gray-700">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEditing && (
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {STATUS_OPTIONS.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption} className="focus:bg-gray-700">
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Tech Stack</label>
        <Popover open={stackPopoverOpen} onOpenChange={setStackPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={stackPopoverOpen}
              className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              {selectedStack.length > 0
                ? `${selectedStack.length} technology${selectedStack.length > 1 ? "ies" : ""} selected`
                : "Select technologies"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700 text-white">
            <Command className="bg-transparent">
              <CommandInput placeholder="Search technologies..." className="text-white" />
              <CommandList>
                <CommandEmpty>No technology found.</CommandEmpty>
                <ScrollArea className="h-80">
                  {TECH_STACK.map((category, index) => (
                    <React.Fragment key={category.category}>
                      {index > 0 && <CommandSeparator />}
                      <CommandGroup heading={category.category}>
                        {category.items.map((item) => (
                          <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={() => toggleStackItem(item.value)}
                            className={cn(
                              "flex items-center gap-2",
                              selectedStack.includes(item.value) ? "bg-gray-700" : "",
                            )}
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 rounded-sm w-4 h-4 border border-gray-500",
                                selectedStack.includes(item.value)
                                  ? "bg-purple-600 border-purple-600"
                                  : "bg-transparent",
                              )}
                            >
                              {selectedStack.includes(item.value) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4 text-white"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                            <span>{item.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </React.Fragment>
                  ))}
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedStack.map((item) => (
              <Badge key={item} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                {getStackItemLabel(item)}
                <button
                  type="button"
                  onClick={() => removeStackItem(item)}
                  className="ml-1 rounded-full hover:bg-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="is-shared" className="text-sm font-medium text-gray-300">
              Share on Apps Page
            </Label>
            <p className="text-xs text-gray-400">
              When enabled, this project will be displayed on the public Apps page
            </p>
          </div>
          <Switch
            id="is-shared"
            checked={isShared}
            onCheckedChange={setIsShared}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Update Project" : "Create Project"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

