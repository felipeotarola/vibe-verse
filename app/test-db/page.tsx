"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { testProjectImagesTable } from "@/app/actions/test-db"

export default function TestDbPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    try {
      const testResult = await testProjectImagesTable()
      setResult(testResult)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test Page</h1>

      <Button onClick={runTest} disabled={isLoading} className="mb-4">
        {isLoading ? "Testing..." : "Test project_images Table"}
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Result:</h2>
          <pre className="whitespace-pre-wrap overflow-auto max-h-96 p-4 bg-gray-900 rounded-lg">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
