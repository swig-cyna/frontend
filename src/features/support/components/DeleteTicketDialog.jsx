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
import { toast } from "@/hooks/useToast"
import { apiClient } from "@/utils/fetch"
import { useState } from "react"

export function DeleteTicketDialog({
  ticket,
  open,
  onOpenChange,
  onTicketRemoved,
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await apiClient
        .delete(`tickets/${ticket.id}`, {
          credentials: "include",
        })
        .json()

      console.log(response)

      if (response.error) {
        throw response.error
      }

      toast({
        title: "Ticket deleted",
        description: `${ticket.title} has been successfully deleted.`,
      })

      onOpenChange(false)

      if (onTicketRemoved) {
        onTicketRemoved()
      }
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete ticket",
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
            This action cannot be undone. This will permanently delete the
            ticket <strong>{ticket.title}</strong> and remove the data from our
            servers.
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
