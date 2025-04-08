"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Smartphone } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface QRCodeModalProps {
  url: string
  appName: string
}

export default function QRCodeModal({ url, appName }: QRCodeModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600">
          <Smartphone className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Mobile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-white">Open on Mobile Device</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="bg-white p-3 rounded-lg mb-4">
            <QRCodeSVG
              value={url}
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/placeholder.svg?height=40&width=40",
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          <p className="text-sm text-gray-400 text-center">
            Scan this QR code with your mobile device to open{" "}
            <span className="text-purple-400 font-medium">{appName}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
