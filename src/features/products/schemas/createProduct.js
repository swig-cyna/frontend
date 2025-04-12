import z from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce.number().min(1, { message: "Price must be greater than 0" }),
  description: z.string().min(1, { message: "Description is required" }),
  interval: z.enum(["day", "week", "month", "year"]),
  category_id: z.coerce.number().optional().nullable(),
  currency: z.enum(["eur", "usd"]).default("eur"),
})
