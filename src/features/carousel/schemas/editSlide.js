import { z } from "zod"

export const editSlideSchema = z.object({
  id: z.number(),
  title: z.string().min(2, {
    message: "Title must contain at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must contain at least 10 characters.",
  }),
  link: z.string().url({
    message: "Please enter a valid URL.",
  }),
})
