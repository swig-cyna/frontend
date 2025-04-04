"use client"

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
import { toast } from "@/hooks/useToast"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAddSlide, useUploadImageSlide } from "../hooks/useSlide"
import { addSlideSchema } from "../schemas/addSlide"
import { getSlideImageUrl } from "../utils/image"

export function AddSlideDialog({ open, onOpenChange, onAddSlide }) {
  const [imageFile, setImageFile] = useState(null)

  const { mutateAsync: addSlide, isPending } = useAddSlide()
  const { mutateAsync: uploadImage } = useUploadImageSlide()

  const form = useForm({
    resolver: zodResolver(addSlideSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      link: "",
    },
  })

  const onSubmit = async (values) => {
    await addSlide({ ...values, image: imageFile })

    onAddSlide(false)
    form.reset()
    setImageFile(null)

    toast({
      title: "Slide Added",
      description: "The slide has been successfully added to the carousel.",
    })
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

            <FormItem>
              <FormLabel>Image</FormLabel>
              {imageFile && (
                <Image
                  src={getSlideImageUrl(imageFile)}
                  alt="Preview"
                  height={128}
                  width={128}
                  className="mx-auto w-auto rounded-md object-cover"
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
                {isPending ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
