"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Users, FolderLock, Search, Plus, X, Check, Settings, FileText } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AccessPermission {
  userId: string
  reportType: string
  bailCourtId?: string
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

interface MagisterialCourt {
  id: string
  name: string
  districtNumber: string
}

interface DocumentRepository {
  id: string
  name: string
  code: string
  metadataFields: Array<{
    id: string
    name: string
    label: string
    type: string
    required: boolean
  }>
}

export default function AccessControlPage() {
  const [users] = useState<User[]>([
    { id: "1", name: "John Smith", email: "john.smith@county.gov", role: "Judge" },
    { id: "2", name: "Sarah Johnson", email: "sarah.j@county.gov", role: "District Attorney" },
    { id: "3", name: "Michael Brown", email: "m.brown@county.gov", role: "Probation Officer" },
    { id: "4", name: "Emily Davis", email: "emily.d@county.gov", role: "Court Administrator" },
    { id: "5", name: "Robert Wilson", email: "r.wilson@county.gov", role: "Case Manager" },
  ])

  const [courts] = useState<MagisterialCourt[]>([
    { id: "1", name: "Magisterial District Court 15-1-01", districtNumber: "15-1-01" },
    { id: "2", name: "Magisterial District Court 15-1-02", districtNumber: "15-1-02" },
  ])

  const [repositories, setRepositories] = useState<DocumentRepository[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("documentRepositories")
    if (stored) {
      setRepositories(JSON.parse(stored))
    } else {
      // Initialize with default repositories if none exist
      const defaultRepos: DocumentRepository[] = [
        {
          id: "1",
          name: "PSI Reports",
          code: "psi",
          metadataFields: [
            { id: "1", name: "description", label: "Description", type: "textarea", required: true },
            { id: "2", name: "sentenceDate", label: "Sentence Date", type: "date", required: true },
            { id: "3", name: "docketNumber", label: "Docket Number", type: "text", required: true },
          ],
        },
        {
          id: "2",
          name: "Bail Reports",
          code: "bail",
          metadataFields: [
            { id: "1", name: "description", label: "Description", type: "textarea", required: true },
            { id: "2", name: "hearingDate", label: "Hearing Date", type: "date", required: true },
            { id: "3", name: "otn", label: "OTN (Offense Tracking Number)", type: "text", required: true },
          ],
        },
        {
          id: "3",
          name: "Social Summary Reports",
          code: "social",
          metadataFields: [
            { id: "1", name: "description", label: "Description", type: "textarea", required: true },
            { id: "2", name: "dispositionDate", label: "Disposition Date", type: "date", required: true },
            { id: "3", name: "docketNumber", label: "Docket Number", type: "text", required: true },
          ],
        },
      ]
      setRepositories(defaultRepos)
      localStorage.setItem("documentRepositories", JSON.stringify(defaultRepos))
    }
  }, [])

  const [permissions, setPermissions] = useState<AccessPermission[]>([
    { userId: "1", reportType: "psi", canView: true, canCreate: false, canEdit: false, canDelete: false },
    { userId: "1", reportType: "social", canView: true, canCreate: false, canEdit: false, canDelete: false },
    { userId: "1", reportType: "users", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { userId: "2", reportType: "psi", canView: true, canCreate: true, canEdit: true, canDelete: false },
    {
      userId: "3",
      reportType: "bail",
      bailCourtId: "1",
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
    },
  ])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReportType, setSelectedReportType] = useState<string>("users")
  const [selectedCourt, setSelectedCourt] = useState<string>("")
  const [permissionForm, setPermissionForm] = useState({
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getUserPermissions = (userId: string, reportType: string, courtId?: string) => {
    return permissions.find(
      (p) => p.userId === userId && p.reportType === reportType && (reportType !== "bail" || p.bailCourtId === courtId),
    )
  }

  const handleAddPermission = () => {
    if (!selectedUser) return

    console.log("[v0] ===== SAVING PERMISSION =====")
    console.log("[v0] Current selectedReportType state:", selectedReportType)
    console.log("[v0] Current selectedUser:", selectedUser.name, selectedUser.id)
    console.log("[v0] Current selectedCourt:", selectedCourt)
    console.log("[v0] Current permissionForm:", permissionForm)

    if (selectedReportType === "bail" && !selectedCourt) {
      toast.error("Please select a magisterial district court for Bail Reports")
      return
    }

    const newPermission: AccessPermission = {
      userId: selectedUser.id,
      reportType: selectedReportType,
      bailCourtId: selectedReportType === "bail" ? selectedCourt : undefined,
      canView: permissionForm.canView,
      canCreate: permissionForm.canCreate,
      canEdit: permissionForm.canEdit,
      canDelete: permissionForm.canDelete,
    }

    console.log("[v0] Created new permission object:", JSON.stringify(newPermission, null, 2))

    const existingIndex = permissions.findIndex(
      (p) =>
        p.userId === selectedUser.id &&
        p.reportType === selectedReportType &&
        (selectedReportType !== "bail" || p.bailCourtId === selectedCourt),
    )

    console.log("[v0] Searching for existing permission with criteria:", {
      userId: selectedUser.id,
      reportType: selectedReportType,
      bailCourtId: selectedReportType === "bail" ? selectedCourt : undefined,
    })
    console.log("[v0] Found at index:", existingIndex)

    let updatedPermissions: AccessPermission[]

    if (existingIndex >= 0) {
      updatedPermissions = [...permissions]
      console.log("[v0] BEFORE update - permission at index", existingIndex, ":", updatedPermissions[existingIndex])
      updatedPermissions[existingIndex] = newPermission
      console.log("[v0] AFTER update - permission at index", existingIndex, ":", updatedPermissions[existingIndex])
      toast.success(`${getModuleName(selectedReportType)} permissions updated successfully`)
    } else {
      updatedPermissions = [...permissions, newPermission]
      console.log("[v0] Added NEW permission to array")
      toast.success(`${getModuleName(selectedReportType)} permissions added successfully`)
    }

    const userPerms = updatedPermissions.filter((p) => p.userId === selectedUser.id)
    console.log("[v0] All permissions for user", selectedUser.name, "after save:")
    userPerms.forEach((p) => {
      console.log(
        `  - ${getModuleName(p.reportType)}: View=${p.canView}, Create=${p.canCreate}, Edit=${p.canEdit}, Delete=${p.canDelete}`,
      )
    })

    console.log("[v0] Total permissions in array:", updatedPermissions.length)

    setPermissions(updatedPermissions)
    localStorage.setItem("userPermissions", JSON.stringify(updatedPermissions))

    setIsDialogOpen(false)
    resetForm()
  }

  const handleRemovePermission = (userId: string, reportType: string, courtId?: string) => {
    const updated = permissions.filter(
      (p) =>
        !(p.userId === userId && p.reportType === reportType && (reportType !== "bail" || p.bailCourtId === courtId)),
    )
    setPermissions(updated)
    localStorage.setItem("userPermissions", JSON.stringify(updated))
    toast.success("Access permission removed")
  }

  const resetForm = () => {
    setSelectedUser(null)
    setSelectedReportType("users")
    setSelectedCourt("")
    setPermissionForm({
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
    })
  }

  const openEditDialog = (user: User, reportType: string, courtId?: string) => {
    console.log("[v0] ===== OPENING DIALOG =====")
    console.log("[v0] Button clicked for module:", reportType)
    console.log("[v0] User:", user.name, user.id)
    console.log("[v0] Court ID:", courtId)

    setSelectedUser(user)
    setSelectedReportType(reportType)
    setSelectedCourt(courtId || "")

    const existing = getUserPermissions(user.id, reportType, courtId)

    console.log("[v0] Looking for existing permission with:", { userId: user.id, reportType, courtId })
    console.log("[v0] Found existing permission:", existing)

    if (existing) {
      setPermissionForm({
        canView: existing.canView,
        canCreate: existing.canCreate,
        canEdit: existing.canEdit,
        canDelete: existing.canDelete,
      })
    } else {
      setPermissionForm({
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      })
    }

    setTimeout(() => {
      console.log("[v0] Dialog opening with selectedReportType:", reportType)
      console.log("[v0] Module name will be:", getModuleName(reportType))
      setIsDialogOpen(true)
    }, 50)
  }

  const getRepositoryByCode = (code: string) => {
    return repositories.find((r) => r.code === code)
  }

  const getModuleIcon = (moduleType: string) => {
    if (moduleType === "users") return <Users className="w-4 h-4" />
    if (moduleType === "county-config") return <Settings className="w-4 h-4" />
    if (moduleType === "bail") return <FolderLock className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const getModuleName = (moduleType: string) => {
    if (moduleType === "users") return "User Management"
    if (moduleType === "county-config") return "County Configuration"
    const repo = getRepositoryByCode(moduleType)
    return repo ? repo.name : moduleType
  }

  const allModules = [
    ...repositories.map((r) => ({ type: r.code, name: r.name, isRepository: true })),
    { type: "users", name: "User Management", isRepository: false },
    { type: "county-config", name: "County Configuration", isRepository: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Access Control</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage user permissions for reports and system modules</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Configure Access Permission</DialogTitle>
                <DialogDescription>Grant or modify user access to specific report types and modules</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select User</Label>
                  <Select
                    value={selectedUser?.id || ""}
                    onValueChange={(value) => {
                      const user = users.find((u) => u.id === value)
                      setSelectedUser(user || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-gray-500">
                              {user.role} - {user.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUser ? (
                  <div className="space-y-2">
                    <Label>Module / Report Type</Label>
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
                      {getModuleIcon(selectedReportType)}
                      <span className="font-medium">{getModuleName(selectedReportType)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Click "Grant" or "Edit" on a specific module row to configure its permissions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Module / Report Type</Label>
                    <Select value={selectedReportType} onValueChange={(value: string) => setSelectedReportType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {repositories.map((repo) => (
                          <SelectItem key={repo.id} value={repo.code}>
                            {repo.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="users">User Management</SelectItem>
                        <SelectItem value="county-config">County Configuration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedReportType === "bail" && selectedCourt && (
                  <div className="space-y-2">
                    <Label>Magisterial District Court</Label>
                    <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
                      <span className="font-medium">
                        {courts.find((c) => c.id === selectedCourt)?.name || "Unknown Court"}
                      </span>
                    </div>
                  </div>
                )}

                {selectedReportType === "bail" && !selectedCourt && (
                  <div className="space-y-2">
                    <Label>Magisterial District Court</Label>
                    <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a court folder" />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court) => (
                          <SelectItem key={court.id} value={court.id}>
                            {court.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canView"
                        checked={permissionForm.canView}
                        onCheckedChange={(checked) =>
                          setPermissionForm({ ...permissionForm, canView: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="canView"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        View - Can view and read
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canCreate"
                        checked={permissionForm.canCreate}
                        onCheckedChange={(checked) =>
                          setPermissionForm({ ...permissionForm, canCreate: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="canCreate"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Create - Can add new items
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canEdit"
                        checked={permissionForm.canEdit}
                        onCheckedChange={(checked) =>
                          setPermissionForm({ ...permissionForm, canEdit: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="canEdit"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Edit - Can modify existing items
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canDelete"
                        checked={permissionForm.canDelete}
                        onCheckedChange={(checked) =>
                          setPermissionForm({ ...permissionForm, canDelete: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="canDelete"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Delete - Can remove items
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPermission} disabled={!selectedUser}>
                  <Check className="w-4 h-4 mr-2" />
                  Save Permission
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const userPermissions = permissions.filter((p) => p.userId === user.id)

            return (
              <Card key={user.id} className="shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {user.role} • {user.email}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {userPermissions.length} {userPermissions.length === 1 ? "Permission" : "Permissions"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Module / Repository</TableHead>
                          <TableHead className="text-center">View</TableHead>
                          <TableHead className="text-center">Create</TableHead>
                          <TableHead className="text-center">Edit</TableHead>
                          <TableHead className="text-center">Delete</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allModules.map((module) => {
                          if (module.type === "bail") {
                            return courts.map((court) => {
                              const perm = getUserPermissions(user.id, module.type, court.id)
                              return (
                                <TableRow key={`${user.id}-${module.type}-${court.id}`}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {getModuleIcon(module.type)}
                                      <div>
                                        <div className="font-medium text-sm">{module.name}</div>
                                        <div className="text-xs text-gray-500">{court.name}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {perm?.canView ? (
                                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                                    ) : (
                                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {perm?.canCreate ? (
                                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                                    ) : (
                                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {perm?.canEdit ? (
                                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                                    ) : (
                                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {perm?.canDelete ? (
                                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                                    ) : (
                                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        console.log("[v0] Clicked Grant/Edit for:", {
                                          user: user.name,
                                          module: module.name,
                                          moduleType: module.type,
                                          court: court.name,
                                          courtId: court.id,
                                        })
                                        openEditDialog(user, module.type, court.id)
                                      }}
                                    >
                                      {perm ? "Edit" : "Grant"}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          }

                          const perm = getUserPermissions(user.id, module.type)
                          return (
                            <TableRow key={`${user.id}-${module.type}`}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getModuleIcon(module.type)}
                                  <span className="font-medium text-sm">{module.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {perm?.canView ? (
                                  <Check className="w-4 h-4 text-green-600 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-gray-300 mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {perm?.canCreate ? (
                                  <Check className="w-4 h-4 text-green-600 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-gray-300 mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {perm?.canEdit ? (
                                  <Check className="w-4 h-4 text-green-600 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-gray-300 mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {perm?.canDelete ? (
                                  <Check className="w-4 h-4 text-green-600 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-gray-300 mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    console.log("[v0] Clicked Grant/Edit for:", {
                                      user: user.name,
                                      module: module.name,
                                      moduleType: module.type,
                                    })
                                    openEditDialog(user, module.type)
                                  }}
                                >
                                  {perm ? "Edit" : "Grant"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Granular Access Control</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Configure precise permissions for each user across all document repositories and system modules. Each
                  module can have independent CRUD permissions (View, Create, Edit, Delete). For Bail Reports, you can
                  grant access to specific Magisterial District Court folders. New document repositories added in County
                  Config will automatically appear in this table for permission assignment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
