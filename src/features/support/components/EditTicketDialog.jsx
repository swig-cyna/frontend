"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
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
import { TicketService } from "../utils/apiTicketService"
import { ComboboxUser } from "./ComboboxUser"

export function EditTicketDialog({
  ticket,
  open,
  onOpenChange,
  onTicketUpdated,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState([])

  const form = useForm({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      status: ticket.status,
      assigned_to: ticket.assigned_to || null,
    },
  })

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await TicketService.fetchSupportUsers()
        setUsers(usersData)
      } catch (e) {
        console.error(e)
        setUsers([])
      }
    }
    fetchUsers()
  }, [])

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true)

      const { error } = await TicketService.updateTicket(ticket.id, {
        ...values,
        assigned_to: values.assigned_to || null,
      })

      if (error) {
        throw error
      }

      let assignedName = "Nobody"
      if (values.assigned_to) {
        const userObj = users.find((u) => u.value === values.assigned_to)
        assignedName = userObj ? userObj.label : values.assigned_to
      }

      toast({
        title: "Ticket updated",
        description: `Status : ${values.status} | Assigned to : ${assignedName || "Nobody"}`,
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
            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigné à</FormLabel>
                  <FormControl>
                    <ComboboxUser
                      options={users}
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value === "" ? null : value)
                      }}
                      placeholder="Sélectionner un utilisateur..."
                    />
                  </FormControl>
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
