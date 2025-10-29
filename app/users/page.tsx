"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Pencil, Trash2, Mail, Phone, Building2, Briefcase } from "lucide-react"
import { toast } from "sonner"

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email address"),
  agencyName: z.string().min(1, "Agency name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
})

type UserFormData = z.infer<typeof userSchema>

interface User extends UserFormData {
  id: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      title: "District Attorney",
      email: "john.doe@county.gov",
      agencyName: "County District Attorney's Office",
      phoneNumber: "(555) 123-4567",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      title: "Probation Officer",
      email: "jane.smith@county.gov",
      agencyName: "County Probation Department",
      phoneNumber: "(555) 987-6543",
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...data, id: user.id } : user)))
      toast.success("User updated successfully")
    } else {
      const newUser: User = {
        ...data,
        id: Date.now().toString(),
      }
      setUsers([...users, newUser])
      toast.success("User added successfully")
    }
    handleCloseDialog()
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    reset(user)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
    toast.success("User deleted successfully")
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
    reset({
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      agencyName: "",
      phoneNumber: "",
    })
  }

  const handleAddNew = () => {
    setEditingUser(null)
    reset({
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      agencyName: "",
      phoneNumber: "",
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage system users and their contact information</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>System Users</CardTitle>
              <CardDescription>View and manage all users in the system</CardDescription>
            </div>
            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No users found. Add your first user to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            {user.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {user.agencyName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phoneNumber}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update the user's information below."
                  : "Enter the user's information to add them to the system."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName")} placeholder="John" />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} placeholder="District Attorney" />
                  {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="john.doe@county.gov" />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input id="agencyName" {...register("agencyName")} placeholder="County District Attorney's Office" />
                  {errors.agencyName && <p className="text-sm text-red-600">{errors.agencyName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" {...register("phoneNumber")} placeholder="(555) 123-4567" />
                  {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingUser ? "Update User" : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
