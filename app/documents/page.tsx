"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, FileText, Upload, ChevronRight, Home, Search, Filter } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: string
  name: string
  type: string
  uploadedAt: Date
  size: string
}

interface CourtFolder {
  id: string
  name: string
  districtNumber: string
  documentCount: number
}

export default function DocumentsPage() {
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null)
  const [selectedCourt, setSelectedCourt] = useState<CourtFolder | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for courts
  const courts: CourtFolder[] = [
    { id: "1", name: "Magisterial District Court 15-1-01", districtNumber: "15-1-01", documentCount: 12 },
    { id: "2", name: "Magisterial District Court 15-1-02", districtNumber: "15-1-02", documentCount: 8 },
  ]

  // Mock documents
  const documents: Document[] = [
    { id: "1", name: "Bail_Report_2024_001.pdf", type: "PDF", uploadedAt: new Date(), size: "2.4 MB" },
    { id: "2", name: "Bail_Report_2024_002.pdf", type: "PDF", uploadedAt: new Date(), size: "1.8 MB" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      toast.success(`${files.length} file(s) uploaded successfully`)
      setIsUploadDialogOpen(false)
    }
  }

  const renderBreadcrumb = () => {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedReportType(null)
            setSelectedCourt(null)
          }}
          className="h-8 px-2"
        >
          <Home className="w-4 h-4" />
        </Button>
        {selectedReportType && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Button variant="ghost" size="sm" onClick={() => setSelectedCourt(null)} className="h-8 px-2 font-medium">
              {selectedReportType}
            </Button>
          </>
        )}
        {selectedCourt && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900 dark:text-white">{selectedCourt.name}</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Repository</h1>
                <p className="text-gray-600 dark:text-gray-400">Browse and manage your documents</p>
              </div>
            </div>
            {selectedCourt && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>Upload a document to {selectedCourt.name}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="file">Select File</Label>
                      <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                      <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        {renderBreadcrumb()}

        {/* Main Content */}
        {!selectedReportType ? (
          // Report Type Selection
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
              onClick={() => setSelectedReportType("PSI Reports")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                  <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>PSI Reports</CardTitle>
                <CardDescription>Pre-Sentence Investigation Reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">24 documents</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-500"
              onClick={() => setSelectedReportType("Bail Reports")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3">
                  <Folder className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Bail Reports</CardTitle>
                <CardDescription>Organized by Magisterial District Courts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{courts.length} courts</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-500"
              onClick={() => setSelectedReportType("Social Summary Reports")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3">
                  <Folder className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Social Summary Reports</CardTitle>
                <CardDescription>Social background and context reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">18 documents</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedReportType === "Bail Reports" && !selectedCourt ? (
          // Court Folder Selection for Bail Reports
          <div>
            <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                      Select a Magisterial District Court
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Bail reports are organized by magisterial district court. Select a court to view or upload
                      documents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map((court) => (
                <Card
                  key={court.id}
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-500"
                  onClick={() => setSelectedCourt(court)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Folder className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <Badge variant="secondary">{court.districtNumber}</Badge>
                    </div>
                    <CardTitle className="text-lg">{court.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{court.documentCount} documents</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Document List View
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                {selectedCourt ? `Documents in ${selectedCourt.name}` : `All documents in ${selectedReportType}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Documents</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Upload your first document to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {doc.size} • {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
