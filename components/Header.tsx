"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

interface HeaderProps {
  rightLogos?: string[]
}

export default function Header({ rightLogos = [] }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [canViewUsers, setCanViewUsers] = useState(true) // Default to true for demo
  const [canViewCountyConfig, setCanViewCountyConfig] = useState(true) // Added state to track County Config view permission

  useEffect(() => {
    const checkPermissions = () => {
      const storedPermissions = localStorage.getItem("userPermissions")
      if (storedPermissions) {
        const permissions = JSON.parse(storedPermissions)
        const userPermission = permissions.find((p: any) => p.userId === "1" && p.reportType === "users")
        setCanViewUsers(userPermission?.canView || false)

        const countyConfigPermission = permissions.find(
          (p: any) => p.userId === "1" && p.reportType === "county-config",
        )
        setCanViewCountyConfig(countyConfigPermission?.canView || false) // Check County Config view permission
      }
    }

    checkPermissions()

    window.addEventListener("storage", checkPermissions)
    return () => window.removeEventListener("storage", checkPermissions)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/documents", label: "Documents" },
    ...(canViewUsers ? [{ href: "/users", label: "Users" }] : []),
    { href: "/access-control", label: "Access Control" },
    ...(canViewCountyConfig ? [{ href: "/county-config", label: "County Config" }] : []), // Conditionally include County Config link based on permissions
  ]

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/v25O0W5TGrTkd422C6ZK2-F9uigLzXl6lWPgIbdq8rjbENm1QkY2.png"
                alt="Pennsylvania State Seal"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">CJAB</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">Criminal Justice Advisory Board</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

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

            <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
