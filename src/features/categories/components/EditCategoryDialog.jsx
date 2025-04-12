"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/useToast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { useForm } from "react-hook-form"
import { useUpdateCategory } from "../hooks/useCategory"
import { addCategorySchema } from "../schemas/addCategory"
import CategoriesItem from "./CategoriesItem"

export function EditCategoryDialog({ category, open, onOpenChange }) {
  const { mutateAsync: editCategory, isPending } = useUpdateCategory(
    category.id,
  )
  const [color, setColor] = useState(category?.color)

  const form = useForm({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: category.name,
      color: category.color,
    },
  })

  const handleChangeColor = (colorSelected) => {
    setColor(colorSelected)
    form.setValue("color", colorSelected)
  }

  const onSubmit = async (values) => {
    await editCategory(values)

    onOpenChange(false)
    form.reset()

    toast({
      title: "Category Updated",
      description: "Your category has been updated successfully.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={() => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex w-full flex-col items-center justify-between gap-3 md:flex-row">
                    <FormControl>
                      <HexColorPicker
                        className="h-12 w-full"
                        color={color}
                        onChange={handleChangeColor}
                      />
                    </FormControl>
                    <CategoriesItem
                      category={{ name: form.watch("name"), color, count: 10 }}
                    />
                  </div>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
