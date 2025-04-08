"use client"

import { Card } from "@/components/ui/card"
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
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { ProductImageCarousel } from "@/features/products/components/ProductImageCarousel"
import { ProductImageLoaded } from "@/features/products/components/ProductImageLoaded"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  currency: z.number().min(1, { message: "Currency is required" }),
  interval: z.enum(["day", "week", "month", "year"]),
})

export default function CreateProduct() {
  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      currency: "EUR",
      interval: "month",
      price: "",
    },
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <>
      <DashboardHeader heading="Create a new product"></DashboardHeader>
      <Card className="mt-4 p-6">
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
                        <Input type="number" placeholder="100 €" {...field} />
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

            <ProductImageCarousel
              images={[
                "https://placehold.co/600x400/png",
                "https://placehold.co/500x500/png",
                "https://placehold.co/600x400/png",
              ]}
            />
            <ProductImageLoaded
              images={[
                "https://placehold.co/600x400/png",
                "https://placehold.co/500x500/png",
                "https://placehold.co/600x400/png",
              ]}
            />
          </form>
        </Form>
      </Card>
    </>
  )
}
