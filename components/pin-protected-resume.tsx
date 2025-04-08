"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

interface PinProtectedResumeProps {
  slug: string
  incorrectPin?: boolean
}

export function PinProtectedResume({ slug, incorrectPin = false }: PinProtectedResumeProps) {
  const [pin, setPin] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Redirect to the same page with the PIN as a query parameter
    router.push(`/resume/public/${slug}?pin=${pin}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Lock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Protected Resume</CardTitle>
          <CardDescription className="text-center">
            This resume is protected by a PIN code. Please enter the PIN to view it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="pin"
                  placeholder="Enter PIN"
                  type="password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="text-center text-lg py-6"
                  maxLength={10}
                  required
                />
                {incorrectPin && <p className="text-sm text-red-500 text-center">Incorrect PIN. Please try again.</p>}
              </div>
              <Button type="submit" disabled={isSubmitting || !pin}>
                {isSubmitting ? "Verifying..." : "View Resume"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-gray-500 mt-2">
            If you don&apos;t have the PIN, please contact the resume owner.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
