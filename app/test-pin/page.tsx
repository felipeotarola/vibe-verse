import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TestPinPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Test PIN Protection</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">PIN Protection Test</h2>
          <p className="mb-4">This page helps you test if the PIN protection feature is working correctly.</p>
          <Button asChild>
            <Link href="/resume">Go to Resumes</Link>
          </Button>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-96">
            {`
// Expected behavior:
1. When visiting a PIN-protected resume without a PIN:
   - Should show PIN entry form
   - Should NOT show any resume content

2. When visiting a PIN-protected resume with incorrect PIN:
   - Should show PIN entry form with error message
   - Should NOT show any resume content

3. When visiting a PIN-protected resume with correct PIN:
   - Should show the full resume content
            `}
          </pre>
        </div>
      </div>
    </div>
  )
}
