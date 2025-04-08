"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react"

interface PinEntryProps {
  onSubmit: (pin: string) => void
  error?: boolean
}

export function PinEntry({ onSubmit, error }: PinEntryProps) {
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length >= 4 && pin.length <= 6) {
      setIsSubmitting(true)

      // Get the slug from the current path
      const slug = pathname.split("/").pop()

      if (slug) {
        // For pin-entry pages
        if (pathname.includes("/resume/pin-entry/")) {
          router.push(`/resume/public/${slug}?pin=${pin}`)
        }
        // For the main resume page
        else {
          router.push(`/resume?pin=${pin}`)
        }
      }

      onSubmit(pin)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 border border-purple-700/50 mb-4">
          <LockIcon className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Protected Resume</h2>
        <p className="text-gray-300 mt-2">This resume is protected by a PIN code. Please enter the PIN to view it.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showPin ? "text" : "password"}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            className={`bg-gray-700 border-gray-600 pr-10 text-center text-xl tracking-widest ${
              error ? "border-red-500 focus:ring-red-500" : ""
            }`}
            placeholder="Enter PIN"
            maxLength={6}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPin ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center">Incorrect PIN. Please try again.</p>}

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={pin.length < 4 || pin.length > 6 || isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Unlock Resume"}
        </Button>
      </form>
    </div>
  )
}
