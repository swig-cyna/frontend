import z from "zod"

export const createPlantSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce.number().min(1, { message: "Price must be greater than 0" }),
  discount: z.coerce
    .number()
    .min(1, { message: "discount must be greater than 0" }),
  description: z.string().min(1, { message: "Description is required" }),
  interval: z.enum(["day", "week", "month", "year"]),
})
