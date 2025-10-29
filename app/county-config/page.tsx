"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Plus, Trash2, Edit2, Save, X } from "lucide-react"
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

interface MagisterialCourt {
  id: string
  name: string
  districtNumber: string
  address: string
  createdAt: Date
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState<MagisterialCourt | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    districtNumber: "",
    address: "",
  })

  const handleAddCourt = () => {
    if (!formData.name || !formData.districtNumber || !formData.address) {
      toast.error("Please fill in all fields")
      return
    }

    const newCourt: MagisterialCourt = {
      id: Date.now().toString(),
      name: formData.name,
      districtNumber: formData.districtNumber,
      address: formData.address,
      createdAt: new Date(),
    }

    setCourts([...courts, newCourt])
    setFormData({ name: "", districtNumber: "", address: "" })
    setIsDialogOpen(false)
    toast.success("Magisterial District Court added successfully")
  }

  const handleEditCourt = (court: MagisterialCourt) => {
    setEditingCourt(court)
    setFormData({
      name: court.name,
      districtNumber: court.districtNumber,
      address: court.address,
    })
    setIsDialogOpen(true)
  }

  const handleUpdateCourt = () => {
    if (!editingCourt) return

    if (!formData.name || !formData.districtNumber || !formData.address) {
      toast.error("Please fill in all fields")
      return
    }

    setCourts(
      courts.map((court) =>
        court.id === editingCourt.id
          ? {
              ...court,
              name: formData.name,
              districtNumber: formData.districtNumber,
              address: formData.address,
            }
          : court,
      ),
    )

    setEditingCourt(null)
    setFormData({ name: "", districtNumber: "", address: "" })
    setIsDialogOpen(false)
    toast.success("Magisterial District Court updated successfully")
  }

  const handleDeleteCourt = (id: string) => {
    setCourts(courts.filter((court) => court.id !== id))
    toast.success("Magisterial District Court deleted successfully")
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingCourt(null)
    setFormData({ name: "", districtNumber: "", address: "" })
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
              <p className="text-gray-600 dark:text-gray-400">Manage Magisterial District Courts for Bail Reports</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Magisterial District Courts</CardTitle>
                <CardDescription className="mt-1">
                  Configure district courts that will appear as folders in Bail Reports
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleDialogClose()} className="gap-2">
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
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="districtNumber">District Number</Label>
                      <Input
                        id="districtNumber"
                        placeholder="e.g., 15-1-01"
                        value={formData.districtNumber}
                        onChange={(e) => setFormData({ ...formData, districtNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="e.g., 123 Court Street, Philadelphia, PA"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleDialogClose}>
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

        {/* Info Card */}
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
                  Each magisterial district court you add here will automatically appear as a folder in the Bail Reports
                  section. Users can upload bail reports to specific court folders, making it easy to organize documents
                  by district.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
