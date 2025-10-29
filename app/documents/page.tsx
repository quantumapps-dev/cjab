"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, FileText, Upload, ChevronRight, Home, Search, Filter, Calendar, User, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

const psiUploadSchema = z.object({
  description: z.string().min(1, "Description is required"),
  sentenceDate: z.string().min(1, "Sentence date is required"),
  docketNumber: z.string().min(1, "Docket number is required"),
  file: z.any().refine((files) => files?.length > 0, "File is required"),
})

const bailUploadSchema = z.object({
  description: z.string().min(1, "Description is required"),
  hearingDate: z.string().min(1, "Hearing date is required"),
  otn: z.string().min(1, "OTN is required"),
  file: z.any().refine((files) => files?.length > 0, "File is required"),
})

const socialSummaryUploadSchema = z.object({
  description: z.string().min(1, "Description is required"),
  dispositionDate: z.string().min(1, "Disposition date is required"),
  docketNumber: z.string().min(1, "Docket number is required"),
  file: z.any().refine((files) => files?.length > 0, "File is required"),
})

type PSIUploadForm = z.infer<typeof psiUploadSchema>
type BailUploadForm = z.infer<typeof bailUploadSchema>
type SocialSummaryUploadForm = z.infer<typeof socialSummaryUploadSchema>

interface Document {
  id: string
  name: string
  type: string
  uploadedAt: Date
  uploadedBy: string
  size: string
  description: string
  // PSI specific
  sentenceDate?: string
  docketNumber?: string
  // Bail specific
  hearingDate?: string
  otn?: string
  // Social Summary specific
  dispositionDate?: string
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Bail_Report_2024_001.pdf",
      type: "PDF",
      uploadedAt: new Date("2024-01-15"),
      uploadedBy: "John Smith",
      size: "2.4 MB",
      description: "Bail report for case involving theft charges",
      hearingDate: "2024-02-01",
      otn: "OTN-2024-001234",
    },
  ])

  const psiForm = useForm<PSIUploadForm>({
    resolver: zodResolver(psiUploadSchema),
  })

  const bailForm = useForm<BailUploadForm>({
    resolver: zodResolver(bailUploadSchema),
  })

  const socialSummaryForm = useForm<SocialSummaryUploadForm>({
    resolver: zodResolver(socialSummaryUploadSchema),
  })

  const courts: CourtFolder[] = [
    { id: "1", name: "Magisterial District Court 15-1-01", districtNumber: "15-1-01", documentCount: 12 },
    { id: "2", name: "Magisterial District Court 15-1-02", districtNumber: "15-1-02", documentCount: 8 },
  ]

  const handlePSIUpload = (data: PSIUploadForm) => {
    const file = data.file[0]
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      uploadedAt: new Date(),
      uploadedBy: "Current User",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      description: data.description,
      sentenceDate: data.sentenceDate,
      docketNumber: data.docketNumber,
    }
    setDocuments([...documents, newDoc])
    toast.success("PSI Report uploaded successfully")
    setIsUploadDialogOpen(false)
    psiForm.reset()
  }

  const handleBailUpload = (data: BailUploadForm) => {
    const file = data.file[0]
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      uploadedAt: new Date(),
      uploadedBy: "Current User",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      description: data.description,
      hearingDate: data.hearingDate,
      otn: data.otn,
    }
    setDocuments([...documents, newDoc])
    toast.success("Bail Report uploaded successfully")
    setIsUploadDialogOpen(false)
    bailForm.reset()
  }

  const handleSocialSummaryUpload = (data: SocialSummaryUploadForm) => {
    const file = data.file[0]
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      uploadedAt: new Date(),
      uploadedBy: "Current User",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      description: data.description,
      dispositionDate: data.dispositionDate,
      docketNumber: data.docketNumber,
    }
    setDocuments([...documents, newDoc])
    toast.success("Social Summary Report uploaded successfully")
    setIsUploadDialogOpen(false)
    socialSummaryForm.reset()
  }

  const handleDeleteDocument = (docId: string) => {
    setDocumentToDelete(docId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete))
      toast.success("Document deleted successfully")
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
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

  const renderUploadDialog = () => {
    if (selectedReportType === "PSI Reports") {
      return (
        <form onSubmit={psiForm.handleSubmit(handlePSIUpload)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="psi-file">Select File *</Label>
            <Input id="psi-file" type="file" accept=".pdf,.doc,.docx" {...psiForm.register("file")} />
            {psiForm.formState.errors.file && (
              <p className="text-sm text-red-600">{psiForm.formState.errors.file.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="psi-description">Description *</Label>
            <Textarea
              id="psi-description"
              placeholder="Enter document description"
              {...psiForm.register("description")}
            />
            {psiForm.formState.errors.description && (
              <p className="text-sm text-red-600">{psiForm.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="psi-sentence-date">Sentence Date *</Label>
            <Input id="psi-sentence-date" type="date" {...psiForm.register("sentenceDate")} />
            {psiForm.formState.errors.sentenceDate && (
              <p className="text-sm text-red-600">{psiForm.formState.errors.sentenceDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="psi-docket">Docket Number *</Label>
            <Input id="psi-docket" placeholder="Enter docket number" {...psiForm.register("docketNumber")} />
            {psiForm.formState.errors.docketNumber && (
              <p className="text-sm text-red-600">{psiForm.formState.errors.docketNumber.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload Document</Button>
          </div>
        </form>
      )
    } else if (selectedReportType === "Bail Reports") {
      return (
        <form onSubmit={bailForm.handleSubmit(handleBailUpload)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bail-file">Select File *</Label>
            <Input id="bail-file" type="file" accept=".pdf,.doc,.docx" {...bailForm.register("file")} />
            {bailForm.formState.errors.file && (
              <p className="text-sm text-red-600">{bailForm.formState.errors.file.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bail-description">Description *</Label>
            <Textarea
              id="bail-description"
              placeholder="Enter document description"
              {...bailForm.register("description")}
            />
            {bailForm.formState.errors.description && (
              <p className="text-sm text-red-600">{bailForm.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bail-hearing-date">Hearing Date *</Label>
            <Input id="bail-hearing-date" type="date" {...bailForm.register("hearingDate")} />
            {bailForm.formState.errors.hearingDate && (
              <p className="text-sm text-red-600">{bailForm.formState.errors.hearingDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bail-otn">OTN (Offense Tracking Number) *</Label>
            <Input id="bail-otn" placeholder="Enter OTN" {...bailForm.register("otn")} />
            {bailForm.formState.errors.otn && (
              <p className="text-sm text-red-600">{bailForm.formState.errors.otn.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload Document</Button>
          </div>
        </form>
      )
    } else if (selectedReportType === "Social Summary Reports") {
      return (
        <form onSubmit={socialSummaryForm.handleSubmit(handleSocialSummaryUpload)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="social-file">Select File *</Label>
            <Input id="social-file" type="file" accept=".pdf,.doc,.docx" {...socialSummaryForm.register("file")} />
            {socialSummaryForm.formState.errors.file && (
              <p className="text-sm text-red-600">{socialSummaryForm.formState.errors.file.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="social-description">Description *</Label>
            <Textarea
              id="social-description"
              placeholder="Enter document description"
              {...socialSummaryForm.register("description")}
            />
            {socialSummaryForm.formState.errors.description && (
              <p className="text-sm text-red-600">{socialSummaryForm.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="social-disposition-date">Disposition Date *</Label>
            <Input id="social-disposition-date" type="date" {...socialSummaryForm.register("dispositionDate")} />
            {socialSummaryForm.formState.errors.dispositionDate && (
              <p className="text-sm text-red-600">{socialSummaryForm.formState.errors.dispositionDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="social-docket">Docket Number *</Label>
            <Input
              id="social-docket"
              placeholder="Enter docket number"
              {...socialSummaryForm.register("docketNumber")}
            />
            {socialSummaryForm.formState.errors.docketNumber && (
              <p className="text-sm text-red-600">{socialSummaryForm.formState.errors.docketNumber.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload Document</Button>
          </div>
        </form>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {(selectedReportType === "PSI Reports" ||
              selectedReportType === "Social Summary Reports" ||
              selectedCourt) && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Upload {selectedReportType}</DialogTitle>
                    <DialogDescription>
                      {selectedCourt
                        ? `Upload a document to ${selectedCourt.name}`
                        : `Upload a new ${selectedReportType?.slice(0, -1)}`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">{renderUploadDialog()}</div>
                </DialogContent>
              </Dialog>
            )}
          </div>

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

        {renderBreadcrumb()}

        {!selectedReportType ? (
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {documents.filter((d) => d.sentenceDate).length} documents
                  </span>
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {documents.filter((d) => d.dispositionDate).length} documents
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedReportType === "Bail Reports" && !selectedCourt ? (
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Description</TableHead>
                        {selectedReportType === "PSI Reports" && (
                          <>
                            <TableHead>Sentence Date</TableHead>
                            <TableHead>Docket Number</TableHead>
                          </>
                        )}
                        {selectedReportType === "Bail Reports" && (
                          <>
                            <TableHead>Hearing Date</TableHead>
                            <TableHead>OTN</TableHead>
                          </>
                        )}
                        {selectedReportType === "Social Summary Reports" && (
                          <>
                            <TableHead>Disposition Date</TableHead>
                            <TableHead>Docket Number</TableHead>
                          </>
                        )}
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              {doc.name}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{doc.description}</TableCell>
                          {selectedReportType === "PSI Reports" && (
                            <>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="w-3 h-3" />
                                  {doc.sentenceDate}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{doc.docketNumber}</Badge>
                              </TableCell>
                            </>
                          )}
                          {selectedReportType === "Bail Reports" && (
                            <>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="w-3 h-3" />
                                  {doc.hearingDate}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{doc.otn}</Badge>
                              </TableCell>
                            </>
                          )}
                          {selectedReportType === "Social Summary Reports" && (
                            <>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="w-3 h-3" />
                                  {doc.dispositionDate}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{doc.docketNumber}</Badge>
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <User className="w-3 h-3" />
                              {doc.uploadedBy}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {doc.uploadedAt.toLocaleDateString()} {doc.uploadedAt.toLocaleTimeString()}
                          </TableCell>
                          <TableCell className="text-sm">{doc.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
