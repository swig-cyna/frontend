"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

import { TableSkeleton } from "@/components/TableSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteUserDialog } from "@/features/users/components/DeleteUserDialog"
import { EditUserDialog } from "@/features/users/components/EditUserDialog"
import {
  getRoleBadgeVariant,
  translateUserRole,
} from "@/features/users/utils/functions"

export function UserTable({ users, refreshUsers, loading }) {
  const [userToEdit, setUserToEdit] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)

  if (loading) {
    return (
      <TableSkeleton
        columns={["Name", "Email", "Role", "Date Added", "Actions"]}
        rows={5}
      ></TableSkeleton>
    )
  }

  if (users?.length === 0) {
    return <div>No user to display</div>
  }

  return (
    <>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {translateUserRole(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setUserToEdit(user)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setUserToDelete(user)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {userToEdit && (
        <EditUserDialog
          user={userToEdit}
          open={Boolean(userToEdit)}
          onOpenChange={(open) => !open && setUserToEdit(null)}
          onRoleUpdated={refreshUsers}
        />
      )}

      {userToDelete && (
        <DeleteUserDialog
          user={userToDelete}
          open={Boolean(userToDelete)}
          onOpenChange={(open) => !open && setUserToDelete(null)}
          onUserRemoved={refreshUsers}
        />
      )}
    </>
  )
}
