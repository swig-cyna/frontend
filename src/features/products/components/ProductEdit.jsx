"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ProductImageLoaded } from "@/features/products/components/ProductImageLoaded"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createProductSchema } from "../schemas/createProduct"

export const ProductEdit = ({ product, onSave, isLoading }) => {
  const [images, setImages] = useState([])

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      interval: product?.interval || "month",
      price: product?.price || 0,
    },
  })

  const hanleImageUploaded = (imageId) => {
    setImages((prev) => [...prev, imageId])
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data) => {
    onSave({ ...data, images })
  }

  useEffect(() => {
    if (product) {
      setImages(product.images)
    }
  }, [product])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="100 €"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-40"
                    placeholder="Product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProductImageLoaded
            images={images}
            onUploaded={hanleImageUploaded}
            removeImage={handleRemoveImage}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
