"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Shield } from "lucide-react"
import { Button } from "./ui/button"

interface HeaderProps {
  rightLogos?: string[] // Array of logo URLs (0, 1, or 2 logos)
}

export default function Header({ rightLogos = [] }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">CJAB</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">Criminal Justice Application Backend</span>
              </div>
            </Link>
          </div>

          {/* Center - Navigation */}

          {/* Right side - Optional logos and theme toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
          <div className="flex flex-col space-y-1">{/* Removed mobile navigation links as requested */}</div>
        </div>
      </div>
    </header>
  )
}
