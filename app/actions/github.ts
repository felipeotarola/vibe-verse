"use server"

import { cache } from "react"

export interface ContributionDay {
  date: string
  count: number
  level: number
}

export interface ContributionStats {
  totalContributions: number
  weeks: ContributionDay[][]
  longestStreak: number
  currentStreak: number
  isMockData: boolean
  year?: number
}

// Cache the GitHub API call to avoid unnecessary requests
export const getGitHubContributions = cache(async (username: string, year?: number): Promise<ContributionStats> => {
  console.log("========== GITHUB API DEBUGGING ==========")
  console.log(`getGitHubContributions called for username: ${username}, year: ${year || "current"}`)
  console.log(`Current time: ${new Date().toISOString()}`)

  try {
    // Check if we have a GitHub token
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      console.log("❌ No GITHUB_TOKEN found in environment variables. Using mock data.")
      return { ...generateMockContributions(year), isMockData: true, year }
    }

    console.log("✅ GITHUB_TOKEN found, token length:", token.length)
    console.log(`Token starts with: ${token.substring(0, 4)}...`)

    // GitHub GraphQL API endpoint
    const endpoint = "https://api.github.com/graphql"

    // Determine date range for the query based on the year
    let fromDate = ""
    let toDate = ""

    if (year) {
      fromDate = `${year}-01-01T00:00:00Z`
      toDate = `${year}-12-31T23:59:59Z`
      console.log(`Fetching contributions for year ${year}: ${fromDate} to ${toDate}`)
    }

    // GraphQL query to fetch contribution data
    const query = `
      query($username: String!, $fromDate: DateTime, $toDate: DateTime) {
        user(login: $username) {
          contributionsCollection(${year ? "from: $fromDate, to: $toDate" : ""}) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `

    console.log(`🔍 Fetching GitHub contributions for user: ${username}`)
    console.log(`API Endpoint: ${endpoint}`)
    console.log(`Query: ${query.replace(/\s+/g, " ").trim()}`)

    // Make the request to GitHub GraphQL API
    console.log("📡 Sending request to GitHub API...")
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          ...(year && { fromDate, toDate }),
        },
      }),
      cache: "no-store", // Disable caching to ensure fresh data
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    // Log response status for debugging
    console.log(`📥 GitHub API response status: ${response.status} ${response.statusText}`)
    console.log(`Response headers:`, Object.fromEntries([...response.headers.entries()]))

    if (!response.ok) {
      // If we get a 401 or 403, it's likely an authentication issue
      if (response.status === 401 || response.status === 403) {
        console.error("❌ GitHub API authentication failed. Check your token permissions.")
        console.error("Make sure your GITHUB_TOKEN has the 'read:user' scope")
        const errorText = await response.text()
        console.error(`Error response: ${errorText}`)
        return { ...generateMockContributions(year), isMockData: true, year }
      }

      const errorText = await response.text()
      console.error(`❌ GitHub API error: ${errorText}`)
      throw new Error(`GitHub API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Log the response for debugging
    console.log("📊 GitHub API response received:")
    console.log("Response data preview:", JSON.stringify(data).substring(0, 200) + "...")

    // Check if the response contains the expected data
    if (!data.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error("❌ Invalid response from GitHub API:", data)

      // Check for specific error messages
      if (data.errors) {
        console.error("GitHub API errors:", data.errors)

        // Check if the error is related to the user not being found
        const userNotFound = data.errors.some(
          (error: any) => error.type === "NOT_FOUND" || error.message?.includes("Could not resolve to a User"),
        )

        if (userNotFound) {
          console.error(`❌ GitHub user '${username}' not found. Check the username.`)
        }
      }

      return { ...generateMockContributions(year), isMockData: true, year }
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar
    const totalContributions = calendar.totalContributions

    console.log(`✅ Found ${totalContributions} contributions for user ${username}`)
    console.log(`Weeks data available: ${calendar.weeks.length}`)

    // Process the weeks data
    const weeks = calendar.weeks.map((week: any) => {
      return week.contributionDays.map((day: any) => {
        return {
          date: day.date,
          count: day.contributionCount,
          level: getLevelFromContributionLevel(day.contributionLevel),
        }
      })
    })

    // Calculate streaks
    const { longestStreak, currentStreak } = calculateStreaks(weeks)
    console.log(`Longest streak: ${longestStreak}, Current streak: ${currentStreak}`)

    console.log("✅ Successfully processed GitHub contribution data")
    console.log("========== END GITHUB API DEBUGGING ==========")

    return {
      totalContributions,
      weeks,
      longestStreak,
      currentStreak,
      isMockData: false,
      year,
    }
  } catch (error) {
    console.error("❌ Error fetching GitHub contributions:", error)
    // Fallback to mock data if there's an error
    return { ...generateMockContributions(year), isMockData: true, year }
  }
})

// Helper function to convert GitHub's contribution level to our numeric level
function getLevelFromContributionLevel(level: string): number {
  switch (level) {
    case "NONE":
      return 0
    case "FIRST_QUARTILE":
      return 1
    case "SECOND_QUARTILE":
      return 2
    case "THIRD_QUARTILE":
      return 3
    case "FOURTH_QUARTILE":
      return 4
    default:
      return 0
  }
}

// Calculate longest and current streaks
function calculateStreaks(weeks: ContributionDay[][]): { longestStreak: number; currentStreak: number } {
  // Flatten the weeks array
  const days = weeks.flat()

  let longestStreak = 0
  let currentStreak = 0
  let currentCount = 0

  // Calculate longest streak
  for (let i = 0; i < days.length; i++) {
    if (days[i].count > 0) {
      currentCount++
      if (currentCount > longestStreak) {
        longestStreak = currentCount
      }
    } else {
      currentCount = 0
    }
  }

  // Calculate current streak (going backwards from today)
  currentCount = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentCount++
    } else {
      break
    }
  }
  currentStreak = currentCount

  return { longestStreak, currentStreak }
}

// Generate mock contribution data as a fallback
function generateMockContributions(year?: number): Omit<ContributionStats, "isMockData"> {
  console.log(`Generating mock GitHub contribution data for year: ${year || "current"}`)

  const days = 365
  const weeks = []
  let totalContributions = 0

  // Use the specified year or current year
  const targetYear = year || new Date().getFullYear()

  // Create a date object for January 1st of the target year
  const startDate = new Date(targetYear, 0, 1)

  // Create weeks
  for (let i = 0; i < days; i += 7) {
    const week = []
    for (let j = 0; j < 7 && i + j < days; j++) {
      // Create some patterns - more activity on weekends and certain months
      let baseValue = Math.random()

      // Increase activity for certain periods (simulating project sprints)
      if (j === 0 || j === 6) baseValue *= 1.5 // More active on weekends
      if (i > 30 && i < 60) baseValue *= 2 // Very active month
      if (i > 180 && i < 210) baseValue *= 2.5 // Another very active month
      if (i > 300 && i < 330) baseValue *= 2 // Another active period

      // Determine contribution level and count
      let level = 0
      let count = 0

      if (baseValue > 0.8) {
        level = 4
        count = Math.floor(Math.random() * 10) + 10
      } else if (baseValue > 0.6) {
        level = 3
        count = Math.floor(Math.random() * 5) + 5
      } else if (baseValue > 0.4) {
        level = 2
        count = Math.floor(Math.random() * 3) + 2
      } else if (baseValue > 0.2) {
        level = 1
        count = 1
      }

      totalContributions += count

      // Create a date string for the specific day in the target year
      const date = new Date(startDate)
      date.setDate(date.getDate() + i + j)

      week.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
      })
    }
    weeks.push(week)
  }

  // Generate different mock data based on the year to make it look realistic
  const yearSeed = targetYear % 10 // Use last digit of year as a seed
  const mockTotalContributions = Math.floor(Math.random() * 1000) + 500 + yearSeed * 100 // Random total between 500-1500 + year factor
  const mockLongestStreak = Math.floor(Math.random() * 20) + 5 + yearSeed // Random streak between 5-25 + year factor
  const mockCurrentStreak = Math.floor(Math.random() * 10) + 1 // Random current streak between 1-11

  return {
    totalContributions: mockTotalContributions,
    weeks,
    longestStreak: mockLongestStreak,
    currentStreak: mockCurrentStreak,
    year,
  }
}
