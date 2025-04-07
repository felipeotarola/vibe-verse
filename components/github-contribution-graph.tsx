"use client"

import { useEffect, useState } from "react"
import { getGitHubContributions, type ContributionStats } from "@/app/actions/github"
import { InfoIcon, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GitHubContributionGraphProps {
  username?: string
}

export default function GitHubContributionGraph({ username = "felipeotarola" }: GitHubContributionGraphProps) {
  const [contributionData, setContributionData] = useState<ContributionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>([])

  // Generate available years (from 5 years ago to current year)
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= currentYear - 4; year--) {
      years.push(year)
    }
    setAvailableYears(years)
  }, [])

  useEffect(() => {
    async function fetchContributions() {
      console.log("========== GITHUB COMPONENT DEBUGGING ==========")
      console.log(`GitHubContributionGraph component fetching for username: ${username}, year: ${selectedYear}`)
      console.log(`Current time: ${new Date().toISOString()}`)

      setIsLoading(true)

      try {
        console.log(`🔍 Calling getGitHubContributions for ${username} (${selectedYear})...`)
        // Always fetch data, the server action will handle fallback to mock data
        const data = await getGitHubContributions(username, selectedYear)

        console.log("📊 Contribution data received:")
        console.log(`Data type: ${data.isMockData ? "MOCK DATA" : "REAL DATA"}`)
        console.log(`Year: ${data.year || "current"}`)
        console.log(`Total contributions: ${data.totalContributions}`)
        console.log(`Weeks data available: ${data.weeks?.length || 0}`)
        console.log(`Longest streak: ${data.longestStreak}`)
        console.log(`Current streak: ${data.currentStreak}`)

        setContributionData(data)
        console.log("✅ Component state updated with contribution data")
      } catch (err) {
        console.error("❌ Error in GitHubContributionGraph component:", err)
        // If we get here, something went very wrong - use basic mock data
        console.log("Falling back to basic mock data")
        setContributionData({
          totalContributions: 728,
          weeks: [],
          longestStreak: 14,
          currentStreak: 3,
          isMockData: true,
          year: selectedYear,
        })
      } finally {
        setIsLoading(false)
        console.log("Loading state set to false")
        console.log("========== END GITHUB COMPONENT DEBUGGING ==========")
      }
    }

    fetchContributions()
  }, [username, selectedYear])

  // Function to get color based on contribution level
  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-gray-800 border-gray-700"
      case 1:
        return "bg-purple-900/30 border-purple-800"
      case 2:
        return "bg-purple-800/50 border-purple-700"
      case 3:
        return "bg-purple-700/70 border-purple-600"
      case 4:
        return "bg-purple-600 border-purple-500"
      default:
        return "bg-gray-800 border-gray-700"
    }
  }

  const handlePreviousYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1])
    }
  }

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1])
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!contributionData) {
    return (
      <div className="w-full py-4 text-center">
        <p className="text-gray-400">No contribution data available</p>
      </div>
    )
  }

  // Display stats even if we don't have weeks data
  const hasWeeksData = contributionData.weeks && contributionData.weeks.length > 0

  return (
    <div className="w-full">
      {contributionData.isMockData && (
        <div className="mb-4 p-3 bg-purple-900/20 border border-purple-800/50 rounded-md">
          <div className="flex items-center mb-1">
            <InfoIcon className="w-5 h-5 text-purple-400 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium text-purple-300">Using simulated GitHub data</p>
          </div>
          <p className="text-xs text-purple-300 ml-7">
            To show real GitHub contribution data, add a valid GITHUB_TOKEN with 'read:user' scope to your environment
            variables.
          </p>
        </div>
      )}

      {/* Year selector */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{selectedYear} Contributions</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousYear}
            disabled={availableYears.indexOf(selectedYear) === availableYears.length - 1}
            className="h-8 w-8 p-0 border-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Year</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextYear}
            disabled={availableYears.indexOf(selectedYear) === 0}
            className="h-8 w-8 p-0 border-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Year</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-400">{contributionData.totalContributions}</p>
          <p className="text-sm text-gray-400">Total Contributions</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-400">{contributionData.longestStreak}</p>
          <p className="text-sm text-gray-400">Longest Streak</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-400">{contributionData.currentStreak}</p>
          <p className="text-sm text-gray-400">Current Streak</p>
        </div>
      </div>

      {hasWeeksData ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap" style={{ minWidth: "700px" }}>
            {contributionData.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm border ${getColor(day.level)}`}
                    title={`${day.count} contributions on ${day.date}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex items-center">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center opacity-70 hover:opacity-100 transition-opacity"
              >
                Verify on GitHub
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Less</span>
              <div className={`w-3 h-3 rounded-sm border ${getColor(0)}`}></div>
              <div className={`w-3 h-3 rounded-sm border ${getColor(1)}`}></div>
              <div className={`w-3 h-3 rounded-sm border ${getColor(2)}`}></div>
              <div className={`w-3 h-3 rounded-sm border ${getColor(3)}`}></div>
              <div className={`w-3 h-3 rounded-sm border ${getColor(4)}`}></div>
              <span className="text-xs text-gray-400">More</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-gray-400">Contribution graph visualization not available</p>
          <p className="text-sm text-gray-500 mt-2">Using simulated contribution data</p>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center mt-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            View on GitHub
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      )}
    </div>
  )
}

