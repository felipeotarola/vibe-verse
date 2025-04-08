"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { EyeIcon, EyeOffIcon, LockIcon, UnlockIcon } from "lucide-react"
import { updateResumePublicationStatus, updateResumeProtection } from "@/app/actions/resume"
import { toast } from "@/hooks/use-toast"

interface ResumeSettingsProps {
  userId: string
  isPublished: boolean
  protectionMode: "public" | "pin_protected"
  pinCode: string | null
}

export function ResumeSettings({ userId, isPublished, protectionMode, pinCode }: ResumeSettingsProps) {
  const [published, setPublished] = useState(isPublished)
  const [protection, setProtection] = useState(protectionMode)
  const [pin, setPin] = useState(pinCode || "")
  const [showPin, setShowPin] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handlePublishToggle = async () => {
    const newState = !published
    setPublished(newState)

    const result = await updateResumePublicationStatus(userId, newState)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
    } else {
      // Revert state if failed
      setPublished(published)
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleProtectionSave = async () => {
    // Validate PIN if protection mode is pin_protected
    if (protection === "pin_protected" && (pin.length < 4 || pin.length > 6)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 4-6 digits",
        variant: "destructive",
      })
      return
    }

    const result = await updateResumeProtection(userId, protection, protection === "pin_protected" ? pin : null)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      setDialogOpen(false)
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch id="publish" checked={published} onCheckedChange={handlePublishToggle} />
          <Label htmlFor="publish" className="font-medium">
            {published ? "Published" : "Unpublished"}
          </Label>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              {protection === "public" ? (
                <>
                  <UnlockIcon className="w-4 h-4" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <LockIcon className="w-4 h-4" />
                  <span>PIN Protected</span>
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resume Protection Settings</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <RadioGroup
                value={protection}
                onValueChange={(value) => setProtection(value as "public" | "pin_protected")}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-3 rounded-md border border-gray-700 hover:border-gray-600 transition-colors">
                  <RadioGroupItem value="public" id="public" />
                  <div className="space-y-1">
                    <Label htmlFor="public" className="font-medium flex items-center gap-2">
                      <UnlockIcon className="w-4 h-4" />
                      Public
                    </Label>
                    <p className="text-sm text-gray-400">
                      Anyone with the link can view your resume without restrictions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-md border border-gray-700 hover:border-gray-600 transition-colors">
                  <RadioGroupItem value="pin_protected" id="pin_protected" />
                  <div className="space-y-1 w-full">
                    <Label htmlFor="pin_protected" className="font-medium flex items-center gap-2">
                      <LockIcon className="w-4 h-4" />
                      PIN Protected
                    </Label>
                    <p className="text-sm text-gray-400 mb-3">Viewers need a PIN code to access your resume.</p>

                    {protection === "pin_protected" && (
                      <div className="relative">
                        <Label htmlFor="pin" className="text-sm mb-1 block">
                          Set a 4-6 digit PIN code
                        </Label>
                        <div className="relative">
                          <Input
                            id="pin"
                            type={showPin ? "text" : "password"}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                            className="pr-10"
                            placeholder="Enter PIN"
                            maxLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPin ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Share this PIN with people you want to give access to your resume.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>

              <div className="flex justify-end">
                <Button onClick={handleProtectionSave}>Save Protection Settings</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {published && (
        <div className="text-sm text-gray-400">
          {protection === "public"
            ? "Your resume is publicly accessible to anyone with the link."
            : "Your resume is protected with a PIN code. Only people with the PIN can view it."}
        </div>
      )}
    </div>
  )
}
