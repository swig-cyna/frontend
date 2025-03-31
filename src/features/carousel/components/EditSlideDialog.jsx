"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { editSlideSchema } from "../schemas/editSlide"

export function EditSlideDialog({ slide, open, onOpenChange, onUpdateSlide }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(slide.imageUrl)

  const form = useForm({
    resolver: zodResolver(editSlideSchema),
    defaultValues: {
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
      link: slide.link,
    },
  })

  useEffect(() => {
    form.reset({
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
      link: slide.link,
    })
    setPreviewImage(slide.imageUrl)
  }, [slide, form])

  function onSubmit(values) {
    setIsSubmitting(true)

    // Simulate API delay
    setTimeout(() => {
      onUpdateSlide({
        ...slide,
        ...values,
      })
      setIsSubmitting(false)
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
          <DialogTitle>Edit slide</DialogTitle>
          <DialogDescription>Modify the slide information.</DialogDescription>
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
                    <Input {...field} />
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
                    <Textarea className="resize-none" {...field} />
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
                    <Input {...field} />
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
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
