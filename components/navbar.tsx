"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Zap, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/contexts/auth-context"
import { getProfile } from "@/app/actions/profile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { user, signOut } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        try {
          const profile = await getProfile(user.id)
          setAvatarUrl(profile.avatar_url)
          setUsername(profile.username || user.email?.split("@")[0] || "")
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-gray-900 to-purple-900 border-gray-800">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center">
          <Zap className="w-6 h-6 mr-2 text-purple-400" />
          <span className="text-xl font-bold text-white">
            Vibe<span className="text-purple-400">Verse</span>
          </span>
        </Link>

        {isDesktop ? (
          <div className="flex items-center space-x-6">
            <div className="hidden space-x-6 md:flex">
              <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">
                Home
              </Link>
              <Link href="/apps" className="text-sm font-medium text-gray-300 hover:text-white">
                Apps
              </Link>
              {user && (
                <Link href="/projects" className="text-sm font-medium text-gray-300 hover:text-white">
                  Projects
                </Link>
              )}
              <Link href="/categories" className="text-sm font-medium text-gray-300 hover:text-white">
                Categories
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white">
                About
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-400 border-purple-400 hover:bg-purple-900 flex items-center gap-2"
                    >
                      {avatarUrl ? (
                        <div className="relative w-6 h-6 overflow-hidden rounded-full">
                          <Image src={avatarUrl || "/placeholder.svg"} alt={username} fill className="object-cover" />
                        </div>
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      {username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-400 border-purple-400 hover:bg-purple-900"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="text-white bg-purple-600 hover:bg-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {!isDesktop && isMenuOpen && (
        <div className="container px-4 py-4 mx-auto border-t border-gray-700">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/apps"
              className="text-sm font-medium text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Apps
            </Link>
            {user && (
              <Link
                href="/projects"
                className="text-sm font-medium text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
            )}
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    {avatarUrl ? (
                      <div className="relative w-8 h-8 overflow-hidden rounded-full">
                        <Image src={avatarUrl || "/placeholder.svg"} alt={username} fill className="object-cover" />
                      </div>
                    ) : (
                      <User className="w-5 h-5 text-purple-400" />
                    )}
                    <span className="text-white">{username}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center w-full text-purple-400 border-purple-400 hover:bg-purple-900"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center w-full text-purple-400 border-purple-400 hover:bg-purple-900"
                    >
                      Profile
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="justify-center w-full text-white bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center w-full text-purple-400 border-purple-400 hover:bg-purple-900"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="justify-center w-full text-white bg-purple-600 hover:bg-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

