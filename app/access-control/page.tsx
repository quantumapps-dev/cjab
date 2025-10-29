"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Users, FolderLock, Search, Plus, X, Check, Settings } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

    if (selectedReportType === "bail" && !selectedCourt) {
      toast.error("Please select a magisterial district court for Bail Reports")
      return
    }

    const newPermission: AccessPermission = {
      userId: selectedUser.id,
      reportType: selectedReportType,
      bailCourtId: selectedReportType === "bail" ? selectedCourt : undefined,
      ...permissionForm,
    }

    const existingIndex = permissions.findIndex(
      (p) =>
        p.userId === selectedUser.id &&
        p.reportType === selectedReportType &&
        (selectedReportType !== "bail" || p.bailCourtId === selectedCourt),
    )

    if (existingIndex >= 0) {
      const updated = [...permissions]
      updated[existingIndex] = newPermission
      setPermissions(updated)
      toast.success("Access permissions updated successfully")
    } else {
      setPermissions([...permissions, newPermission])
      toast.success("Access permissions added successfully")
    }

    localStorage.setItem("userPermissions", JSON.stringify(permissions))

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
    setSelectedUser(user)
    setSelectedReportType(reportType)
    setSelectedCourt(courtId || "")

    const existing = getUserPermissions(user.id, reportType, courtId)
    if (existing) {
      setPermissionForm({
        canView: existing.canView,
        canCreate: existing.canCreate,
        canEdit: existing.canEdit,
        canDelete: existing.canDelete,
      })
    }

    setIsDialogOpen(true)
  }

  const getRepositoryByCode = (code: string) => {
    return repositories.find((r) => r.code === code)
  }

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

                {selectedReportType === "bail" && (
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
                        {selectedReportType === "users"
                          ? "View - Can view user list"
                          : selectedReportType === "county-config"
                            ? "View - Can view county configuration settings"
                            : getRepositoryByCode(selectedReportType)?.name
                              ? `View - Can view ${getRepositoryByCode(selectedReportType)?.name} documents`
                              : "View - Can view and read documents"}
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
                        {selectedReportType === "users"
                          ? "Create - Can add new users"
                          : selectedReportType === "county-config"
                            ? "Create - Can add new county configuration settings"
                            : getRepositoryByCode(selectedReportType)?.name
                              ? `Create - Can upload new ${getRepositoryByCode(selectedReportType)?.name} documents`
                              : "Create - Can upload new documents"}
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
                        {selectedReportType === "users"
                          ? "Edit - Can modify user details"
                          : selectedReportType === "county-config"
                            ? "Edit - Can modify county configuration settings"
                            : getRepositoryByCode(selectedReportType)?.name
                              ? `Edit - Can modify existing ${getRepositoryByCode(selectedReportType)?.name} documents`
                              : "Edit - Can modify existing documents"}
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
                        {selectedReportType === "users"
                          ? "Delete - Can remove users"
                          : selectedReportType === "county-config"
                            ? "Delete - Can remove county configuration settings"
                            : getRepositoryByCode(selectedReportType)?.name
                              ? `Delete - Can remove ${getRepositoryByCode(selectedReportType)?.name} documents`
                              : "Delete - Can remove documents"}
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
                  <Tabs defaultValue={repositories.length > 0 ? repositories[0]?.code : "users"} className="w-full">
                    <TabsList className={`grid w-full grid-cols-${repositories.length + 2}`}>
                      {repositories.map((repo) => (
                        <TabsTrigger key={repo.id} value={repo.code}>
                          {repo.name}
                        </TabsTrigger>
                      ))}
                      <TabsTrigger value="users">User Mgmt</TabsTrigger>
                      <TabsTrigger value="county-config">County Config</TabsTrigger>
                    </TabsList>

                    {repositories.map((repo) => (
                      <TabsContent key={repo.id} value={repo.code} className="space-y-3">
                        {repo.code === "bail" ? (
                          // Special handling for Bail Reports with court folders
                          <>
                            {courts.map((court) => {
                              const perm = getUserPermissions(user.id, repo.code, court.id)
                              return (
                                <div key={court.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <FolderLock className="w-4 h-4 text-blue-600" />
                                      <div>
                                        <span className="font-medium text-sm block">{court.name}</span>
                                        <span className="text-xs text-gray-500">{court.districtNumber}</span>
                                      </div>
                                    </div>
                                    {perm ? (
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => openEditDialog(user, repo.code, court.id)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemovePermission(user.id, repo.code, court.id)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUser(user)
                                          setSelectedReportType(repo.code)
                                          setSelectedCourt(court.id)
                                          setIsDialogOpen(true)
                                        }}
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Grant
                                      </Button>
                                    )}
                                  </div>
                                  {perm && (
                                    <div className="flex flex-wrap gap-2">
                                      {perm.canView && <Badge variant="secondary">View</Badge>}
                                      {perm.canCreate && <Badge variant="secondary">Create</Badge>}
                                      {perm.canEdit && <Badge variant="secondary">Edit</Badge>}
                                      {perm.canDelete && <Badge variant="secondary">Delete</Badge>}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                            {courts.length === 0 && (
                              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                <p className="text-sm">No magisterial district courts configured</p>
                                <p className="text-xs mt-1">Add courts in County Configuration first</p>
                              </div>
                            )}
                          </>
                        ) : (
                          // Standard repository without subfolders
                          (() => {
                            const perm = getUserPermissions(user.id, repo.code)
                            return perm ? (
                              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <FolderLock className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-sm">{repo.name} Access</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(user, repo.code)}>
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemovePermission(user.id, repo.code)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {perm.canView && <Badge variant="secondary">View</Badge>}
                                  {perm.canCreate && <Badge variant="secondary">Create</Badge>}
                                  {perm.canEdit && <Badge variant="secondary">Edit</Badge>}
                                  {perm.canDelete && <Badge variant="secondary">Delete</Badge>}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                <p className="text-sm mb-2">No access configured</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setSelectedReportType(repo.code)
                                    setIsDialogOpen(true)
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Grant Access
                                </Button>
                              </div>
                            )
                          })()
                        )}
                      </TabsContent>
                    ))}

                    <TabsContent value="users" className="space-y-3">
                      {(() => {
                        const perm = getUserPermissions(user.id, "users")
                        return perm ? (
                          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">User Management Access</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(user, "users")}>
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemovePermission(user.id, "users")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {perm.canView && <Badge variant="secondary">View</Badge>}
                              {perm.canCreate && <Badge variant="secondary">Create</Badge>}
                              {perm.canEdit && <Badge variant="secondary">Edit</Badge>}
                              {perm.canDelete && <Badge variant="secondary">Delete</Badge>}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <p className="text-sm mb-2">No access configured</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setSelectedReportType("users")
                                setIsDialogOpen(true)
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Grant Access
                            </Button>
                          </div>
                        )
                      })()}
                    </TabsContent>

                    <TabsContent value="county-config" className="space-y-3">
                      {(() => {
                        const perm = getUserPermissions(user.id, "county-config")
                        return perm ? (
                          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">County Configuration Access</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(user, "county-config")}>
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemovePermission(user.id, "county-config")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {perm.canView && <Badge variant="secondary">View</Badge>}
                              {perm.canCreate && <Badge variant="secondary">Create</Badge>}
                              {perm.canEdit && <Badge variant="secondary">Edit</Badge>}
                              {perm.canDelete && <Badge variant="secondary">Delete</Badge>}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <p className="text-sm mb-2">No access configured</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setSelectedReportType("county-config")
                                setIsDialogOpen(true)
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Grant Access
                            </Button>
                          </div>
                        )
                      })()}
                    </TabsContent>
                  </Tabs>
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
                  Configure precise permissions for each user across different report types and system modules. For Bail
                  Reports, you can grant access to specific Magisterial District Court folders. Control who can view,
                  create, edit, and delete users through the User Management module permissions. Additionally, manage
                  access to County Configuration settings. New document repositories added in County Config will
                  automatically appear here for permission assignment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
