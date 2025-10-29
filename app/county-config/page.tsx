"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Plus, Trash2, Edit2, Save, X, FolderPlus } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface MagisterialCourt {
  id: string
  name: string
  districtNumber: string
  address: string
  createdAt: Date
}

interface DocumentRepository {
  id: string
  name: string
  description: string
  metadataFields: MetadataField[]
  createdAt: Date
}

interface MetadataField {
  id: string
  name: string
  label: string
  type: "text" | "date" | "textarea"
  required: boolean
}

export default function CountyConfigPage() {
  const [courts, setCourts] = useState<MagisterialCourt[]>([
    {
      id: "1",
      name: "Magisterial District Court 15-1-01",
      districtNumber: "15-1-01",
      address: "123 Court Street, Philadelphia, PA",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Magisterial District Court 15-1-02",
      districtNumber: "15-1-02",
      address: "456 Justice Ave, Philadelphia, PA",
      createdAt: new Date(),
    },
  ])

  const [repositories, setRepositories] = useState<DocumentRepository[]>([
    {
      id: "psi",
      name: "PSI Reports",
      description: "Pre-Sentence Investigation Reports",
      metadataFields: [
        { id: "1", name: "description", label: "Description", type: "textarea", required: true },
        { id: "2", name: "sentenceDate", label: "Sentence Date", type: "date", required: true },
        { id: "3", name: "docketNumber", label: "Docket Number", type: "text", required: true },
      ],
      createdAt: new Date(),
    },
    {
      id: "bail",
      name: "Bail Reports",
      description: "Bail Reports organized by Magisterial District Courts",
      metadataFields: [
        { id: "1", name: "description", label: "Description", type: "textarea", required: true },
        { id: "2", name: "hearingDate", label: "Hearing Date", type: "date", required: true },
        { id: "3", name: "otn", label: "OTN (Offense Tracking Number)", type: "text", required: true },
      ],
      createdAt: new Date(),
    },
    {
      id: "social",
      name: "Social Summary Reports",
      description: "Social background and context reports",
      metadataFields: [
        { id: "1", name: "description", label: "Description", type: "textarea", required: true },
        { id: "2", name: "dispositionDate", label: "Disposition Date", type: "date", required: true },
        { id: "3", name: "docketNumber", label: "Docket Number", type: "text", required: true },
      ],
      createdAt: new Date(),
    },
  ])

  const [isCourtDialogOpen, setIsCourtDialogOpen] = useState(false)
  const [isRepoDialogOpen, setIsRepoDialogOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState<MagisterialCourt | null>(null)
  const [editingRepo, setEditingRepo] = useState<DocumentRepository | null>(null)

  const [courtFormData, setCourtFormData] = useState({
    name: "",
    districtNumber: "",
    address: "",
  })

  const [repoFormData, setRepoFormData] = useState({
    name: "",
    description: "",
    metadataFields: [] as MetadataField[],
  })

  const handleAddCourt = () => {
    if (!courtFormData.name || !courtFormData.districtNumber || !courtFormData.address) {
      toast.error("Please fill in all fields")
      return
    }

    const newCourt: MagisterialCourt = {
      id: Date.now().toString(),
      name: courtFormData.name,
      districtNumber: courtFormData.districtNumber,
      address: courtFormData.address,
      createdAt: new Date(),
    }

    setCourts([...courts, newCourt])
    localStorage.setItem("magistrialCourts", JSON.stringify([...courts, newCourt]))
    setCourtFormData({ name: "", districtNumber: "", address: "" })
    setIsCourtDialogOpen(false)
    toast.success("Magisterial District Court added successfully")
  }

  const handleEditCourt = (court: MagisterialCourt) => {
    setEditingCourt(court)
    setCourtFormData({
      name: court.name,
      districtNumber: court.districtNumber,
      address: court.address,
    })
    setIsCourtDialogOpen(true)
  }

  const handleUpdateCourt = () => {
    if (!editingCourt) return

    if (!courtFormData.name || !courtFormData.districtNumber || !courtFormData.address) {
      toast.error("Please fill in all fields")
      return
    }

    const updated = courts.map((court) =>
      court.id === editingCourt.id
        ? {
            ...court,
            name: courtFormData.name,
            districtNumber: courtFormData.districtNumber,
            address: courtFormData.address,
          }
        : court,
    )

    setCourts(updated)
    localStorage.setItem("magistrialCourts", JSON.stringify(updated))
    setEditingCourt(null)
    setCourtFormData({ name: "", districtNumber: "", address: "" })
    setIsCourtDialogOpen(false)
    toast.success("Magisterial District Court updated successfully")
  }

  const handleDeleteCourt = (id: string) => {
    const updated = courts.filter((court) => court.id !== id)
    setCourts(updated)
    localStorage.setItem("magistrialCourts", JSON.stringify(updated))
    toast.success("Magisterial District Court deleted successfully")
  }

  const handleCourtDialogClose = () => {
    setIsCourtDialogOpen(false)
    setEditingCourt(null)
    setCourtFormData({ name: "", districtNumber: "", address: "" })
  }

  const handleAddRepository = () => {
    if (!repoFormData.name || !repoFormData.description) {
      toast.error("Please fill in repository name and description")
      return
    }

    if (repoFormData.metadataFields.length === 0) {
      toast.error("Please add at least one metadata field")
      return
    }

    const newRepo: DocumentRepository = {
      id: Date.now().toString(),
      name: repoFormData.name,
      description: repoFormData.description,
      metadataFields: repoFormData.metadataFields,
      createdAt: new Date(),
    }

    const updated = [...repositories, newRepo]
    setRepositories(updated)
    localStorage.setItem("documentRepositories", JSON.stringify(updated))
    setRepoFormData({ name: "", description: "", metadataFields: [] })
    setIsRepoDialogOpen(false)
    toast.success("Document repository added successfully")
  }

  const handleEditRepository = (repo: DocumentRepository) => {
    setEditingRepo(repo)
    setRepoFormData({
      name: repo.name,
      description: repo.description,
      metadataFields: [...repo.metadataFields],
    })
    setIsRepoDialogOpen(true)
  }

  const handleUpdateRepository = () => {
    if (!editingRepo) return

    if (!repoFormData.name || !repoFormData.description) {
      toast.error("Please fill in repository name and description")
      return
    }

    if (repoFormData.metadataFields.length === 0) {
      toast.error("Please add at least one metadata field")
      return
    }

    const updated = repositories.map((repo) =>
      repo.id === editingRepo.id
        ? {
            ...repo,
            name: repoFormData.name,
            description: repoFormData.description,
            metadataFields: repoFormData.metadataFields,
          }
        : repo,
    )

    setRepositories(updated)
    localStorage.setItem("documentRepositories", JSON.stringify(updated))
    setEditingRepo(null)
    setRepoFormData({ name: "", description: "", metadataFields: [] })
    setIsRepoDialogOpen(false)
    toast.success("Document repository updated successfully")
  }

  const handleDeleteRepository = (id: string) => {
    const updated = repositories.filter((repo) => repo.id !== id)
    setRepositories(updated)
    localStorage.setItem("documentRepositories", JSON.stringify(updated))
    toast.success("Document repository deleted successfully")
  }

  const handleRepoDialogClose = () => {
    setIsRepoDialogOpen(false)
    setEditingRepo(null)
    setRepoFormData({ name: "", description: "", metadataFields: [] })
  }

  const addMetadataField = () => {
    const newField: MetadataField = {
      id: Date.now().toString(),
      name: "",
      label: "",
      type: "text",
      required: true,
    }
    setRepoFormData({
      ...repoFormData,
      metadataFields: [...repoFormData.metadataFields, newField],
    })
  }

  const updateMetadataField = (id: string, updates: Partial<MetadataField>) => {
    setRepoFormData({
      ...repoFormData,
      metadataFields: repoFormData.metadataFields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
    })
  }

  const removeMetadataField = (id: string) => {
    setRepoFormData({
      ...repoFormData,
      metadataFields: repoFormData.metadataFields.filter((field) => field.id !== id),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">County Configuration</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage document repositories and magisterial district courts
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="repositories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="repositories">Document Repositories</TabsTrigger>
            <TabsTrigger value="courts">District Courts</TabsTrigger>
          </TabsList>

          <TabsContent value="repositories">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Document Repositories</CardTitle>
                    <CardDescription className="mt-1">
                      Configure custom document types with their own metadata fields
                    </CardDescription>
                  </div>
                  <Dialog open={isRepoDialogOpen} onOpenChange={setIsRepoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleRepoDialogClose()} className="gap-2">
                        <FolderPlus className="w-4 h-4" />
                        Add Repository
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingRepo ? "Edit" : "Add"} Document Repository</DialogTitle>
                        <DialogDescription>
                          Create a custom document repository with specific metadata fields
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="repo-name">Repository Name *</Label>
                          <Input
                            id="repo-name"
                            placeholder="e.g., Probation Reports"
                            value={repoFormData.name}
                            onChange={(e) => setRepoFormData({ ...repoFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="repo-description">Description *</Label>
                          <Textarea
                            id="repo-description"
                            placeholder="Brief description of this document type"
                            value={repoFormData.description}
                            onChange={(e) => setRepoFormData({ ...repoFormData, description: e.target.value })}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Metadata Fields</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addMetadataField}>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Field
                            </Button>
                          </div>

                          {repoFormData.metadataFields.map((field, index) => (
                            <Card key={field.id} className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Field {index + 1}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMetadataField(field.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label>Field Name (for code)</Label>
                                    <Input
                                      placeholder="e.g., caseNumber"
                                      value={field.name}
                                      onChange={(e) => updateMetadataField(field.id, { name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Field Label (display)</Label>
                                    <Input
                                      placeholder="e.g., Case Number"
                                      value={field.label}
                                      onChange={(e) => updateMetadataField(field.id, { label: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label>Field Type</Label>
                                    <select
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      value={field.type}
                                      onChange={(e) =>
                                        updateMetadataField(field.id, { type: e.target.value as MetadataField["type"] })
                                      }
                                    >
                                      <option value="text">Text</option>
                                      <option value="date">Date</option>
                                      <option value="textarea">Textarea</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Required</Label>
                                    <select
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      value={field.required ? "yes" : "no"}
                                      onChange={(e) =>
                                        updateMetadataField(field.id, { required: e.target.value === "yes" })
                                      }
                                    >
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}

                          {repoFormData.metadataFields.length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed rounded-lg">
                              <p className="text-sm text-gray-500">No metadata fields added yet</p>
                              <p className="text-xs text-gray-400 mt-1">Click "Add Field" to create custom fields</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleRepoDialogClose}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={editingRepo ? handleUpdateRepository : handleAddRepository}>
                          <Save className="w-4 h-4 mr-2" />
                          {editingRepo ? "Update" : "Add"} Repository
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {repositories.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Repositories Configured
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add your first document repository to get started
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Repository Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Metadata Fields</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repositories.map((repo) => (
                        <TableRow key={repo.id}>
                          <TableCell className="font-medium">{repo.name}</TableCell>
                          <TableCell>{repo.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {repo.metadataFields.map((field) => (
                                <span key={field.id} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {field.label}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditRepository(repo)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRepository(repo.id)}
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
                )}
              </CardContent>
            </Card>

            <Card className="mt-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FolderPlus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Dynamic Document Repositories
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Create custom document repositories with their own metadata fields. Each repository will appear in
                      the Documents section and Access Control module. Define the specific information you need to
                      capture for each document type.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courts">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Magisterial District Courts</CardTitle>
                    <CardDescription className="mt-1">
                      Configure district courts that will appear as folders in Bail Reports
                    </CardDescription>
                  </div>
                  <Dialog open={isCourtDialogOpen} onOpenChange={setIsCourtDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleCourtDialogClose()} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Court
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{editingCourt ? "Edit" : "Add"} Magisterial District Court</DialogTitle>
                        <DialogDescription>
                          {editingCourt ? "Update" : "Enter"} the details for the magisterial district court
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Court Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Magisterial District Court 15-1-01"
                            value={courtFormData.name}
                            onChange={(e) => setCourtFormData({ ...courtFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="districtNumber">District Number</Label>
                          <Input
                            id="districtNumber"
                            placeholder="e.g., 15-1-01"
                            value={courtFormData.districtNumber}
                            onChange={(e) => setCourtFormData({ ...courtFormData, districtNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            placeholder="e.g., 123 Court Street, Philadelphia, PA"
                            value={courtFormData.address}
                            onChange={(e) => setCourtFormData({ ...courtFormData, address: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCourtDialogClose}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={editingCourt ? handleUpdateCourt : handleAddCourt}>
                          <Save className="w-4 h-4 mr-2" />
                          {editingCourt ? "Update" : "Add"} Court
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {courts.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Courts Configured</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add your first magisterial district court to get started
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Court Name</TableHead>
                        <TableHead>District Number</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courts.map((court) => (
                        <TableRow key={court.id}>
                          <TableCell className="font-medium">{court.name}</TableCell>
                          <TableCell>{court.districtNumber}</TableCell>
                          <TableCell>{court.address}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditCourt(court)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCourt(court.id)}
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
                )}
              </CardContent>
            </Card>

            <Card className="mt-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      About Magisterial District Courts
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Each magisterial district court you add here will automatically appear as a folder in the Bail
                      Reports section. Users can upload bail reports to specific court folders, making it easy to
                      organize documents by district.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
