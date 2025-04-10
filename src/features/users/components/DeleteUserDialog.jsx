"use client"

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
import { authClient } from "@/features/auth/utils/authClient"
import { toast } from "@/hooks/useToast"
import { useState } from "react"

export function DeleteUserDialog({ user, open, onOpenChange, onUserRemoved }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const { error } = await authClient.admin.removeUser({
        userId: user.id,
      })

      if (error) {
        throw error
      }

      toast({
        title: "User deleted",
        description: `${user.name} has been successfully deleted.`,
      })

      onOpenChange(false)

      if (onUserRemoved) {
        onUserRemoved()
      }
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user{" "}
            <strong>{user.name}</strong> ({user.email}) and remove their data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Loading..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
