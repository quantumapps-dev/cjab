"use client"
import Image from "next/image"
import { Shield } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Company Info */}
            <div className="flex items-center space-x-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/v25O0W5TGrTkd422C6ZK2-F9uigLzXl6lWPgIbdq8rjbENm1QkY2.png"
                alt="Pennsylvania State Seal"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">CJAB</span>
                <span className="text-xs text-gray-400">Criminal Justice Advisory Board</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400 max-w-md">
                Secure document management with role-based access control, AI-powered summarization, and county-specific
                configurations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-sm text-gray-400">© {currentYear} CJAB. All rights reserved.</div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Data Privacy Compliant</span>
              <span>•</span>
              <span>Secure Document Repository</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
