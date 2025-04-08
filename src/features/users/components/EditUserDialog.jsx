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
import { editUserSchema } from "@/features/users/schemas/editUser"
import { authClient } from "@/features/auth/utils/authClient"
import { toast } from "@/hooks/useToast"

export function EditUserDialog({ user, open, onOpenChange, onRoleUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      role: user.role,
    },
  })

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true)

      const { error } = await authClient.admin.setRole({
        userId: user.id,
        role: values.role,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Role updated",
        description: `${user.name} is now ${values.role}.`,
      })

      form.reset()
      onOpenChange(false)

      if (onRoleUpdated) {
        onRoleUpdated()
      }
    } catch (error) {
      toast({
        title: "Role update failed",
        description: error.message || "Failed to update role",
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
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>Change the role of {user.name}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium">Name:</p>
                <p className="col-span-3 text-sm">{user.name}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium">Email:</p>
                <p className="col-span-3 text-sm">{user.email}</p>
              </div>
            </div>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="user">Customer</SelectItem>
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
