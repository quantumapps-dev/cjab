"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { FileText, Users, Database, Brain, Settings, Lock, FileCheck, FolderOpen } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/v25O0W5TGrTkd422C6ZK2-F9uigLzXl6lWPgIbdq8rjbENm1QkY2.png"
              alt="Pennsylvania State Seal"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
            Criminal Justice Advisory Board
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-pretty">
            Secure document management system with role-based access control, AI-powered summarization, and dynamic
            county-specific configurations
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">Document Management</CardTitle>
              <CardDescription>Upload, view, and manage documents with secure repository access</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Role-Based Access</CardTitle>
              <CardDescription>Granular permissions with module and record-level control</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">AI Summarization</CardTitle>
              <CardDescription>Automated extraction of key points and risk indicators</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-3">
                <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-lg">County Configuration</CardTitle>
              <CardDescription>Dynamic setup based on county-specific requirements</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Report Types Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Supported Report Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-xl">PSI Reports</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Pre-Sentence Investigation Reports with comprehensive defendant analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-xl">Bail Reports</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Detailed bail assessment reports with risk evaluation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-xl">Social Summary</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Social Summary Reports with contextual background information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FolderOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-xl">Custom Reports</CardTitle>
                </div>
                <CardDescription className="text-base">
                  User-configurable report types with custom metadata fields
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Core Capabilities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Granular Access Control</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Module-level and record-level permissions with specific privileges for viewing, creating, editing, and
                  deleting records
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multi-Role Assignment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Users can be assigned multiple roles with enhanced role-based permissions for flexible access
                  management
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI/NLP Integration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatic document summarization with defendant details, case context, recommendations, and risk
                  indicators
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dynamic County Setup</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Each county can have different modules, magistrate offices, and reporting structures with dynamic
                  dashboard configuration
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Privacy Enforcement</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  County-level policy compliance with secure document repository and comprehensive data privacy controls
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Repository</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Centralized secure document repository with comprehensive management capabilities and audit trails
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
