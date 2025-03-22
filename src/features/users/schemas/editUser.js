import { z } from "zod"

export const editUserSchema = z.object({
  role: z.string({
    required_error: "Please select a role.",
  }),
})
