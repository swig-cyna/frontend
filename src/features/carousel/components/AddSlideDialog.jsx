"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addSlideSchema } from "../schemas/addSlide"

export function AddSlideDialog({ open, onOpenChange, onAddSlide }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const form = useForm({
    resolver: zodResolver(addSlideSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "/placeholder.svg?height=600&width=1200",
      link: "",
    },
  })

  function onSubmit(values) {
    setIsSubmitting(true)

    // Simulate API delay
    setTimeout(() => {
      onAddSlide(values)
      setIsSubmitting(false)
      form.reset()
      setPreviewImage(null)
    }, 1000)
  }

  const handleImageUrlChange = (url) => {
    form.setValue("imageUrl", url)
    setPreviewImage(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add a slide</DialogTitle>
          <DialogDescription>
            Add a new slide to your homepage carousel.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="New electronic products" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Discover our new range of high-end electronic products."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                      />
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border">
                        {previewImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={() => setPreviewImage(null)}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <ImagePlus className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/page" {...field} />
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
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
