"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Zap } from "lucide-react"

export default function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <footer className="py-8 bg-gradient-to-r from-gray-900 to-purple-900 text-white border-t border-gray-800">
      <div className="container px-4 mx-auto">
        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Vibe<span className="text-purple-400">Verse</span>
              </h3>
            </div>
            <p className="text-sm text-gray-300">Explore AI-powered vibe apps created by Felipe</p>
            <p className="mt-2 text-sm text-purple-400">A Copernic Company</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/apps" className="text-gray-300 hover:text-white">
                  Apps
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-gray-300 hover:text-white">
                  Developers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Footer with Accordions */}
        <div className="md:hidden">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Vibe<span className="text-purple-400">Verse</span>
              </h3>
            </div>
            <p className="text-sm text-gray-300">Explore AI-powered vibe apps created by Felipe</p>
            <p className="mt-2 text-sm text-purple-400">A Copernic Company</p>
          </div>

          {/* Explore Section */}
          <div className="border-t border-gray-700">
            <button
              onClick={() => toggleSection("explore")}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <h4 className="text-sm font-semibold text-white">Explore</h4>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedSection === "explore" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "explore" && (
              <ul className="pb-4 space-y-3 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/apps" className="text-gray-300 hover:text-white">
                    Apps
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-300 hover:text-white">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/developers" className="text-gray-300 hover:text-white">
                    Developers
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Company Section */}
          <div className="border-t border-gray-700">
            <button
              onClick={() => toggleSection("company")}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <h4 className="text-sm font-semibold text-white">Company</h4>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedSection === "company" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "company" && (
              <ul className="pb-4 space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-300 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Legal Section */}
          <div className="border-t border-gray-700">
            <button
              onClick={() => toggleSection("legal")}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <h4 className="text-sm font-semibold text-white">Legal</h4>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedSection === "legal" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "legal" && (
              <ul className="pb-4 space-y-3 text-sm">
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-300 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="pt-6 mt-6 text-sm text-center text-gray-400 border-t border-gray-700">
          © {new Date().getFullYear()} VibeVerse by Copernic. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
