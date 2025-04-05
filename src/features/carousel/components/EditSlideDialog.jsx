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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useEditSlide, useUploadImageSlide } from "../hooks/useSlide"
import { editSlideSchema } from "../schemas/editSlide"
import { getSlideImageUrl } from "../utils/image"

export function EditSlideDialog({ slide, open, onOpenChange }) {
  const [imageFile, setImageFile] = useState(slide.image)

  const { mutateAsync: editSlide, isPending } = useEditSlide()
  const { mutateAsync: uploadImage } = useUploadImageSlide()

  const form = useForm({
    resolver: zodResolver(editSlideSchema),
    defaultValues: {
      id: slide.id,
      title: slide.title,
      image: slide.image,
      description: slide.description,
      link: slide.link,
    },
  })

  const onSubmit = async (values) => {
    await editSlide({ ...values, image: imageFile })
    onOpenChange(false)
  }

  const handleFileChange = async (event) => {
    const [file] = event.target.files

    if (file) {
      const image = await uploadImage(file)
      setImageFile(image.imageId)
    }
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

            <FormItem>
              <FormLabel>Image</FormLabel>

              {imageFile && (
                <Image
                  src={getSlideImageUrl(imageFile)}
                  alt="Preview"
                  height={128}
                  width={128}
                  className="mx-auto h-32 w-auto rounded-md object-cover"
                />
              )}

              <FormControl>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
