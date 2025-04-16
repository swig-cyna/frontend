"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { editTicketSchema } from "@/features/support/schemas/editTicket"
import { toast } from "@/hooks/useToast"
import { apiClient } from "@/utils/fetch"

export function EditTicketDialog({
  ticket,
  open,
  onOpenChange,
  onTicketUpdated,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      status: ticket.status,
      assigned_to: ticket.assigned_to || "",
    },
  })

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true)

      const { error } = await apiClient.patch(`tickets/${ticket.id}`, {
        json: {
          ...values,
          assigned_to: values.assigned_to || null,
        },
        credentials: "include",
      })

      if (error) {
        throw error
      }

      toast({
        title: "Ticket updated",
        description: `Status : ${values.status} | Assigned to : ${values.assigned_to || "Nobody"}`,
      })

      form.reset()
      onOpenChange(false)

      if (onTicketUpdated) {
        onTicketUpdated()
      }
    } catch (error) {
      toast({
        title: "Ticket update failed",
        description: error.message || "Failed to update ticket",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change ticket</DialogTitle>
          <DialogDescription>
            Change the ticket "{ticket.title}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
