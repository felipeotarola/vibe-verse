import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container flex items-center justify-center min-h-screen px-4 py-12 mx-auto">
        <div className="w-full max-w-md p-8 space-y-8 text-center bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-900/30 border border-purple-800/50">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>

          <h2 className="text-2xl font-bold text-white">Check your email</h2>

          <p className="text-gray-300">
            We've sent you a confirmation email. Please check your inbox and click the link to verify your account.
          </p>

          <div className="pt-4">
            <Link href="/auth/login">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Return to Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

